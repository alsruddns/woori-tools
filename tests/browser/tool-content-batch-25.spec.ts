import { expect, test } from "@playwright/test";

const tools = ["numbers4-number-generator", "bingo5-number-generator", "jwt-decoder", "url-query-parameter-parser", "user-agent-parser"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 25 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 25 examples match the lottery and browser-side developer processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/numbers4-number-generator`);
  await page.evaluate(() => { Math.random = () => 0; });
  await page.getByRole("button", { name: "Generate Numbers 4", exact: true }).click();
  await expect(page.locator("main")).toContainText("0000");

  await page.goto(`${baseURL}/en/tools/bingo5-number-generator`);
  await page.evaluate(() => { Math.random = () => 0; });
  await page.getByRole("button", { name: "Generate Bingo 5", exact: true }).click();
  await expect(page.locator("main")).toContainText("1 · 6 · 11 · 16 · FREE · 21 · 26 · 31 · 36");

  await page.goto(`${baseURL}/en/tools/jwt-decoder`);
  await page.locator("main textarea").first().fill("header.eyJzdWIiOiJkZW1vIiwiZXhwIjoyMDAwfQ.signature");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText('"sub": "demo"');
  await expect(page.locator("main")).toContainText("Expiry status:");

  await page.goto(`${baseURL}/en/tools/url-query-parameter-parser`);
  await page.locator("main textarea").first().fill("https://example.test/p?a=1&a=2&empty=");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  const queryOutput = await page.locator("main").innerText();
  expect(queryOutput).toContain("a\t1");
  expect(queryOutput).toContain("a\t2");

  await page.goto(`${baseURL}/en/tools/user-agent-parser`);
  await page.locator("main textarea").first().fill("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText('"browser": "Chrome"');
  await expect(page.locator("main")).toContainText('"os": "Windows"');
});

test("batch 25 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
