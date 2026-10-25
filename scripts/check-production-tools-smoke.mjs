import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const EXPECTED_TOOL_COUNT = 176;
const TARGET_LOCALES = ["fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
const ROUTING_SOURCE = new URL("../src/i18n/routing.ts", import.meta.url);

export function extractRouteLocales(source) {
  return [...source.matchAll(/routeLocale:\s*"([^"]+)"/g)].map((match) => match[1]);
}

export function countToolDetailsByLocale(xml, expectedLocales) {
  const counts = new Map(expectedLocales.map((locale) => [locale, 0]));
  const seen = new Set();
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = new URL(match[1]);
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length !== 3 || segments[1] !== "tools") continue;
    const [locale] = segments;
    if (!counts.has(locale)) throw new Error(`Unexpected locale in Tools sitemap: ${locale}`);
    if (seen.has(url.href)) throw new Error(`Duplicate Tools sitemap URL: ${url.href}`);
    seen.add(url.href);
    counts.set(locale, counts.get(locale) + 1);
  }
  return counts;
}

export function validateLocalizedPageHtml(html, url, locale) {
  const normalizedHtml = html.toLowerCase();
  const canonicalTag = [...normalizedHtml.matchAll(/<link\b[^>]*>/g)].map((match) => match[0]).find((tag) => /\brel="canonical"/.test(tag));
  const canonical = canonicalTag?.match(/\bhref="([^"]+)"/)?.[1];
  if (canonical !== url) throw new Error(`Canonical mismatch for ${url}: ${canonical ?? "missing"}`);
  if (!normalizedHtml.includes(`hreflang="${locale}"`)) throw new Error(`Missing ${locale} hreflang on ${url}`);
  if (!normalizedHtml.includes('hreflang="x-default"')) throw new Error(`Missing x-default hreflang on ${url}`);
  if (!/<h1\b[^>]*>\s*[^<\s]/.test(normalizedHtml)) throw new Error(`Missing visible H1 on ${url}`);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, attempts = 12) {
  let lastStatus = "no response";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "cache-control": "no-cache" } });
      if (response.ok) return response;
      lastStatus = `HTTP ${response.status}`;
      if (![404, 408, 429, 500, 502, 503, 504].includes(response.status)) break;
    } catch (error) {
      lastStatus = error instanceof Error ? error.message : String(error);
    }
    if (attempt < attempts) await wait(5_000);
  }
  throw new Error(`${url} failed after ${attempts} attempts: ${lastStatus}`);
}

async function run() {
  const origin = new URL(process.env.PRODUCTION_BASE_URL ?? "https://www.woori.today").origin;
  const canonicalOrigin = new URL(process.env.CANONICAL_BASE_URL ?? origin).origin;
  const deploymentId = process.env.DEPLOY_SHA ?? `${Date.now()}`;
  const routingSource = await readFile(ROUTING_SOURCE, "utf8");
  const locales = extractRouteLocales(routingSource);
  if (locales.length !== 26 || new Set(locales).size !== 26) throw new Error(`Expected 26 unique app locales; found ${locales.length}`);

  const sitemapUrl = new URL("/tools-sitemap.xml", origin);
  sitemapUrl.searchParams.set("deployment_check", deploymentId);
  const sitemapResponse = await fetchWithRetry(sitemapUrl.href);
  const sitemap = await sitemapResponse.text();
  const counts = countToolDetailsByLocale(sitemap, locales);
  for (const locale of locales) {
    const count = counts.get(locale);
    if (count !== EXPECTED_TOOL_COUNT) throw new Error(`${locale} has ${count} Tools sitemap details; expected ${EXPECTED_TOOL_COUNT}`);
  }
  const totalDetails = [...counts.values()].reduce((sum, count) => sum + count, 0);
  if (totalDetails !== 4_576) throw new Error(`Tools sitemap has ${totalDetails} detail URLs; expected 4576`);

  const pagesToCheck = ["ko", ...TARGET_LOCALES].map((locale) => `/${locale}/tools/json-formatter`);
  pagesToCheck.push("/fil/tools/tarot-card");
  for (const path of pagesToCheck) {
    const locale = path.split("/")[1];
    const url = new URL(path, origin);
    url.searchParams.set("deployment_check", deploymentId);
    const response = await fetchWithRetry(url.href);
    const html = await response.text();
    validateLocalizedPageHtml(html, `${canonicalOrigin}${path}`, locale);
  }

  console.log(`Verified ${locales.length} locales × ${EXPECTED_TOOL_COUNT} sitemap detail URLs = ${totalDetails}.`);
  console.log(`Verified canonical, self hreflang, x-default, and rendered H1 on ${pagesToCheck.length} live pages.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
