import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import ts from "typescript";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
export const INDEXNOW_KEY = "bc52d22e38f7489988b717aa090fbdfb";
export const INDEXNOW_KEY_LOCATION = `https://www.woori.today/${INDEXNOW_KEY}.txt`;
export const SITE_ORIGIN = "https://www.woori.today";
export const LOCALES = ["ko", "en", "ja", "zh"];
const registryPath = "src/registry/tools.ts";

async function importRegistry(source) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

export function createIndexNowUrls(tools, slugs = null) {
  const publicTools = tools.filter(({ isPublic }) => isPublic);
  const selectedTools = slugs === null ? publicTools : publicTools.filter(({ slug }) => slugs.has(slug));
  const paths = ["/tools", ...selectedTools.map(({ slug }) => `/tools/${slug}`)];
  return [...new Set(paths.flatMap((path) => LOCALES.map((locale) => `${SITE_ORIGIN}/${locale}${path}`)))];
}

export function createIndexNowBody(urlList) {
  return {
    host: "www.woori.today",
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: [...new Set(urlList)],
  };
}

function gitOutput(...args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

async function getSubmissionSlugs(tools, baseSha) {
  if (!baseSha) return null;

  try {
    const changedPaths = gitOutput("diff", "--name-only", `${baseSha}...HEAD`).split(/\r?\n/).filter(Boolean);
    if (
      changedPaths.some(
        (path) =>
          path !== registryPath &&
          ![".github/workflows/deploy.yml", "scripts/submit-indexnow.mjs"].includes(path) &&
          path !== `public/${INDEXNOW_KEY}.txt`,
      )
    ) {
      console.log("Changed tool implementation files detected; submitting all public registry tools.");
      return null;
    }
    if (!changedPaths.includes(registryPath)) return new Set();

    const previousSource = gitOutput("show", `${baseSha}:${registryPath}`);
    const previousModule = await importRegistry(previousSource);
    const metadata = ({ slug, category, title, description, keywords, isPublic }) =>
      JSON.stringify({ slug, category, title, description, keywords, isPublic });
    const previousBySlug = new Map(previousModule.tools.map((tool) => [tool.slug, metadata(tool)]));
    return new Set(tools.filter((tool) => previousBySlug.get(tool.slug) !== metadata(tool)).map(({ slug }) => slug));
  } catch (error) {
    console.warn(`Could not compare the registry with ${baseSha}; submitting all public registry tools.`, error.message);
    return null;
  }
}

export async function buildIndexNowBody({ baseSha = process.env.INDEXNOW_BASE_SHA } = {}) {
  const source = await readFile(new URL(`../${registryPath}`, import.meta.url), "utf8");
  const { tools } = await importRegistry(source);
  const changedSlugs = await getSubmissionSlugs(tools, baseSha);
  return createIndexNowBody(createIndexNowUrls(tools, changedSlugs));
}

export async function submitIndexNow({ dryRun = process.env.INDEXNOW_DRY_RUN === "true", baseSha } = {}) {
  const body = await buildIndexNowBody({ baseSha });
  if (dryRun) {
    console.log(JSON.stringify(body, null, 2));
    return body;
  }

  console.log(`Checking IndexNow key file: ${INDEXNOW_KEY_LOCATION}`);
  const keyResponse = await fetch(INDEXNOW_KEY_LOCATION);
  if (!keyResponse.ok) {
    throw new Error(`IndexNow key file is not reachable: HTTP ${keyResponse.status} ${keyResponse.statusText}`);
  }
  const publishedKey = (await keyResponse.text()).trim();
  if (publishedKey !== INDEXNOW_KEY) {
    throw new Error("IndexNow key file content does not match the configured API key.");
  }
  console.log("IndexNow key file is reachable and matches the configured key.");

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const details = (await response.text()).trim();
    const suffix = details ? `: ${details.slice(0, 2000)}` : "";
    throw new Error(`IndexNow submission failed: HTTP ${response.status} ${response.statusText}${suffix}`);
  }
  console.log(`Submitted ${body.urlList.length} URLs to IndexNow (HTTP ${response.status}).`);
  return body;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  submitIndexNow().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
