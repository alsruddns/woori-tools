import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  reporter: "list",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:3102",
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm exec next start -p 3102",
    url: "http://127.0.0.1:3102/en/tools/json-formatter",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
