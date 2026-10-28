import { expect, test } from "@playwright/test";

const tools = ["ip-cidr-calculator", "base32-encoder-decoder", "ulid-generator", "uuid-v7-generator", "hash-compare"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 26 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 26 examples match the browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/ip-cidr-calculator`);
  await page.locator("main textarea").first().fill("192.168.1.15/24");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText('"network": "192.168.1.0"');
  await expect(page.locator("main")).toContainText('"usableCount": "254"');

  await page.goto(`${baseURL}/en/tools/base32-encoder-decoder`);
  await page.locator("main textarea").first().fill("Hello");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("JBSWY3DP");

  await page.goto(`${baseURL}/en/tools/ulid-generator`);
  await page.locator('input[type="number"]').fill("3");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  const ulids = (await page.locator("main").innerText()).match(/\b[0-9A-HJKMNP-TV-Z]{26}\b/g) ?? [];
  expect(ulids).toHaveLength(3);

  await page.goto(`${baseURL}/en/tools/uuid-v7-generator`);
  await page.locator('input[type="number"]').fill("3");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  const uuids = (await page.locator("main").innerText()).match(/\b[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi) ?? [];
  expect(uuids).toHaveLength(3);

  await page.goto(`${baseURL}/en/tools/hash-compare`);
  await page.locator("main textarea").nth(0).fill("SHA-256: ABCD");
  await page.locator("main textarea").nth(1).fill("abcd");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText('"equal": true');
});

test("batch 26 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
