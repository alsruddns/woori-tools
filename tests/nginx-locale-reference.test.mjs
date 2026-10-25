import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const routingSource = readFileSync(new URL("../src/i18n/routing.ts", import.meta.url), "utf8");
const nginxReference = readFileSync(new URL("../nginx/woori-tools.conf", import.meta.url), "utf8");

test("Tools Nginx reference covers every routed locale, including three-letter locales", () => {
  const routedLocales = [...routingSource.matchAll(/routeLocale:\s*"([^"]+)"/g)].map((match) => match[1]);
  const localeHeader = nginxReference.match(/^# Supported URL locales: (.+)$/m)?.[1];
  const allowedLocales = localeHeader?.split("|") ?? [];
  const routePattern = nginxReference.match(/^location ~ "([^"]+)" \{$/m)?.[1] ?? "";

  assert.equal(routedLocales.length, 26);
  assert.deepEqual([...allowedLocales].sort(), [...routedLocales].sort());
  assert.match(routePattern, /\[a-z\]\{2,3\}/);
});
