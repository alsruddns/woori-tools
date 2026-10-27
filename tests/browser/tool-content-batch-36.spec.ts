import { expect, test } from "@playwright/test";

const tools = ["uk-postcode-formatter", "australia-postcode-formatter", "english-date-format-converter"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 36 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 36 examples match browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/uk-postcode-formatter`);
  await page.locator("main textarea").fill("sw1a1aa");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("SW1A 1AA");

  await page.goto(`${baseURL}/en/tools/australia-postcode-formatter`);
  await page.locator("main textarea").fill("2000");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("format is valid");

  await page.goto(`${baseURL}/en/tools/english-date-format-converter`);
  await page.locator("main textarea").fill("2026-03-04");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("03/04/2026");
  await page.getByRole("button", { name: "UK date format", exact: true }).click();
  await page.locator("main textarea").fill("2026-03-04");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("04/03/2026");
  await page.getByRole("button", { name: "UK date format → ISO", exact: true }).click();
  await page.locator("main textarea").fill("04/03/2026");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("2026-03-04");
});

test("batch 36 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
