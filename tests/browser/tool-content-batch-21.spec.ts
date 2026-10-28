import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

const tools = ["pdf-split", "pdf-delete-pages", "pdf-reorder-pages", "pdf-rotate-pages", "pdf-add-page-numbers"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 21 editorial cards and SEO are present in initial HTML", async ({ request }) => {
  for (const locale of locales) for (const slug of tools) {
    const response = await request.get(`/${locale}/tools/${slug}`);
    expect(response.ok(), `${locale}/${slug}`).toBeTruthy();
    const html = await response.text();
    expect(html).toContain('data-testid="tool-detail-editorial"');
    expect(html).toContain(`/${locale}/tools/${slug}`);
    expect(html).toMatch(/hrefLang=/i);
    expect(html).toContain("x-default");
  }
});

test("PDF page selection, deletion, reordering, rotation, and numbering work in the browser", async ({ page, baseURL }) => {
  const source = await PDFDocument.create();
  source.addPage([72, 36]); source.addPage([100, 60]); source.addPage([120, 80]);
  const sourceBytes = Buffer.from(await source.save());
  const run = async (slug: string, option?: string) => {
    await page.goto(`${baseURL}/en/tools/${slug}`);
    await page.locator('input[type="file"]').setInputFiles({ name: "triplet.pdf", mimeType: "application/pdf", buffer: sourceBytes });
    await expect(page.getByText("triplet.pdf", { exact: true })).toBeVisible();
    if (option !== undefined) await page.locator(`input[placeholder="${slug === "pdf-reorder-pages" ? "3,1,2" : "1, 3-5"}"]`).fill(option);
    await page.getByRole("button", { name: "Process", exact: true }).click();
    const link = page.locator('a[download]'); await expect(link).toBeVisible({ timeout: 15_000 });
    const bytes = await link.evaluate(async anchor => Array.from(new Uint8Array(await (await fetch((anchor as HTMLAnchorElement).href)).arrayBuffer())));
    return PDFDocument.load(new Uint8Array(bytes));
  };

  const split = await run("pdf-split", "3, 1-2");
  expect(split.getPages().map(p => [p.getWidth(), p.getHeight()])).toEqual([[120, 80], [72, 36], [100, 60]]);
  const deleted = await run("pdf-delete-pages", "2");
  expect(deleted.getPages().map(p => [p.getWidth(), p.getHeight()])).toEqual([[72, 36], [120, 80]]);
  const reordered = await run("pdf-reorder-pages", "3, 1, 2");
  expect(reordered.getPages().map(p => [p.getWidth(), p.getHeight()])).toEqual([[120, 80], [72, 36], [100, 60]]);
  const rotated = await run("pdf-rotate-pages");
  expect(rotated.getPages().map(p => p.getRotation().angle)).toEqual([90, 90, 90]);
  const numbered = await run("pdf-add-page-numbers");
  expect(numbered.getPageCount()).toBe(3);
  expect(numbered.getPages().every(page => page.node.Contents() !== undefined)).toBe(true);
});

test("batch 21 PDF pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
