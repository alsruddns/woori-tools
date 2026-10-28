import { expect, test } from "@playwright/test";

const tools = ["brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter", "netherlands-iban-validator", "dutch-number-format-converter"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 33 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 33 examples match browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/brazil-cnpj-validator`);
  await page.locator("main textarea").fill("12.ABC.345/01DE-35");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("checksum is valid");

  await page.goto(`${baseURL}/en/tools/brazil-phone-number-formatter`);
  await page.locator("main textarea").fill("11987654321");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("+55 (11) 98765-4321");

  await page.goto(`${baseURL}/en/tools/brazil-cep-formatter`);
  await page.locator("main textarea").fill("01310930");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("01310-930");

  await page.goto(`${baseURL}/en/tools/netherlands-iban-validator`);
  await page.locator("main textarea").fill("NL91ABNA0417164300");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("checksum is valid");

  await page.goto(`${baseURL}/en/tools/dutch-number-format-converter`);
  await page.locator("main textarea").fill("1234567.89");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("1.234.567,89");
});

test("batch 33 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
