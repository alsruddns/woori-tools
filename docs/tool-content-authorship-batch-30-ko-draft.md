# Batch 30 Korean editorial draft

State: KO_DRAFT until locale copy and functional/SSR/mobile validation pass.

## lakh-crore-converter
- Principle: Parses a number or a value suffixed by lakh/lac/crore/cr. One lakh is 100,000 and one crore is 10,000,000; plain numbers at or above those thresholds are displayed in the largest applicable named unit.
- Example: `100000` becomes `1 lakh`; `2 crore` becomes `20000000`.
- Use: Read or convert common Indian-scale amount notation when checking a document or calculation.
- Steps: Enter a number or a supported lakh/crore expression, run the tool, and compare the numeric value and suffix.
- Limits: This is numeric scaling and formatting, not currency conversion, rounding advice, or a financial valuation.
- Troubleshooting: Use a valid numeric value; spell the supported suffix as lakh, lac, crore, or cr.
- FAQ: Does one lakh mean 100,000? Yes. One crore means 10,000,000.

## pan-format-validator
- Principle: Checks whether the input matches the fixed Indian PAN character pattern, including the fourth-position holder category.
- Example: `ABCPA1234F` matches the expected structure.
- Use: Catch a mistyped PAN structure before entering it into another form.
- Steps: Enter the PAN characters, run the check, and review the format result.
- Limits: Structure only; the tool does not verify issuance, a holder's identity, or active status with a government source.
- Troubleshooting: Check ten-character length, letter/digit positions, and supported fourth letter.
- FAQ: Does a valid format prove that the PAN was issued? No. It only matches the expected structure.

## gstin-format-validator
- Principle: Checks GSTIN structure and its final check character with the local algorithm.
- Example: `27AAPFU0939F1ZV` passes the format and check-character calculation; changing the final character can fail the check.
- Use: Find likely typing errors before copying a GSTIN into business paperwork.
- Steps: Enter the GSTIN, run the check, and read whether failure is structural or checksum-related.
- Limits: A matching checksum is not a government registry lookup and does not prove registration, taxpayer identity, or current status.
- Troubleshooting: Confirm the 15-character layout, state code, PAN segment, and final characters.
- FAQ: Does a passing checksum confirm an active GST registration? No. Registry status is not queried.

## india-phone-number-formatter
- Principle: Strips non-digits, optionally removes a leading country code 91 from a 12-digit value, checks the ten-digit mobile prefix, and groups the local number after +91.
- Example: `9876543210` becomes `+91 98765 43210`.
- Use: Normalize a supported Indian mobile number for display in a contact list or form.
- Steps: Enter a local ten-digit number or supported +91 form, run the formatter, and review the grouped output.
- Limits: Pattern and grouping only; no subscriber, carrier, identity, or reachability lookup.
- Troubleshooting: Check ten local digits and a first digit from 6 through 9.
- FAQ: Does the formatted number confirm the subscriber? No. It only formats a supported pattern.

## germany-iban-validator
- Principle: Removes spaces and hyphens, checks the 22-character German IBAN layout, then calculates MOD 97 on the rearranged digits.
- Example: `DE89370400440532013000` passes the structure and checksum calculation.
- Use: Detect a transcription error before using an IBAN in a payment form.
- Steps: Enter a German IBAN, run the validation, and distinguish a format failure from a checksum failure.
- Limits: A valid checksum does not confirm account ownership, account status, bank acceptance, or available funds.
- Troubleshooting: Check the DE prefix, two check digits, and twenty account characters; remove unrelated punctuation.
- FAQ: Does a valid IBAN result prove the account exists? No. No bank or account registry is contacted.
