import { expect, test } from "@playwright/test";

const tools = ["italy-number-format-converter", "italian-date-format-converter", "us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 35 editorial cards and SEO are present in initial HTML", async ({ request }) => {
  for (const locale of locales) for (const slug of tools) {
    const response = await request.get(`/${locale}/tools/${slug}`);
    expect(response.ok(), `${locale}/${slug}`).toBeTruthy();
    const html = await response.text();
    expect(html, `${locale}/${slug} editorial`).toContain('data-testid="tool-detail-editorial"');
    expect(html).toContain(`/${locale}/tools/${slug}`);
    expect(html).toMatch(/hrefLang=/i);
    expect(html).toContain("x-default");
  }
});

test("batch 35 examples match browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/italy-number-format-converter`);
  await page.locator("main textarea").fill("1234567.89");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("1.234.567,89");

  await page.goto(`${baseURL}/en/tools/italian-date-format-converter`);
  await page.locator("main textarea").fill("2026-10-13");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("13/10/2026");
  await page.getByRole("button", { name: "Local format to ISO", exact: true }).click();
  await page.locator("main textarea").fill("13/10/2026");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("2026-10-13");

  await page.goto(`${baseURL}/en/tools/us-phone-number-formatter`);
  await page.locator("main textarea").fill("2125550123");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("+1 (212) 555-0123");

  await page.goto(`${baseURL}/en/tools/us-zip-code-formatter`);
  await page.locator("main textarea").fill("123456789");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("12345-6789");

  await page.goto(`${baseURL}/en/tools/canada-postal-code-formatter`);
  await page.locator("main textarea").fill("k1a0b1");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("K1A 0B1");
});

test("batch 35 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
