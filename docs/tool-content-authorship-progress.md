# Editorial authorship progress

Status definitions: `not started` means no original editorial; `in progress` means original copy exists but locale or runtime/page checks remain; `complete` requires original copy in all 26 locales plus processor-example, SSR/SEO, and browser checks.

## Batch 1: deterministic text processing (5 tools)

| Tool | Status | Evidence and remaining work |
|---|---|---|
| `character-count` | in progress | Korean editorial added and SSR/mobile checked. `Woori Tools` output was executed through the processor and added as an exact verified example. 25 locale versions remain. |
| `remove-spaces` | in progress | Korean editorial added and SSR/mobile checked. Existing deterministic example is executed by the content checker. 25 locale versions remain. |
| `remove-line-breaks` | in progress | Korean editorial added and SSR/mobile checked. Existing deterministic example is executed by the content checker. 25 locale versions remain. |
| `remove-duplicate-lines` | in progress | Korean editorial added and SSR/mobile checked. Existing deterministic example is executed by the content checker. 25 locale versions remain. |
| `reverse-text` | in progress | Korean editorial added and SSR/mobile checked. Existing deterministic example is executed by the content checker. 25 locale versions remain. |

Current evidence: 216 unit tests pass; content check reports 176 tools, 26 locales, 4,576 detail URLs, 28 executable text examples, 4,576 sitemap URLs, and zero noindex candidates. Lint, TypeScript, production build, and Playwright (3 tests) passed. The added Playwright case checks these five Korean pages in SSR HTML and at 320, 360, 375, 390, 430, 768, 1024, and 1440 CSS pixels. This does not complete any tool's 26-locale requirement.

No tool in this batch is counted as complete until its editorial is authored for all 26 locales and the required checks pass. The next batch remains unselected until this batch is complete.
