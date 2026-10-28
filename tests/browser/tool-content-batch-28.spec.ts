import { PDFDocument } from "pdf-lib";
import { expect, test } from "@playwright/test";

const tools = ["url-slug-generator", "unicode-code-point-checker", "pdf-page-size-checker", "chinese-number-kanji-converter", "rmb-uppercase-converter"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 28 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 28 examples match browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/url-slug-generator`);
  await page.locator("main textarea").first().fill("Crème brûlée: A Guide");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("creme-brulee-a-guide");

  await page.goto(`${baseURL}/en/tools/unicode-code-point-checker`);
  await page.locator("main textarea").first().fill("A😀");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toContainText('"codePoint": "U+0041"');
  await expect(page.locator("main pre")).toContainText('"codePoint": "U+1F600"');
  await expect(page.locator("main pre")).toContainText('"utf8Bytes": 4');

  const pdf = await PDFDocument.create();
  pdf.addPage([612, 792]);
  const pdfBytes = await pdf.save();
  await page.goto(`${baseURL}/en/tools/pdf-page-size-checker`);
  await page.locator("#pdf-page-size-file").setInputFiles({ name: "fixture.pdf", mimeType: "application/pdf", buffer: Buffer.from(pdfBytes) });
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toContainText("612.00 × 792.00 pt");
  await expect(page.locator("main pre")).toContainText("215.90 × 279.40 mm");

  await page.goto(`${baseURL}/en/tools/chinese-number-kanji-converter`);
  await page.locator("main textarea").fill("10001");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("一万零一");

  await page.goto(`${baseURL}/en/tools/rmb-uppercase-converter`);
  await page.locator("main textarea").fill("123.45");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("壹佰贰拾叁元肆角伍分");
});

test("batch 28 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
