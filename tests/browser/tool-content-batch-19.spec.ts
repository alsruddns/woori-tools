import { expect, test } from "@playwright/test";

const tools = ["image-brightness", "image-contrast", "image-blur", "image-pixelate", "remove-image-metadata"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 19 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("image filters change pixels and metadata removal drops EXIF from JPEG output", async ({ page, baseURL }) => {
  const images = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 12;
    canvas.height = 8;
    const ctx = canvas.getContext("2d")!;
    const encode = (mime: string) => new Promise<string>((resolve, reject) => canvas.toBlob(async blob => {
      if (!blob) return reject(new Error(`Could not create ${mime}`));
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = "";
      bytes.forEach(byte => { binary += String.fromCharCode(byte); });
      resolve(btoa(binary));
    }, mime, 0.95));
    ctx.fillStyle = "#404040"; ctx.fillRect(0, 0, 6, 8);
    ctx.fillStyle = "#c0c0c0"; ctx.fillRect(6, 0, 6, 8);
    const tones = await encode("image/png");
    ctx.fillStyle = "#000000"; ctx.fillRect(0, 0, 6, 8);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(6, 0, 6, 8);
    const edge = await encode("image/png");
    for (let x = 0; x < 12; x++) for (let y = 0; y < 8; y++) {
      ctx.fillStyle = (x + y) % 2 ? "#ffffff" : "#000000";
      ctx.fillRect(x, y, 1, 1);
    }
    const checker = await encode("image/png");
    const jpeg = await encode("image/jpeg");
    return { tones, edge, checker, jpeg };
  });
  const run = async (slug: string, base64: string, filename: string) => {
    await page.goto(`${baseURL}/en/tools/${slug}`);
    await page.locator('input[type="file"]').setInputFiles({ name: filename, mimeType: filename.endsWith("jpg") ? "image/jpeg" : "image/png", buffer: Buffer.from(base64, "base64") });
    await page.getByRole("button", { name: "Process", exact: true }).click();
    const link = page.locator('a[download]');
    await expect(link).toBeVisible();
    return link.evaluate(async anchor => {
      const blob = await (await fetch((anchor as HTMLAnchorElement).href)).blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas"); canvas.width = bitmap.width; canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d")!; ctx.drawImage(bitmap, 0, 0);
      const sample = (x: number, y: number) => Array.from(ctx.getImageData(x, y, 1, 1).data).slice(0, 3);
      const bytes = new Uint8Array(await blob.arrayBuffer()); let binary = "";
      bytes.forEach(byte => { binary += String.fromCharCode(byte); });
      const result = { mime: blob.type, width: bitmap.width, height: bitmap.height, name: (anchor as HTMLAnchorElement).download, left: sample(2, 4), middle: sample(5, 4), right: sample(9, 4), base64: btoa(binary) };
      bitmap.close(); canvas.width = 0; canvas.height = 0;
      return result;
    });
  };

  const brightness = await run("image-brightness", images.tones, "tones.png");
  expect(brightness.mime).toBe("image/jpeg");
  expect([brightness.width, brightness.height, brightness.name.endsWith(".jpg")]).toEqual([12, 8, true]);
  expect(brightness.left[0]).toBeLessThan(40); // default 25% brightness

  const contrast = await run("image-contrast", images.tones, "tones.png");
  const sourceGap = 192 - 64;
  const resultGap = Math.abs(contrast.left[0] - contrast.right[0]);
  expect(resultGap).toBeLessThan(sourceGap);

  const blur = await run("image-blur", images.edge, "edge.png");
  expect(blur.middle[0]).toBeGreaterThan(20);
  expect(blur.middle[0]).toBeLessThan(235);

  const pixelate = await run("image-pixelate", images.checker, "checker.png");
  expect(Math.abs(pixelate.left[0] - pixelate.right[0])).toBeLessThan(30);

  const source = Buffer.from(images.jpeg, "base64");
  const payload = Buffer.concat([
    Buffer.from([0x45, 0x78, 0x69, 0x66, 0, 0]),
    Buffer.from([0x49, 0x49, 42, 0, 8, 0, 0, 0, 1, 0, 0x0f, 0x01, 2, 0, 5, 0, 0, 0, 26, 0, 0, 0, 0, 0, 0, 0]),
    Buffer.from("TEST\0"),
  ]);
  const segment = Buffer.alloc(4 + payload.length);
  segment[0] = 0xff; segment[1] = 0xe1; segment.writeUInt16BE(payload.length + 2, 2); payload.copy(segment, 4);
  const withExif = Buffer.concat([source.subarray(0, 2), segment, source.subarray(2)]);
  expect(withExif.includes(Buffer.from("Exif\0\0"))).toBeTruthy();
  const cleaned = await run("remove-image-metadata", withExif.toString("base64"), "with-exif.jpg");
  const cleanBytes = Buffer.from(cleaned.base64, "base64");
  expect(cleaned.mime).toBe("image/jpeg");
  expect([cleaned.width, cleaned.height, cleaned.name.endsWith(".jpg")]).toEqual([12, 8, true]);
  expect(cleanBytes.includes(Buffer.from("Exif\0\0"))).toBe(false);
});

test("batch 19 image pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
