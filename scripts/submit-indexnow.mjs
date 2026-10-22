import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tsImport } from "tsx/esm/api";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
export const SITE_ORIGIN = "https://www.woori.today";
export const INDEXNOW_HOST = "www.woori.today";
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const registryPath = "src/registry/tools.ts";
const previousRegistryFiles = [registryPath, "src/i18n/routing.ts", "src/lib/country-tool-slugs.ts"];

const [{ tools }, { publishedTargetLocales }] = await Promise.all([
  tsImport("../src/registry/tools.ts", import.meta.url),
  tsImport("../src/i18n/routing.ts", import.meta.url),
]);
const locales = publishedTargetLocales;
export { tools as registryTools, locales as LOCALES };

export function getIndexNowKey() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) throw new Error("INDEXNOW_KEY is required");
  return key;
}

export function getIndexNowKeyLocation() {
  return `${SITE_ORIGIN}/${getIndexNowKey()}.txt`;
}

export function createIndexNowUrls(toolDefinitions = tools, slugs = null) {
  const publicTools = toolDefinitions.filter(({ isPublic }) => isPublic);
  const selectedTools = slugs === null ? publicTools : publicTools.filter(({ slug }) => slugs.has(slug));
  const paths = [{ path: "/tools", locales }, ...selectedTools.map(({ slug, supportedLocales = locales }) => ({ path: `/tools/${slug}`, locales: supportedLocales }))];
  return [...new Set(paths.flatMap(({ path, locales: supported }) => supported.map((locale) => `${SITE_ORIGIN}/${locale}${path}`)))];
}

export function createIndexNowBody(urlList) {
  const key = getIndexNowKey();
  return {
    host: INDEXNOW_HOST,
    key,
    keyLocation: `${SITE_ORIGIN}/${key}.txt`,
    urlList: [...new Set(urlList)],
  };
}

function gitOutput(...args) {
  return execFileSync("git", args, { cwd: projectRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

async function loadRegistryAtCommit(commit) {
  const temporaryRoot = await mkdtemp(join(tmpdir(), "woori-indexnow-"));
  try {
    for (const sourcePath of previousRegistryFiles) {
      const targetPath = join(temporaryRoot, sourcePath);
      await mkdir(dirname(targetPath), { recursive: true });
      await writeFile(targetPath, gitOutput("show", `${commit}:${sourcePath}`), "utf8");
    }
    const previousToolsPath = join(temporaryRoot, registryPath);
    return await tsImport(pathToFileURL(previousToolsPath).href, pathToFileURL(join(temporaryRoot, "indexnow-parent.mjs")).href);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}

async function getSubmissionSlugs(toolDefinitions, baseSha) {
  if (!baseSha) return null;

  try {
    const changedPaths = gitOutput("diff", "--name-only", `${baseSha}...HEAD`).split(/\r?\n/).filter(Boolean);
    const ignoredPaths = [".github/workflows/deploy.yml", "scripts/submit-indexnow.mjs", `public/${process.env.INDEXNOW_KEY ?? ""}.txt`];
    if (changedPaths.some((path) => path !== registryPath && !ignoredPaths.includes(path))) {
      console.log("Changed tool implementation files detected; submitting all public registry tools.");
      return null;
    }
    if (!changedPaths.includes(registryPath)) return new Set();

    const previousModule = await loadRegistryAtCommit(baseSha);
    const metadata = ({ slug, category, title, description, keywords, isPublic, supportedLocales }) =>
      JSON.stringify({ slug, category, title, description, keywords, isPublic, supportedLocales });
    const previousBySlug = new Map(previousModule.tools.map((tool) => [tool.slug, metadata(tool)]));
    return new Set(toolDefinitions.filter((tool) => previousBySlug.get(tool.slug) !== metadata(tool)).map(({ slug }) => slug));
  } catch (error) {
    console.warn(`Could not compare the registry with ${baseSha}; submitting all public registry tools.`, error.message);
    return null;
  }
}

export async function buildIndexNowBody({ baseSha = process.env.INDEXNOW_BASE_SHA } = {}) {
  const changedSlugs = await getSubmissionSlugs(tools, baseSha);
  return createIndexNowBody(createIndexNowUrls(tools, changedSlugs));
}

export async function submitIndexNow({ dryRun = process.env.INDEXNOW_DRY_RUN === "true", baseSha } = {}) {
  const body = await buildIndexNowBody({ baseSha });
  if (dryRun) {
    console.log(JSON.stringify(body, null, 2));
    return body;
  }

  console.log(`Checking IndexNow key file: ${body.keyLocation}`);
  const keyResponse = await fetch(body.keyLocation);
  if (!keyResponse.ok) {
    throw new Error(`IndexNow key file is not reachable: HTTP ${keyResponse.status} ${keyResponse.statusText}`);
  }
  const publishedKey = (await keyResponse.text()).trim();
  if (publishedKey !== body.key) throw new Error("IndexNow key file content does not match INDEXNOW_KEY.");
  console.log("IndexNow key file is reachable and matches INDEXNOW_KEY.");

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
