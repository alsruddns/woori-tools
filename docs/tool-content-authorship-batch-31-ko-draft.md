# Batch 31 Korean editorial draft

State: KO_DRAFT until 26-locale content and processing/browser checks pass.

## german-number-format-converter
- Principle: Parses and formats a value with the de-DE grouping convention: period for groups and comma for decimals.
- Example: `1234567.89` becomes `1.234.567,89`; `1.234,56` remains `1.234,56`.
- Use/steps: Enter a number in a recognizable form, run the converter, and compare the digits and decimal part.
- Limits: Display conversion only; no currency or unit conversion.
- Troubleshooting: Review separators carefully because their roles differ from en-US; malformed values are rejected.
- FAQ: Does it change the numeric amount? It reformats the number using German separators.

## german-date-format-converter
- Principle: Accepts ISO `YYYY-MM-DD` or local `DD.MM.YYYY`-style input and returns `DD.MM.YYYY` after real calendar-date validation.
- Example: `2026-10-13` becomes `13.10.2026`.
- Use/steps: Enter a supported ISO or local date, run the converter, and use the displayed day-month-year order.
- Limits: Formatting only; no timezone or appointment interpretation.
- Troubleshooting: Use two-digit day/month and a four-digit year; impossible dates such as 31 February are rejected.
- FAQ: Does it change the date's timezone? No, it validates the calendar date and changes its written order.

## spain-dni-validator
- Principle: Checks the eight-digit DNI plus one control letter using the official modulo-23 letter table.
- Example: `12345678Z` passes; `12345678A` has the wrong control letter.
- Use/steps: Enter the DNI, run the check, then distinguish a shape error from a checksum mismatch.
- Limits: No identity, issuance, residency, or government database lookup.
- Troubleshooting: Check eight digits followed by a letter and recheck the final character.
- FAQ: Does a passing DNI result verify the holder? No, it checks structure and control letter only.

## spain-nie-validator
- Principle: Accepts X, Y, or Z followed by seven digits and a control letter; maps the initial letter to 0, 1, or 2 for the modulo-23 check.
- Example: `X1234567L` passes the format and control-letter calculation.
- Use/steps: Enter the NIE, run the check, and read whether structure or checksum failed.
- Limits: It does not establish identity, residence status, issuance, or current validity.
- Troubleshooting: Ensure the prefix is X/Y/Z, there are seven digits, and one final letter.
- FAQ: Does the check confirm an NIE was issued? No. There is no official-record lookup.

## spanish-number-format-converter
- Principle: Parses and formats numeric values with es-ES conventions, using period for digit groups and comma for decimals.
- Example: `1234567.89` becomes `1.234.567,89`.
- Use/steps: Enter a numeric value, run the converter, and review the resulting group and decimal marks.
- Limits: Number display only; it does not convert currencies or round to a domain-specific amount.
- Troubleshooting: When pasting formatted input, verify which symbol marks the decimal portion.
- FAQ: Is the result a currency conversion? No, only the number's locale-specific separators change.
