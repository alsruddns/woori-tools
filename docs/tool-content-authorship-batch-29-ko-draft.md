# Batch 29 Korean editorial draft

State: KO_DRAFT. Do not mark any entry COMPLETE until all 26 localized cards and the processor, SSR, SEO, and mobile checks pass.

## chinese-zodiac-calculator

- Principle: Uses the Gregorian year with the fixed sexagenary-cycle offset `(year - 4) mod 60`; the zodiac animal is the earthly branch at the same offset. This is a year-only convention and does not calculate a lunar new year boundary or birth chart.
- Example: 1984 returns the Rat branch; 2024 returns Dragon.
- Use: A quick year-label lookup for a calendar, classroom activity, or cultural reference.
- Steps: Enter an integer year from 1 through 9999, run the tool, and read the animal result.
- Interpretation/limits: It labels the supplied year using the library's fixed cycle. Births near Lunar New Year may belong to the previous cycle under lunar-calendar conventions.
- Troubleshooting: Enter digits only and keep the year within 1–9999; decimal years and year 0 are rejected.
- FAQ: Does this calculate a person's full zodiac from a birthday? No. It uses only the entered Gregorian year and does not resolve the lunar new year cutoff.

## chinese-sexagenary-cycle-calculator

- Principle: Maps the year to one of 60 stem-branch pairs using the same fixed `(year - 4) mod 60` cycle.
- Example: 1984 maps to 甲子 and 2024 maps to 甲辰.
- Use: Check a year label when reading a sexagenary calendar or comparing historical references.
- Steps: Enter an integer year from 1 through 9999, run the tool, and read the stem-branch pair.
- Interpretation/limits: This is an annual lookup, not a date conversion, lunar calendar, or birth-chart calculation. It uses Gregorian year boundaries.
- Troubleshooting: Remove punctuation or decimals and enter a year in the supported range.
- FAQ: Does it use the lunar new year date? No. It assigns the cycle from the entered year number.

## chinese-phone-number-formatter

- Principle: Removes non-digits, recognizes supported mainland mobile numbers (11 digits beginning 13–19) and supported landline forms, then adds +86 and grouping spaces.
- Example: `13800138000` becomes `+86 138 0013 8000`.
- Use: Normalize a known number for display in a contact list or form.
- Steps: Enter a supported local number or country-code form, run the formatter, and review the grouped result before copying it.
- Interpretation/limits: Grouping and prefix checks are local formatting only; the tool does not call a carrier, verify assignment, or confirm reachability.
- Troubleshooting: Check the digit count and prefix; unsupported lengths or prefixes return an input error. Separators may be included because non-digits are stripped.
- FAQ: Does a formatted result prove that the number is active? No. It only matches the formatter's supported pattern.

## taiwan-phone-number-formatter

- Principle: Removes non-digits, normalizes an 886 international prefix to a local leading zero, recognizes supported mobile or landline patterns, then displays +886 and groups.
- Example: `0912345678` becomes `+886 0912 345 678`.
- Use: Present a Taiwanese number consistently in a contact record or a form.
- Steps: Enter a supported local or +886 number, run the formatter, and inspect the grouped output.
- Interpretation/limits: This is a syntax-based display formatter. It does not verify a subscriber, carrier, or live connection.
- Troubleshooting: Confirm the number fits a supported mobile or landline length; malformed input is rejected.
- FAQ: Can the formatter validate whether a Taiwanese number is assigned? No. It formats supported patterns without a carrier lookup.

## indian-number-format-converter

- Principle: Formats a numeric value with the `en-IN` grouping convention, which groups the final three digits and then groups pairs to the left.
- Example: `100000` becomes `1,00,000`.
- Use: Display a large amount or count in the lakh/crore grouping style used in Indian English.
- Steps: Enter a number, run the formatter, and compare the comma placement with the original value.
- Interpretation/limits: The tool changes numeric display grouping; it does not convert currencies, words, or units, and it does not infer a financial meaning.
- Troubleshooting: Use a valid numeric value and decimal separator; if grouping looks unfamiliar, compare the ungrouped digits rather than reading commas as decimal marks.
- FAQ: Does it convert rupees to another currency? No. It only formats the numeric grouping.
