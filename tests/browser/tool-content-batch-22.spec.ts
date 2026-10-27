import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

const tools = ["pdf-watermark", "pdf-metadata-viewer", "pdf-remove-metadata", "json-to-yaml", "yaml-to-json"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 22 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("PDF watermark and metadata tools and JSON/YAML conversion match their descriptions", async ({ page, baseURL }) => {
  const makePdf = async () => {
    const pdf = await PDFDocument.create();
    pdf.setTitle("Review draft"); pdf.setAuthor("Mina"); pdf.setSubject("Quarterly notes");
    pdf.setKeywords(["review", "2026"]); pdf.setCreator("Woori Tools fixture"); pdf.setProducer("fixture producer");
    pdf.addPage([240, 160]);
    return Buffer.from(await pdf.save());
  };
  const inputPdf = await makePdf();
  const upload = async (slug: string) => {
    await page.goto(`${baseURL}/en/tools/${slug}`);
    await page.locator('input[type="file"]').setInputFiles({ name: "review.pdf", mimeType: "application/pdf", buffer: inputPdf });
    await expect(page.getByText("review.pdf", { exact: true })).toBeVisible();
  };

  await upload("pdf-watermark");
  await page.locator('input[placeholder="Woori Tools"]').fill("Review copy");
  await page.getByRole("button", { name: "Process", exact: true }).click();
  const watermarked = page.locator('a[download]'); await expect(watermarked).toBeVisible();
  const watermarkedBytes = await watermarked.evaluate(async a => Array.from(new Uint8Array(await (await fetch((a as HTMLAnchorElement).href)).arrayBuffer())));
  const watermarkedPdf = await PDFDocument.load(new Uint8Array(watermarkedBytes));
  expect(watermarkedPdf.getPageCount()).toBe(1);
  expect(watermarkedPdf.getPages()[0].node.Contents()).toBeDefined();

  await upload("pdf-metadata-viewer");
  await page.getByRole("button", { name: "Process", exact: true }).click();
  const metadata = page.locator("pre").last();
  await expect(metadata).toContainText("Review draft");
  await expect(metadata).toContainText("Mina");
  await expect(metadata).toContainText("Quarterly notes");
  await expect(metadata).toContainText("review");
  await expect(metadata).toContainText("1");
  await expect(metadata).toContainText("Woori Tools fixture");

  await upload("pdf-remove-metadata");
  await page.getByRole("button", { name: "Process", exact: true }).click();
  const cleaned = page.locator('a[download]'); await expect(cleaned).toBeVisible();
  const cleanedBytes = await cleaned.evaluate(async a => Array.from(new Uint8Array(await (await fetch((a as HTMLAnchorElement).href)).arrayBuffer())));
  const cleanedPdf = await PDFDocument.load(new Uint8Array(cleanedBytes), { updateMetadata: false });
  expect([cleanedPdf.getTitle(), cleanedPdf.getAuthor(), cleanedPdf.getSubject(), cleanedPdf.getKeywords(), cleanedPdf.getCreator(), cleanedPdf.getProducer()]).toEqual(["", "", "", "", "", ""]);
  expect(cleanedPdf.getPageCount()).toBe(1);

  await page.goto(`${baseURL}/en/tools/json-to-yaml`);
  await page.locator("textarea").first().fill('{"service":"api","enabled":true}');
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("service: api"); await expect(page.locator("main")).toContainText("enabled: true");

  await page.goto(`${baseURL}/en/tools/yaml-to-json`);
  await page.locator("textarea").first().fill("service: api\nenabled: true");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText('"service": "api"');
  await expect(page.locator("main")).toContainText('"enabled": true');
});

test("batch 22 PDF and data pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
