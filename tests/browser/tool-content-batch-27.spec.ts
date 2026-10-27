import { expect, test } from "@playwright/test";

const tools = ["regex-replace", "html-entity-encoder-decoder", "chmod-calculator", "json-path-tester", "csv-tsv-converter"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 27 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("batch 27 examples match the browser-side processors", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/regex-replace`);
  await page.locator("main textarea").nth(0).fill("/cat/i");
  await page.locator("main textarea").nth(1).fill("Cat cat");
  await page.locator("main textarea").nth(2).fill("dog");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("dog dog");

  await page.goto(`${baseURL}/en/tools/html-entity-encoder-decoder`);
  await page.locator("main textarea").first().fill("<a title='x'>&");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("&lt;a title=&#39;x&#39;&gt;&amp;");

  await page.goto(`${baseURL}/en/tools/chmod-calculator`);
  await page.locator("main textarea").first().fill("755");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText('"symbolic": "rwxr-xr-x"');

  await page.goto(`${baseURL}/en/tools/json-path-tester`);
  await page.locator("main textarea").nth(0).fill('{"items":[{"name":"A"},{"name":"B"}]}');
  await page.locator("main textarea").nth(1).fill("$.items[*].name");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText('"A"');
  await expect(page.locator("main")).toContainText('"B"');

  await page.goto(`${baseURL}/en/tools/csv-tsv-converter`);
  await page.locator("main textarea").first().fill('name,note\nA,"x,y"');
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main pre")).toHaveText("name\tnote\nA\tx,y");
});

test("batch 27 pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
