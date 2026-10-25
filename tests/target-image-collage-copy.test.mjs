import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/i18n/target-image-collage-copy.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const translations = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const workspaceSource = await readFile(new URL("../src/components/tool/tool-workspace.tsx", import.meta.url), "utf8");
const publicationSource = await readFile(new URL("../src/registry/target-locale-publication.ts", import.meta.url), "utf8");

test("image collage validation and dimensions are localized in every expansion locale", () => {
  const locales = ["fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
  assert.deepEqual(Object.keys(translations.targetImageCollageCopy).sort(), [...locales].sort());
  for (const locale of locales) {
    const copy = translations.targetImageCollageCopy[locale];
    assert.match(copy.countError(4), /4/);
    assert.match(copy.result(4, 984, 984), /4/);
    assert.notEqual(copy.countError(4), "Select 2–4 images for this layout.");
    assert.ok(copy.result(4, 984, 984).includes("984 × 984px"));
  }
});

test("collage workspace uses localized expanded-locale validation and result copy before publication", () => {
  assert.match(workspaceSource, /getTargetImageCollageCopy\(phaseLocale\)/);
  assert.match(workspaceSource, /targetCollageCopy\?\.countError\(maximum\)/);
  assert.match(workspaceSource, /targetCollageCopy\.result\(files\.length,canvas\.width,canvas\.height\)/);
  assert.ok(publicationSource.includes('"image-collage"'));
});
