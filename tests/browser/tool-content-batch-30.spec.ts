import { expect, test } from "@playwright/test";

const tools = ["lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter", "germany-iban-validator"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 30 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 30 examples match browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/lakh-crore-converter`);
  await page.locator("main textarea").fill("2 crore");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("20000000");

  await page.goto(`${baseURL}/en/tools/pan-format-validator`);
  await page.locator("main textarea").fill("ABCPA1234F");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("format is valid");

  await page.goto(`${baseURL}/en/tools/gstin-format-validator`);
  await page.locator("main textarea").fill("27AAPFU0939F1ZV");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("checksum is valid");

  await page.goto(`${baseURL}/en/tools/india-phone-number-formatter`);
  await page.locator("main textarea").fill("9876543210");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("+91 98765 43210");

  await page.goto(`${baseURL}/en/tools/germany-iban-validator`);
  await page.locator("main textarea").fill("DE89370400440532013000");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("checksum is valid");
});

test("batch 30 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
