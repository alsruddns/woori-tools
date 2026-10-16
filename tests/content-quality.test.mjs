import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

test("all public tool pages have localized, distinct editorial content and valid links", () => {
  const root = fileURLToPath(new URL("..", import.meta.url));
  execFileSync(process.execPath, ["node_modules/tsx/dist/cli.mjs", "scripts/check-content-quality.ts"], {
    cwd: root,
    stdio: "pipe",
  });
});
