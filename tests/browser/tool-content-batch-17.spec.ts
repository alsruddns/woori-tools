import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const tools = ["webp-to-png", "jpg-to-webp", "png-to-webp", "heic-to-jpg", "image-compress"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 17 image editors are server rendered with localized SEO", async ({ request }) => {
  for (const locale of locales) {
    for (const slug of tools) {
      const response = await request.get(`/${locale}/tools/${slug}`);
      expect(response.ok(), `${locale}/${slug}`).toBeTruthy();
      const html = await response.text();
      expect(html).toContain('data-testid="tool-detail-editorial"');
      expect(html).toContain(`/${locale}/tools/${slug}`);
      expect(html).toMatch(/hrefLang=/i);
      expect(html).toContain("x-default");
    }
  }
});

test("image outputs have the documented MIME, dimensions, transparency, and download extension", async ({ page, baseURL }) => {
  const fixtures = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 12;
    canvas.height = 8;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, 6, 8);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.clearRect(6, 0, 6, 8);
    const encode = (type: string) => new Promise<string>((resolve, reject) => canvas.toBlob(async blob => {
      if (!blob) return reject(new Error(`No ${type} fixture`));
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = "";
      bytes.forEach(byte => { binary += String.fromCharCode(byte); });
      resolve(btoa(binary));
    }, type, 0.9));
    return { png: await encode("image/png"), jpeg: await encode("image/jpeg"), webp: await encode("image/webp") };
  });
  const samples = [
    { slug: "webp-to-png", source: "webp", mime: "image/png", extension: ".png", alpha: true },
    { slug: "jpg-to-webp", source: "jpeg", mime: "image/webp", extension: ".webp", alpha: false },
    { slug: "png-to-webp", source: "png", mime: "image/webp", extension: ".webp", alpha: true },
    { slug: "image-compress", source: "png", mime: "image/jpeg", extension: ".jpg", alpha: false },
  ] as const;

  for (const sample of samples) {
    await page.goto(`${baseURL}/en/tools/${sample.slug}`);
    const source = fixtures[sample.source];
    await page.locator('input[type="file"]').setInputFiles({
      name: `fixture.${sample.source === "jpeg" ? "jpg" : sample.source}`,
      mimeType: sample.source === "jpeg" ? "image/jpeg" : `image/${sample.source}`,
      buffer: Buffer.from(source, "base64"),
    });
    await page.getByRole("button", { name: "Process", exact: true }).click();
    const result = page.locator('a[download]');
    await expect(result).toBeVisible();
    const output = await result.evaluate(async anchor => {
      const response = await fetch((anchor as HTMLAnchorElement).href);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(bitmap, 0, 0);
      const alpha = context.getImageData(9, 4, 1, 1).data[3];
      const width = bitmap.width;
      const height = bitmap.height;
      bitmap.close();
      canvas.width = 0;
      canvas.height = 0;
      return { mime: blob.type, width, height, alpha, name: (anchor as HTMLAnchorElement).download };
    });
    expect(output.mime).toBe(sample.mime);
    expect(output.width).toBe(12);
    expect(output.height).toBe(8);
    expect(output.name.endsWith(sample.extension)).toBeTruthy();
    expect(output.alpha === 0).toBe(sample.alpha);
  }

  await page.goto(`${baseURL}/en/tools/heic-to-jpg`);
  await page.locator('input[type="file"]').setInputFiles({
    name: "basic-8bit-srgb.heic",
    mimeType: "image/heic",
    buffer: readFileSync(join(process.cwd(), "tests/fixtures/heic/basic-8bit-srgb.heic")),
  });
  await page.getByRole("button", { name: "Process", exact: true }).click();
  const heicOutput = page.locator('a[download]');
  await expect(heicOutput).toBeVisible({ timeout: 30_000 });
  const heicResult = await heicOutput.evaluate(async anchor => {
    const blob = await (await fetch((anchor as HTMLAnchorElement).href)).blob();
    const bitmap = await createImageBitmap(blob);
    const result = { mime: blob.type, width: bitmap.width, height: bitmap.height, name: (anchor as HTMLAnchorElement).download };
    bitmap.close();
    return result;
  });
  expect(heicResult).toEqual({ mime: "image/jpeg", width: 1600, height: 1200, name: "basic-8bit-srgb-heic-to-jpg.jpg" });
});

test("batch 17 image pages do not overflow narrow viewports", async ({ page, baseURL }) => {
  for (const slug of tools) {
    await page.goto(`${baseURL}/en/tools/${slug}`);
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `${slug} at ${width}px`).toBe(false);
    }
  }
});
