import { expect, test } from "@playwright/test";

const tools = ["csv-to-json", "json-to-csv", "base64", "url-encode-decode", "uuid-generator"];
const locales = ["ko", "en", "ja", "zh", "es", "de", "fr", "ru", "pl", "hi"];

test("batch 23 editorial cards and SEO are present in initial HTML", async ({ request }) => {
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

test("CSV, Base64, URL component, and UUID examples match processor output", async ({ page, baseURL }) => {
  const run = async (slug: string, input: string) => {
    await page.goto(`${baseURL}/en/tools/${slug}`);
    await page.locator("textarea").first().fill(input);
    await page.getByRole("button", { name: "Run", exact: true }).click();
    return page.locator("main");
  };

  let main = await run("csv-to-json", "name,active,count\nMina,true,3");
  await expect(main).toContainText('"name": "Mina"');
  await expect(main).toContainText('"active": true');
  await expect(main).toContainText('"count": 3');

  main = await run("json-to-csv", '[{"name":"Mina, Joon","active":true}]');
  await expect(main).toContainText("name,active");
  await expect(main).toContainText('"Mina, Joon",true');

  main = await run("base64", "Hello");
  await expect(main).toContainText("SGVsbG8=");
  await page.locator("textarea").first().fill("7JWI64WV");
  await page.getByRole("combobox").last().selectOption("decode");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main")).toContainText("안녕");

  main = await run("url-encode-decode", "hello world/한글");
  await expect(main).toContainText("hello%20world%2F%ED%95%9C%EA%B8%80");

  await page.goto(`${baseURL}/en/tools/uuid-generator`);
  await page.locator('input[type="number"]').fill("3");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  const text = await page.locator("main").innerText();
  const uuids = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi) ?? [];
  expect(uuids).toHaveLength(3);
  expect(new Set(uuids).size).toBe(3);
});

test("batch 23 data pages fit narrow mobile viewports", async ({ page, baseURL }) => {
  for (const slug of tools) for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${baseURL}/en/tools/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${slug} at ${width}px`).toBe(false);
  }
});
