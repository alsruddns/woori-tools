import { expect, test } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

const tools = ["image-info", "favicon-generator", "image-color-picker", "images-to-pdf", "pdf-merge"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 20 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("image information, favicon, color sample, image PDF, and PDF merge work in the browser", async ({ page, baseURL }) => {
  const fixtures = await page.evaluate(async () => {
    const make = async (width: number, height: number, color: string, type: string) => {
      const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
      const context = canvas.getContext("2d")!; context.fillStyle = color; context.fillRect(0, 0, width, height);
      const blob = await new Promise<Blob>(resolve => canvas.toBlob(value => resolve(value!), type));
      const bytes = new Uint8Array(await blob.arrayBuffer()); let binary = "";
      bytes.forEach(byte => { binary += String.fromCharCode(byte); });
      return btoa(binary);
    };
    return { png: await make(12, 8, "#ff0000", "image/png"), jpeg: await make(8, 12, "#00ff00", "image/jpeg") };
  });

  await page.goto(`${baseURL}/en/tools/image-info`);
  await page.locator('input[type="file"]').setInputFiles({ name: "photo.png", mimeType: "image/png", buffer: Buffer.from(fixtures.png, "base64") });
  await page.getByRole("button", { name: "Process", exact: true }).click();
  const info = page.locator("pre").last();
  await expect(info).toContainText("photo.png");
  await expect(info).toContainText("image/png");
  await expect(info).toContainText("12px");
  await expect(info).toContainText("8px");

  await page.goto(`${baseURL}/en/tools/favicon-generator`);
  await page.locator('input[type="file"]').setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: Buffer.from(fixtures.png, "base64") });
  await page.getByRole("button", { name: "Process", exact: true }).click();
  const favicon = page.locator('a[download]');
  await expect(favicon).toBeVisible();
  const faviconResult = await favicon.evaluate(async anchor => {
    const blob = await (await fetch((anchor as HTMLAnchorElement).href)).blob();
    const bitmap = await createImageBitmap(blob);
    const result = { mime: blob.type, width: bitmap.width, height: bitmap.height, name: (anchor as HTMLAnchorElement).download };
    bitmap.close(); return result;
  });
  expect(faviconResult).toEqual({ mime: "image/png", width: 32, height: 32, name: "logo-favicon-generator.png" });

  await page.goto(`${baseURL}/en/tools/image-color-picker`);
  await page.locator('input[type="file"]').setInputFiles({ name: "red.png", mimeType: "image/png", buffer: Buffer.from(fixtures.png, "base64") });
  await page.locator('canvas[aria-label="Image color picker canvas"]').click({ position: { x: 4, y: 4 } });
  await expect(page.locator("pre").last()).toContainText("#FF0000 · RGB(255, 0, 0)");

  await page.goto(`${baseURL}/en/tools/images-to-pdf`);
  await expect(page.locator('input[type="file"]')).toHaveAttribute("accept", "image/*,.heic,.heif");
  await page.locator('input[type="file"]').setInputFiles([
    { name: "first.png", mimeType: "image/png", buffer: Buffer.from(fixtures.png, "base64") },
    { name: "second.jpg", mimeType: "image/jpeg", buffer: Buffer.from(fixtures.jpeg, "base64") },
  ]);
  await page.getByRole("button", { name: "Process", exact: true }).click();
  const imagePdf = page.locator('a[download]'); await expect(imagePdf).toBeVisible();
  const imagePdfBytes = await imagePdf.evaluate(async anchor => Array.from(new Uint8Array(await (await fetch((anchor as HTMLAnchorElement).href)).arrayBuffer())));
  const imagePdfDoc = await PDFDocument.load(new Uint8Array(imagePdfBytes));
  expect(imagePdfDoc.getPageCount()).toBe(2);
  expect(imagePdfDoc.getPages().map(page => [page.getWidth(), page.getHeight()])).toEqual([[12, 8], [8, 12]]);

  const firstPdf = await PDFDocument.create(); firstPdf.addPage([72, 36]);
  const secondPdf = await PDFDocument.create(); secondPdf.addPage([100, 200]);
  await page.goto(`${baseURL}/en/tools/pdf-merge`);
  await page.locator('input[type="file"]').setInputFiles([
    { name: "first.pdf", mimeType: "application/pdf", buffer: Buffer.from(await firstPdf.save()) },
    { name: "second.pdf", mimeType: "application/pdf", buffer: Buffer.from(await secondPdf.save()) },
  ]);
  await page.getByRole("button", { name: "Process", exact: true }).click();
  const merged = page.locator('a[download]'); await expect(merged).toBeVisible();
  const mergedBytes = await merged.evaluate(async anchor => Array.from(new Uint8Array(await (await fetch((anchor as HTMLAnchorElement).href)).arrayBuffer())));
  const mergedDoc = await PDFDocument.load(new Uint8Array(mergedBytes));
  expect(mergedDoc.getPages().map(page => [page.getWidth(), page.getHeight()])).toEqual([[72, 36], [100, 200]]);
});

test("batch 20 image and PDF pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
