import { expect, test } from "@playwright/test";

const locales = ["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi", "ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
const viewports = [320, 360, 375, 390, 430, 768, 1024, 1440];
const selectedTools = ["json-formatter", "json-validator", "character-count", "remove-spaces", "remove-line-breaks", "remove-duplicate-lines", "reverse-text", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-characters", "text-repeater", "sort-lines", "shuffle-lines", "text-case-converter", "text-compare", "remove-duplicate-words", "text-to-file", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "simplified-traditional-chinese-converter", "lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator", "tarot-card", "daily-fortune", "saju", "random-number", "random-name-picker", "random-wheel", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "dice-roller", "coin-flip", "stopwatch"];
const koreanTextBatch = ["character-count", "remove-spaces", "remove-line-breaks", "remove-duplicate-lines", "reverse-text", "add-line-numbers", "remove-line-numbers", "remove-empty-lines", "remove-characters", "text-repeater", "sort-lines", "shuffle-lines", "text-case-converter", "text-compare", "remove-duplicate-words", "text-to-file", "hiragana-katakana-converter", "fullwidth-halfwidth-converter", "japanese-romaji-converter", "japanese-number-kanji-converter", "simplified-traditional-chinese-converter", "lotto-number-generator", "powerball-number-generator", "mega-millions-number-generator", "japan-loto6-number-generator", "japan-loto7-number-generator", "japan-mini-loto-number-generator", "tarot-card", "daily-fortune", "saju", "random-number", "random-name-picker", "random-wheel", "draw-lots", "random-team-maker", "random-order", "random-seat", "duty-picker", "dice-roller", "coin-flip", "stopwatch"];

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
      const offenders = await page.evaluate(() => [...document.querySelectorAll("body *")].map((element) => ({ tag: element.tagName, text: (element.textContent || "").trim().slice(0, 70), width: element.getBoundingClientRect().width, right: element.getBoundingClientRect().right, className: typeof element.className === "string" ? element.className : "" })).filter((item) => item.right > window.innerWidth + 1).slice(0, 8));
      expect(dimensions.document, `${slug} document overflow at ${width}px: ${JSON.stringify(offenders)}`).toBeLessThanOrEqual(width);
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

test("Japanese and Chinese conversion examples run in the browser", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/hiragana-katakana-converter`);
  await page.getByRole("textbox").fill("ひらがな");
  await page.getByRole("button", { name: "Hiragana → katakana", exact: true }).click();
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.locator("main > section").first().locator("pre")).toHaveText("ヒラガナ");

  await page.goto(`${baseURL}/en/tools/fullwidth-halfwidth-converter`);
  await page.getByRole("textbox").fill("ＡＢＣ１２３");
  await page.getByRole("button", { name: "Full-width → half-width", exact: true }).click();
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.locator("main > section").first().locator("pre")).toHaveText("ABC123");

  await page.goto(`${baseURL}/en/tools/japanese-romaji-converter`);
  await page.getByRole("textbox").fill("こんにちは");
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.locator("main > section").first().locator("pre")).toHaveText("konnichiha");

  await page.goto(`${baseURL}/en/tools/japanese-number-kanji-converter`);
  await page.getByRole("textbox").fill("123");
  await page.getByRole("button", { name: "Number → kanji", exact: true }).click();
  await page.getByRole("button", { name: "Convert", exact: true }).click();
  await expect(page.locator("main > section").first().locator("pre")).toHaveText("百二十三");

  await page.goto(`${baseURL}/en/tools/simplified-traditional-chinese-converter`);
  await page.getByRole("textbox").fill("简体中文");
  await page.locator("fieldset button").first().click();
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator("main > section").first().locator("pre")).toHaveText("簡體中文");
});

test("lottery tools produce valid game shapes in the browser", async ({ page, baseURL }) => {
  const samples = [
    { slug: "lotto-number-generator", mainCount: 6, max: 45, specialMax: null },
    { slug: "powerball-number-generator", mainCount: 5, max: 69, specialMax: 26 },
    { slug: "mega-millions-number-generator", mainCount: 5, max: 70, specialMax: 24 },
    { slug: "japan-loto6-number-generator", mainCount: 6, max: 43, specialMax: null },
    { slug: "japan-loto7-number-generator", mainCount: 7, max: 37, specialMax: null },
    { slug: "japan-mini-loto-number-generator", mainCount: 5, max: 31, specialMax: null },
  ];
  for (const sample of samples) {
    await page.goto(`${baseURL}/en/tools/${sample.slug}`);
    await page.getByRole("button", { name: "Draw numbers", exact: true }).click();
    const game = page.locator("main > section").first().locator("section.mt-6 article").first();
    await expect(game).toBeVisible();
    const mainNumbers = (await game.locator("span.bg-indigo-100").allTextContents()).map(Number);
    expect(mainNumbers).toHaveLength(sample.mainCount);
    expect(new Set(mainNumbers).size).toBe(sample.mainCount);
    expect(mainNumbers.every((number) => number >= 1 && number <= sample.max)).toBe(true);
    if (sample.specialMax !== null) {
      const special = Number(await game.locator("span.bg-rose-100").textContent());
      expect(special).toBeGreaterThanOrEqual(1);
      expect(special).toBeLessThanOrEqual(sample.specialMax);
    }
  }
});

test("fortune, saju, and random-number examples run in the browser", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/tarot-card`);
  await page.locator("#tarot-question").fill("What should I reflect on today?");
  await page.locator("main select").first().selectOption("three");
  await page.getByRole("button", { name: "Draw cards", exact: true }).click();
  const cards = page.locator("main > section").first().locator("article");
  await expect(cards).toHaveCount(3);
  const names = await cards.locator("h2").allTextContents();
  expect(new Set(names).size).toBe(3);
  for (const card of await cards.all()) await expect(card.locator("p.text-slate-500")).toHaveText(/^(Upright|Reversed)$/);
  await expect(page.locator("#tarot-question")).toHaveAttribute("maxLength", "240");

  await page.goto(`${baseURL}/en/tools/daily-fortune`);
  await page.locator("#fortune-birth").fill("1990-05-17");
  await page.getByRole("button", { name: "See today's fortune", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Lucky number" })).toBeVisible();
  const luckyNumber = Number(await page.getByRole("heading", { name: "Lucky number" }).locator("xpath=following-sibling::p").textContent());
  expect(luckyNumber).toBeGreaterThanOrEqual(1);
  expect(luckyNumber).toBeLessThanOrEqual(6);

  await page.goto(`${baseURL}/en/tools/saju`);
  await page.locator("#saju-date").fill("1990-05-17");
  await page.locator("#saju-time").fill("12:00");
  await page.getByRole("button", { name: "Calculate chart", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Four pillars", exact: true })).toBeVisible();
  await expect(page.locator("main > section").first()).toContainText("庚午");
  await expect(page.locator("main > section").first()).toContainText("丙午");

  await page.goto(`${baseURL}/en/tools/random-number`);
  await page.getByLabel("Minimum").fill("10");
  await page.getByLabel("Maximum").fill("20");
  await page.getByLabel("Winners").fill("3");
  await page.getByRole("button", { name: "Generate numbers", exact: true }).click();
  const values = (await page.locator("main > section").first().locator("section.mt-5 span").allTextContents()).map(Number);
  expect(values).toHaveLength(3);
  expect(new Set(values).size).toBe(3);
  expect(values.every((value) => value >= 10 && value <= 20)).toBe(true);
  expect(values).toEqual([...values].sort((left, right) => left - right));
});

test("participant draws, wheel selection, team assignment, and staged order run in the browser", async ({ page, baseURL }) => {
  for (const slug of ["random-name-picker", "draw-lots"]) {
    await page.goto(`${baseURL}/en/tools/${slug}`);
    await page.locator("#participant-list").fill("Ada\nBo\nCy\nDee");
    await page.getByRole("spinbutton", { name: "Winners" }).fill("2");
    await page.locator("main > section").first().getByRole("button").last().click();
    const entries = await page.locator("main > section").first().locator("section.mt-5 li").allTextContents();
    expect(entries).toHaveLength(2);
    expect(new Set(entries).size).toBe(2);
  }

  await page.goto(`${baseURL}/en/tools/random-wheel`);
  await page.locator("#wheel-options").fill("Tea\nTea\nCoffee");
  const wheel = page.locator('svg[role="img"]');
  await expect(wheel).toHaveAttribute("aria-label", "Tea, Coffee");
  await page.getByLabel("Allow duplicate entries").check();
  await expect(wheel).toHaveAttribute("aria-label", "Tea, Tea, Coffee");
  await page.locator("main select").selectOption("3000");
  await page.getByRole("button", { name: "Spin the wheel", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Selected choice", exact: true })).toBeVisible({ timeout: 6000 });

  await page.goto(`${baseURL}/en/tools/random-team-maker`);
  await page.locator("#team-participants").fill("Ada\nBo\nCy\nDee\nEli\nFlo");
  await page.getByLabel("Number of teams").fill("2");
  await page.locator("main > section").first().getByRole("button").last().click();
  const teamCards = page.locator("main > section").first().locator("section.mt-5 article");
  await expect(teamCards).toHaveCount(2);
  const assigned = (await teamCards.locator("li").allTextContents()).sort();
  expect(assigned).toEqual(["Ada", "Bo", "Cy", "Dee", "Eli", "Flo"].sort());

  await page.goto(`${baseURL}/en/tools/random-order`);
  await page.locator("#order-people").fill("Ada\nBo\nCy");
  await page.locator("main > section").first().getByRole("button").filter({ hasText: "Generate numbers" }).click();
  await expect(page.locator("main > section").first().locator("ol li")).toHaveCount(3);
  await page.getByRole("button", { name: "Reveal all", exact: true }).click();
  const order = (await page.locator("main > section").first().locator("ol li").allTextContents()).map((entry) => entry.replace(/^\d+\.\s*/, ""));
  expect(new Set(order)).toEqual(new Set(["Ada", "Bo", "Cy"]));
});

test("seat assignment, duty rotation, dice, coin flips, and stopwatch work in the browser", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/random-seat`);
  await page.locator("#seat-people").fill("Ada\nBo\nCy");
  await page.getByLabel("Rows").fill("2");
  await page.getByLabel("Columns").fill("2");
  await page.getByRole("button", { name: "Assign seats", exact: true }).click();
  const seatCells = page.locator("main > section").first().locator(".mt-5.grid.gap-2 > div");
  await expect(seatCells).toHaveCount(4);
  const seatText = await seatCells.allTextContents();
  for (const person of ["Ada", "Bo", "Cy"]) expect(seatText.join(" ")).toContain(person);
  expect(seatText.join(" ")).toContain("Empty");

  await page.goto(`${baseURL}/en/tools/duty-picker`);
  await page.locator("#input-text").fill("Ada\nBo\nCy");
  await page.locator("#second-text").fill("Clean\nGuide");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  const dutyLines = (await page.locator("main > section").first().locator("pre").textContent())!.split("\n");
  expect(dutyLines).toHaveLength(3);
  for (const person of ["Ada", "Bo", "Cy"]) expect(dutyLines.filter((line) => line.startsWith(person))).toHaveLength(1);
  expect(dutyLines.every((line) => line.includes("Clean") || line.includes("Guide"))).toBe(true);

  await page.goto(`${baseURL}/en/tools/dice-roller`);
  await page.getByLabel("Number of dice").fill("20");
  await page.getByRole("button", { name: "Roll dice", exact: true }).click();
  await expect(page.locator("main > section").first().locator(".size-14")).toHaveCount(20);
  const dice = (await page.locator("main > section").first().locator(".size-14").allTextContents()).map(Number);
  expect(dice.every((value) => value >= 1 && value <= 6)).toBe(true);

  await page.goto(`${baseURL}/en/tools/coin-flip`);
  await page.getByRole("spinbutton").fill("100");
  await page.getByRole("button", { name: "Run", exact: true }).click();
  const coinText = (await page.locator("main > section").first().locator("pre").textContent())!;
  const heads = Number(coinText.match(/Heads: (\d+)/)?.[1]);
  const tails = Number(coinText.match(/Tails: (\d+)/)?.[1]);
  expect(heads + tails).toBe(100);
  expect(coinText).toContain(`Heads ratio: ${((heads / 100) * 100).toFixed(1)}%`);

  await page.goto(`${baseURL}/en/tools/stopwatch`);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByRole("button", { name: "Lap", exact: true }).click();
  await page.getByRole("button", { name: "Lap", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.locator("main > section").first().locator("ol li")).toHaveCount(2);
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.locator("main > section").first().locator("ol li")).toHaveCount(0);
});

test("Batch 10 workspaces honor their documented countdown, timezone, and generator settings", async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/en/tools/timer`);
  await page.getByLabel("Minutes").fill("0");
  await page.getByLabel("Seconds").fill("1");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Time is up", { timeout: 4000 });

  await page.goto(`${baseURL}/en/tools/pomodoro-timer`);
  await expect(page.getByRole("spinbutton", { name: "Focus", exact: true })).toHaveValue("25");
  await expect(page.getByRole("spinbutton", { name: "Short break", exact: true })).toHaveValue("5");
  await expect(page.getByRole("spinbutton", { name: "Long break", exact: true })).toHaveValue("15");
  await expect(page.getByRole("spinbutton", { name: "Focus sessions before long break", exact: true })).toHaveValue("4");
  await page.getByRole("spinbutton", { name: "Focus", exact: true }).fill("1");
  await page.getByRole("spinbutton", { name: "Short break", exact: true }).fill("1");
  await page.getByRole("spinbutton", { name: "Long break", exact: true }).fill("1");
  await page.getByRole("spinbutton", { name: "Focus sessions before long break", exact: true }).fill("1");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.locator("main > section").first().locator("p.font-mono")).toHaveText(/^00:00:5\d$/);

  await page.goto(`${baseURL}/en/tools/world-clock`);
  await page.evaluate(() => localStorage.removeItem("woori-world-clock-zones"));
  await page.reload();
  const clocks = page.locator("main > section").first().locator("article");
  await expect(clocks).toHaveCount(8);
  await page.locator("#zone-search").fill("Europe/Madrid");
  await page.locator("#zone-select").selectOption("Europe/Madrid");
  await page.getByRole("button", { name: "Add city", exact: true }).click();
  await expect(clocks).toHaveCount(9);
  await page.reload();
  await expect(clocks).toHaveCount(9);

  await page.goto(`${baseURL}/en/tools/password-generator`);
  await page.getByLabel("Length").fill("16");
  await page.getByRole("button", { name: "Generate", exact: true }).click();
  const password = (await page.locator("main > section").first().locator("pre").textContent())!.trim();
  expect(password).toHaveLength(16);
  expect(password).toMatch(/[A-Z]/);
  expect(password).toMatch(/[a-z]/);
  expect(password).toMatch(/[0-9]/);
  expect(password).toMatch(/[!@#$%^&*()\-_=+\[\]{}:,.?]/);
  expect(password).not.toMatch(/[O0Il1]/);

  await page.goto(`${baseURL}/en/tools/random-string-generator`);
  await page.getByLabel("Length").fill("12");
  await page.getByLabel("Number to generate").fill("3");
  await page.getByRole("button", { name: "Generate", exact: true }).click();
  const strings = (await page.locator("main > section").first().locator("pre").textContent())!.trim().split("\n");
  expect(strings).toHaveLength(3);
  for (const value of strings) {
    expect(value).toHaveLength(12);
    expect(value).toMatch(/[A-Z]/);
    expect(value).toMatch(/[a-z]/);
    expect(value).toMatch(/[0-9]/);
    expect(value).toMatch(/[!@#$%^&*()\-_=+\[\]{}:,.?]/);
  }
});
