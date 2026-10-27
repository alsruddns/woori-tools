import { expect, test } from "@playwright/test";

const locales = ["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi", "ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
const viewports = [320, 360, 375, 390, 430, 768, 1024, 1440];
const selectedTools = ["json-formatter", "json-validator", "character-count", "remove-spaces", "remove-line-breaks", "remove-duplicate-lines", "reverse-text", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-characters", "text-repeater", "sort-lines", "shuffle-lines", "text-case-converter", "text-compare", "remove-duplicate-words", "text-to-file"];
const koreanTextBatch = ["character-count", "remove-spaces", "remove-line-breaks", "remove-duplicate-lines", "reverse-text", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-characters", "text-repeater", "sort-lines", "shuffle-lines", "text-case-converter", "text-compare", "remove-duplicate-words", "text-to-file"];

test("Korean text-tool editorial cards are server-rendered and fit the mobile viewport set", async ({ request, page, baseURL }) => {
  for (const slug of koreanTextBatch) {
    const route = `${baseURL}/ko/tools/${slug}`;
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    const html = await response.text();
    expect(html, route).toContain('data-testid="tool-detail-editorial"');
    expect(html, route).toContain("도구별 질문");
    expect(html, route).toContain("</p>");
    expect(html, route).toContain('rel="canonical"');
    expect(html, route).toContain("x-default");
    expect(html, route).not.toMatch(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i);

    await page.goto(route, { waitUntil: "domcontentloaded" });
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("[data-testid=tool-detail-editorial] article").first()).toBeVisible();
      const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      expect(dimensions.document, `${slug} document overflow at ${width}px`).toBeLessThanOrEqual(width);
      expect(dimensions.body, `${slug} body overflow at ${width}px`).toBeLessThanOrEqual(width);
    }
  }
});

test("all authored locale pages render editorial cards in initial server HTML", async ({ request, baseURL }) => {
  const routes = locales.flatMap((locale) => selectedTools.map((slug) => `${baseURL}/${locale}/tools/${slug}`));
  for (let start = 0; start < routes.length; start += 8) {
    const batch = routes.slice(start, start + 8);
    const responses = await Promise.all(batch.map((route) => request.get(route)));
    for (const [index, response] of responses.entries()) {
      expect(response.status(), batch[index]).toBe(200);
      const html = await response.text();
      expect(html, batch[index]).toContain("<h1");
      expect(html, batch[index]).toContain('data-testid="tool-detail-editorial"');
      expect(html, batch[index]).toMatch(/rel="canonical"/i);
      expect(html, batch[index]).toMatch(/hreflang=/i);
      expect(html, batch[index]).toMatch(/x-default/i);
      const sectionStart = html.indexOf('data-testid="tool-detail-editorial"');
      const sectionEnd = html.indexOf("</section>", sectionStart);
      const editorialHtml = html.slice(sectionStart, sectionEnd);
      expect([...editorialHtml.matchAll(/<article\b/g)]).toHaveLength(4);
      expect([...editorialHtml.matchAll(/<h2\b/g)]).toHaveLength(4);
      expect(editorialHtml).toContain("<h3");
      expect(editorialHtml).toContain("<p");
      expect(editorialHtml).not.toMatch(/<[a-z][^>]*(?:\shidden(?:\s|=)|\sinert(?:\s|=)|style="[^"]*display\s*:\s*none)/i);
      expect(html).not.toMatch(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i);
    }
  }
});

test("long-script locales fit all requested viewport widths and formatter remains usable", async ({ page, baseURL }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400) browserErrors.push(`${response.status()} ${response.url()}`);
  });
  const localeSamples = ["en", "de", "pl", "ru", "bn", "el", "ja", "zh-tw"];
  for (const locale of localeSamples) {
    await page.goto(`${baseURL}/${locale}/tools/json-formatter`, { waitUntil: "domcontentloaded" });
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("[data-testid=tool-detail-editorial] article").nth(3)).toBeVisible();
      const overflow = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(overflow.document, `${locale} at ${width}px document overflow`).toBeLessThanOrEqual(width);
      expect(overflow.body, `${locale} at ${width}px body overflow`).toBeLessThanOrEqual(width);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/en/tools/json-formatter`, { waitUntil: "domcontentloaded" });
  await page.locator("#input-text").fill('{"name":"Mina","active":true}');
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main > section").first().locator("pre")).toContainText('"name": "Mina"');
  await expect(page.getByRole("button", { name: "Copy", exact: true })).toBeVisible();
  await page.locator("[data-testid=tool-detail-editorial]").screenshot({ path: "test-results/tool-detail-editorial-en-390.png" });
  await page.goto(`${baseURL}/en/tools/json-validator`, { waitUntil: "domcontentloaded" });
  await page.locator("#input-text").fill('{"name":}');
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("p[role=alert]")).toHaveText("Enter valid JSON.");
  expect(browserErrors).toEqual([]);
});

test("authored text tools execute their documented actions in the browser", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/shuffle-lines`);
  await page.locator("#input-text").fill("red\nblue\nred\n\ngreen");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect.poll(async () => (await page.locator("main > section").first().locator("pre").textContent())?.split("\n").sort()).toEqual(["blue", "green", "red", "red"]);

  await page.goto(`${baseURL}/en/tools/text-case-converter`);
  await page.locator("#input-text").fill("hello WORLD");
  await page.locator("main select").selectOption("upper");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main > section").first().locator("pre")).toHaveText("HELLO WORLD");

  await page.goto(`${baseURL}/en/tools/text-compare`);
  await page.locator("#input-text").fill("color\nsize");
  await page.locator("#second-text").fill("colour\nsize");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main > section").first().locator("pre")).toHaveText("− color\n+ colour");

  await page.goto(`${baseURL}/en/tools/remove-duplicate-words`);
  await page.locator("#input-text").fill("red blue red");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main > section").first().locator("pre")).toHaveText("red blue");

  await page.goto(`${baseURL}/en/tools/text-to-file`);
  await page.locator("#input-text").fill("hello");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  const download = page.locator("a[download]");
  await expect(download).toBeVisible();
  const href = await download.getAttribute("href");
  expect(href).toMatch(/^blob:/);
  await expect.poll(() => page.evaluate(async (url) => {
    const response = await fetch(url!);
    return { type: response.headers.get("content-type"), text: await response.text() };
  }, href)).toEqual({ type: "text/plain;charset=utf-8", text: "hello" });
});
