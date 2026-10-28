# Batch 32 Korean editorial draft

State: KO_DRAFT until locale authoring and processor/SSR/browser validation pass.

## spanish-date-format-converter
- Principle: Converts a real calendar date between ISO YYYY-MM-DD and Spanish DD/MM/YYYY using an explicit direction.
- Example: 2026-10-13 becomes 13/10/2026; reverse direction returns 2026-10-13.
- Use/steps: Select the direction, enter the corresponding date order, run the conversion, and verify day/month order.
- Limits: Date formatting only; no timezone adjustment or event interpretation.
- Troubleshooting: Use two-digit day/month and a four-digit year; impossible dates are rejected.
- FAQ: Can it resolve an ambiguous date automatically? No; choose the direction explicitly.

## france-phone-number-formatter
- Principle: Removes non-digits, normalizes supported French local or +33 input, checks ten local digits, and formats them in pairs after +33.
- Example: 0612345678 becomes +33 6 12 34 56 78.
- Use/steps: Enter a French number in local or supported international form, run, then inspect the displayed groups.
- Limits: Pattern formatting only; no carrier, subscriber, or reachability lookup.
- Troubleshooting: Check the ten-digit local number and leading zero or country prefix.
- FAQ: Does a formatted result show that the line is active? No.

## french-number-format-converter
- Principle: Parses and formats numeric values with fr-FR separators: narrow no-break spaces for digit groups and comma for decimals.
- Example: 1234567.89 becomes 1 234 567,89.
- Use/steps: Enter a number, run the converter, and distinguish grouping spaces from the decimal comma.
- Limits: Display formatting only; currency and measurement units are unchanged.
- Troubleshooting: Confirm the decimal separator when pasting a formatted value.
- FAQ: Is the result rounded to currency precision? No; it formats the supplied number without currency-specific rounding.

## french-date-format-converter
- Principle: Validates a real calendar date from ISO or supported local input and displays DD/MM/YYYY.
- Example: 2026-10-13 becomes 13/10/2026.
- Use/steps: Enter a supported date, run the converter, and review the day/month/year order.
- Limits: Does not adjust timezone or infer appointment context.
- Troubleshooting: Use two-digit day/month and a four-digit year; invalid calendar dates fail.
- FAQ: Does it convert a timestamp between timezones? No, only the written calendar date.

## brazil-cpf-validator
- Principle: Strips separators, rejects malformed or repeated-digit values, and checks both CPF digits with the local modulo algorithm.
- Example: 529.982.247-25 passes the checksum; a repeated-digit value such as 111.111.111-11 is rejected.
- Use/steps: Enter the CPF, run the check, and interpret a format failure separately from a checksum mismatch.
- Limits: No identity, issuance, tax status, or government registry lookup.
- Troubleshooting: Check eleven digits and both final control digits.
- FAQ: Does checksum success verify a real CPF holder? No; it checks only the number pattern and digits.
