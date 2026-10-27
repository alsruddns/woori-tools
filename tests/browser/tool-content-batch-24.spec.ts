import { expect, test } from "@playwright/test";

const tools = ["timestamp-converter", "wareki-converter", "yakudoshi-calculator", "japanese-zodiac-calculator", "numbers3-number-generator"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 24 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 24 examples match the timestamp and Japan tool processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/timestamp-converter`);
  await page.locator("textarea").first().fill("0");
  await page.getByRole("combobox").last().selectOption("seconds");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("1970-01-01T00:00:00.000Z");
  await page.locator("textarea").first().fill("");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("Unix seconds:");
  await expect(page.locator("main")).toContainText("UTC:");

  await page.goto(`${baseURL}/en/tools/wareki-converter`);
  await page.locator('input[type="date"]').fill("2019-05-01");
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.locator("main")).toContainText("2019-05-01");
  await expect(page.locator("main")).toContainText("1");

  await page.goto(`${baseURL}/en/tools/yakudoshi-calculator`);
  await page.locator('input[type="number"]').nth(0).fill("2000");
  await page.locator("main select").last().selectOption("male");
  await page.locator('input[type="number"]').nth(1).fill("2024");
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.locator("main")).toContainText("2023");
  await expect(page.locator("main")).toContainText("2024");
  await expect(page.locator("main")).toContainText("2025");

  await page.goto(`${baseURL}/en/tools/japanese-zodiac-calculator`);
  await page.locator('input[type="number"]').fill("2024");
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.locator("main")).toContainText("甲辰");

  await page.goto(`${baseURL}/en/tools/numbers3-number-generator`);
  await page.evaluate(() => { Math.random = () => 0; });
  await page.getByRole("button", { name: "Generate Numbers 3", exact: true }).click();
  await expect(page.locator("main")).toContainText("000");
});

test("batch 24 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
