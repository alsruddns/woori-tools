import { expect, test } from "@playwright/test";

const tools = ["image-resize", "image-crop", "image-rotate", "image-flip", "image-grayscale"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 18 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("image resize, crop, rotation, flip, and grayscale match their controls", async ({ page, baseURL }) => {
  const fixture = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 12;
    canvas.height = 8;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, 6, 8);
    ctx.fillStyle = "#0000ff";
    ctx.fillRect(6, 0, 6, 8);
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(value => resolve(value!), "image/png"));
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  });
  const cases = [
    { slug: "image-resize", size: [6, 4], check: (p: number[][]) => expect(p[0][0]).toBeGreaterThan(0) },
    { slug: "image-crop", size: [8, 8], check: (p: number[][]) => { expect(p[0][0]).toBeGreaterThan(p[0][2]); expect(p[1][2]).toBeGreaterThan(p[1][0]); } },
    { slug: "image-rotate", size: [8, 12], check: (p: number[][]) => { expect(p[0][0]).toBeGreaterThan(p[0][2]); expect(p[1][2]).toBeGreaterThan(p[1][0]); } },
    { slug: "image-flip", size: [12, 8], check: (p: number[][]) => { expect(p[0][2]).toBeGreaterThan(p[0][0]); expect(p[1][0]).toBeGreaterThan(p[1][2]); } },
    { slug: "image-grayscale", size: [12, 8], check: (p: number[][]) => expect(Math.max(...p[0]) - Math.min(...p[0])).toBeLessThanOrEqual(2) },
  ];

  for (const sample of cases) {
    await page.goto(`${baseURL}/en/tools/${sample.slug}`);
    await page.locator('input[type="file"]').setInputFiles({ name: "two-color.png", mimeType: "image/png", buffer: Buffer.from(fixture, "base64") });
    if (sample.slug === "image-resize") {
      await page.getByLabel("Width (px)").fill("6");
      await page.getByLabel("Keep aspect ratio").check();
    } else if (sample.slug === "image-crop") {
      await page.locator("main select").selectOption("1");
    } else if (sample.slug === "image-rotate") {
      await page.locator("main select").selectOption("90");
    } else if (sample.slug === "image-flip") {
      await page.locator("main select").selectOption("horizontal");
    }
    await page.getByRole("button", { name: "Process", exact: true }).click();
    const download = page.locator('a[download]');
    await expect(download).toBeVisible();
    const result = await download.evaluate(async anchor => {
      const blob = await (await fetch((anchor as HTMLAnchorElement).href)).blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(bitmap, 0, 0);
      const pixel = (x: number, y: number) => Array.from(context.getImageData(x, y, 1, 1).data).slice(0, 3);
      const result = { mime: blob.type, width: bitmap.width, height: bitmap.height, name: (anchor as HTMLAnchorElement).download, pixels: [pixel(Math.max(1, Math.floor(bitmap.width / 5)), Math.max(1, Math.floor(bitmap.height / 3))), pixel(Math.max(1, Math.floor(bitmap.width * 4 / 5)), Math.max(1, Math.floor(bitmap.height * 2 / 3)))] };
      bitmap.close();
      canvas.width = 0;
      canvas.height = 0;
      return result;
    });
    expect(result.mime).toBe("image/jpeg");
    expect([result.width, result.height]).toEqual(sample.size);
    expect(result.name.endsWith(".jpg")).toBeTruthy();
    sample.check(result.pixels);
  }
});

test("batch 18 image pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`${baseURL}/en/tools/${slug}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
    }
  }
});
