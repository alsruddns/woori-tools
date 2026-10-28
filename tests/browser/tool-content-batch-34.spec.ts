import { expect, test } from "@playwright/test";

const tools = ["dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter", "italy-fiscal-code-format-validator", "italy-vat-number-validator"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 34 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 34 examples match browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/dutch-date-format-converter`);
  await page.locator("main textarea").fill("2026-10-13");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("13-10-2026");
  await page.getByRole("button", { name: "Local format to ISO", exact: true }).click();
  await page.locator("main textarea").fill("13-10-2026");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("2026-10-13");

  await page.goto(`${baseURL}/en/tools/vietnam-phone-number-formatter`);
  await page.locator("main textarea").fill("0912345678");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("+84 0912 345678");

  await page.goto(`${baseURL}/en/tools/vietnam-number-format-converter`);
  await page.locator("main textarea").fill("1234567.89");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("1.234.567,89");

  await page.goto(`${baseURL}/en/tools/italy-fiscal-code-format-validator`);
  await page.locator("main textarea").fill("RSSMRA85T10A562S");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("checksum is valid");

  await page.goto(`${baseURL}/en/tools/italy-vat-number-validator`);
  await page.locator("main textarea").fill("01114601006");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("checksum is valid");
});

test("batch 34 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
