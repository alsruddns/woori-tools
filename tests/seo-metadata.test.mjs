import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/seo.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { absoluteUrl, createPageMetadata } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const expectedOrigin = (process.env.SITE_URL ?? "https://www.woori.today").replace(/\/+$/, "");

test("Korean and x-default alternates point to the canonical tool URL", () => {
  const metadata = createPageMetadata({
    title: "JPG → PNG 변환",
    description: "JPG 이미지를 PNG로 변환합니다.",
    path: "/jpg-to-png",
  });
  const expectedUrl = `${expectedOrigin}/tools/jpg-to-png`;

  assert.equal(metadata.alternates.canonical, expectedUrl);
  assert.deepEqual(metadata.alternates.languages, {
    "ko-KR": expectedUrl,
    "x-default": expectedUrl,
  });
  assert.equal(metadata.openGraph.url, expectedUrl);
  assert.equal("en" in metadata.alternates.languages, false);
  assert.equal("ja" in metadata.alternates.languages, false);
  assert.equal("zh" in metadata.alternates.languages, false);
});

test("the tools home URL has no trailing slash", () => {
  assert.equal(absoluteUrl("/"), `${expectedOrigin}/tools`);
});
