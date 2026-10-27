import { expect, test } from "@playwright/test";

const tools = ["chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter", "indian-number-format-converter"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 29 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 29 examples match browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/chinese-zodiac-calculator`);
  await page.locator("main textarea").fill("2024");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("辰");

  await page.goto(`${baseURL}/en/tools/chinese-sexagenary-cycle-calculator`);
  await page.locator("main textarea").fill("1984");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("甲子");

  await page.goto(`${baseURL}/en/tools/chinese-phone-number-formatter`);
  await page.locator("main textarea").fill("13800138000");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("+86 138 0013 8000");

  await page.goto(`${baseURL}/en/tools/taiwan-phone-number-formatter`);
  await page.locator("main textarea").fill("0912345678");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("+886 0912 345 678");

  await page.goto(`${baseURL}/en/tools/indian-number-format-converter`);
  await page.locator("main textarea").fill("100000");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("1,00,000");
});

test("batch 29 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
