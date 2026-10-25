import assert from "node:assert/strict";
import test from "node:test";
import { countToolDetailsByLocale, extractRouteLocales, validateLocalizedPageHtml } from "../scripts/check-production-tools-smoke.mjs";

test("production sitemap detail counter counts unique locale tool paths", () => {
  const xml = "<urlset><url><loc>https://www.woori.today/ko/tools/example</loc></url><url><loc>https://www.woori.today/fil/tools/example</loc></url><url><loc>https://www.woori.today/ko/tools</loc></url></urlset>";
  assert.deepEqual([...countToolDetailsByLocale(xml, ["ko", "fil"]).entries()], [["ko", 1], ["fil", 1]]);
  assert.equal(extractRouteLocales('routeLocale: "ko" routeLocale: "fil"').length, 2);
  assert.throws(() => countToolDetailsByLocale(xml.replace("</urlset>", "<url><loc>https://www.woori.today/ko/tools/example</loc></url></urlset>"), ["ko", "fil"]), /Duplicate Tools sitemap URL/);
});

test("production page validator requires canonical, locale hreflang, x-default, and H1", () => {
  const url = "https://www.woori.today/fil/tools/example";
  const html = '<link rel="canonical" href="https://www.woori.today/fil/tools/example"><link rel="alternate" hreflang="fil" href="https://www.woori.today/fil/tools/example"><link rel="alternate" hreflang="x-default" href="https://www.woori.today/ko/tools/example"><h1>Example tool</h1>';
  assert.doesNotThrow(() => validateLocalizedPageHtml(html, url, "fil"));
  assert.throws(() => validateLocalizedPageHtml(html.replace('hreflang="x-default"', 'hreflang="en"'), url, "fil"), /x-default/);
});
