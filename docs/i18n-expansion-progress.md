# Woori Tools 26-language localization progress

Updated from the translation source modules. Public tool count: 176. Target locales: 11.
Routable locales: 16 (ko, en, ja, zh, es, pt-br, de, fr, vi, id, th, zh-tw, it, nl, hi, ru). A target locale is listed as published only for tool pages that pass the UI and SEO checks.

## Per-locale status

| Locale | Translation data | UI verified | SEO verified | Public tools | Pending data | Next tool |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| ru | 153/176 | 1 | 1 | 1 | 23 | german-date-format-converter |
| tr | 6/176 | 0 | 0 | 0 | 170 | tarot-card |
| pl | 6/176 | 0 | 0 | 0 | 170 | tarot-card |
| fil | 6/176 | 0 | 0 | 0 | 170 | tarot-card |
| bn | 6/176 | 0 | 0 | 0 | 170 | tarot-card |
| uk | 6/176 | 0 | 0 | 0 | 170 | tarot-card |
| ms | 6/176 | 0 | 0 | 0 | 170 | tarot-card |
| sv | 6/176 | 0 | 0 | 0 | 170 | tarot-card |
| cs | 6/176 | 0 | 0 | 0 | 170 | tarot-card |
| ro | 6/176 | 0 | 0 | 0 | 170 | tarot-card |
| el | 6/176 | 0 | 0 | 0 | 170 | tarot-card |

## Translation coverage

- Existing authored lottery bundle slugs: lotto-number-generator, powerball-number-generator, mega-millions-number-generator, japan-loto6-number-generator, japan-loto7-number-generator, japan-mini-loto-number-generator
- Additional Russian bundle slugs: tarot-card, daily-fortune, saju, random-number, random-name-picker, random-wheel, draw-lots, random-team-maker, random-order, random-seat, duty-picker, dice-roller, coin-flip, stopwatch, timer, pomodoro-timer, world-clock, password-generator, random-string-generator, wifi-qr, contact-qr, phone-qr, email-qr, barcode-checker, barcode-generator, instagram-grid-split, image-collage, file-hash, mime-type-checker, file-extension-checker, file-size-checker, duplicate-file-checker, zip-files, bulk-file-renamer, filename-cleaner, shuffle-lines, add-line-numbers, remove-line-numbers, remove-empty-lines, remove-characters, text-repeater, text-to-file, lorem-ipsum, regex-tester, color-converter, cron-parser, sql-formatter, html-formatter, css-formatter, javascript-formatter, markdown-preview, jpg-to-png, png-to-jpg, webp-to-jpg, webp-to-png, jpg-to-webp, png-to-webp, heic-to-jpg, image-compress, image-resize, image-crop, image-rotate, image-flip, image-grayscale, image-brightness, image-contrast, image-blur, image-pixelate, remove-image-metadata, image-info, favicon-generator, image-color-picker, images-to-pdf, pdf-merge, pdf-split, pdf-delete-pages, pdf-reorder-pages, pdf-rotate-pages, pdf-add-page-numbers, pdf-watermark, pdf-metadata-viewer, pdf-remove-metadata, character-count, remove-spaces, remove-line-breaks, remove-duplicate-lines, sort-lines, text-case-converter, text-compare, reverse-text, remove-duplicate-words, json-formatter, json-validator, json-to-yaml, yaml-to-json, csv-to-json, json-to-csv, base64, url-encode-decode, uuid-generator, timestamp-converter, wareki-converter, hiragana-katakana-converter, fullwidth-halfwidth-converter, japanese-romaji-converter, japanese-number-kanji-converter, yakudoshi-calculator, japanese-zodiac-calculator, numbers3-number-generator, numbers4-number-generator, bingo5-number-generator, us-phone-number-formatter, us-zip-code-formatter, canada-postal-code-formatter, uk-postcode-formatter, jwt-decoder, url-query-parameter-parser, user-agent-parser, ip-cidr-calculator, base32-encoder-decoder, ulid-generator, uuid-v7-generator, hash-compare, regex-replace, html-entity-encoder-decoder, chmod-calculator, json-path-tester, csv-tsv-converter, url-slug-generator, unicode-code-point-checker, pdf-page-size-checker, simplified-traditional-chinese-converter, chinese-number-kanji-converter, rmb-uppercase-converter, chinese-zodiac-calculator, chinese-sexagenary-cycle-calculator, chinese-phone-number-formatter, taiwan-phone-number-formatter, indian-number-format-converter, lakh-crore-converter, pan-format-validator, gstin-format-validator, india-phone-number-formatter, germany-iban-validator, german-number-format-converter, social-image-resize, add-text-to-image
- Russian completed tool bundles: 153/176
- Russian tools with UI verified: barcode-generator
- Russian tools with SEO verified: barcode-generator
- Russian tool URLs published: barcode-generator
- Russian next tool: german-date-format-converter
- Russian shared site, search, workspace, error, privacy, and terms messages are wired for the published route; non-Russian target UI messages remain unpublished.
- Only tool-locale URLs listed in the registry are included in the sitemap and hreflang sets.

## Remaining Russian tools

- german-date-format-converter
- spain-dni-validator
- spain-nie-validator
- spanish-number-format-converter
- spanish-date-format-converter
- france-phone-number-formatter
- french-number-format-converter
- french-date-format-converter
- brazil-cpf-validator
- brazil-cnpj-validator
- brazil-phone-number-formatter
- brazil-cep-formatter
- netherlands-iban-validator
- dutch-number-format-converter
- dutch-date-format-converter
- vietnam-phone-number-formatter
- vietnam-number-format-converter
- italy-fiscal-code-format-validator
- italy-vat-number-validator
- italy-number-format-converter
- italian-date-format-converter
- australia-postcode-formatter
- english-date-format-converter

## Last verified checkpoint

- Validation: TypeScript passed; lint passed; all 90 tests passed; production build passed.
- Production build prerendered 2,821 static pages; the tool sitemap contains 2,641 localized tool URLs, including only the verified Russian barcode-generator page.
- Russian canonical, hreflang, x-default, Open Graph, route rendering, and sitemap membership passed source and build checks for barcode-generator.
- The verified route set is intentionally limited to published tool slugs; the remaining Russian tools are not routable or indexed.
- Current branch is `develop`.
- Next Russian translation-data tool: `german-date-format-converter`.
