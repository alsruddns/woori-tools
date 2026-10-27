import { expect, test } from "@playwright/test";

const tools = ["german-number-format-converter", "german-date-format-converter", "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 31 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 31 examples match browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/german-number-format-converter`);
  await page.locator("main textarea").fill("1234567.89");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("1.234.567,89");

  await page.goto(`${baseURL}/en/tools/german-date-format-converter`);
  await page.locator("main textarea").fill("2026-10-13");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("13.10.2026");

  await page.goto(`${baseURL}/en/tools/spain-dni-validator`);
  await page.locator("main textarea").fill("12345678Z");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("checksum is valid");

  await page.goto(`${baseURL}/en/tools/spain-nie-validator`);
  await page.locator("main textarea").fill("X1234567L");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("checksum is valid");

  await page.goto(`${baseURL}/en/tools/spanish-number-format-converter`);
  await page.locator("main textarea").fill("1234567.89");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("1.234.567,89");
});

test("batch 31 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
