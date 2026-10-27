# Batch 34 Korean editorial draft checkpoint

Selected five tools and checked the processing implementation:

- `dutch-date-format-converter`: ISO `2026-10-13` becomes Dutch `13-10-2026`; reverse direction converts it back. Calendar-invalid dates are rejected.
- `vietnam-phone-number-formatter`: `0912345678` becomes `+84 0912 345678`. The processor formats digits only and does not check carrier or line status.
- `vietnam-number-format-converter`: `1234567.89` becomes `1.234.567,89` under `vi-VN` separators. No currency conversion occurs.
- `italy-fiscal-code-format-validator`: `RSSMRA85T10A562S` passes the 16-character structure and control-letter calculation; changing the last letter to A fails the checksum. It does not verify a person or tax record.
- `italy-vat-number-validator`: `01114601006` passes the 11-digit structure and final check digit; a final 7 fails. It does not query current registration.

The localized editorial explains each processor's specific behavior, a verified example, limits, troubleshooting, and a tool-specific FAQ. Locale authorship is present in `src/registry/tool-detail-editorials-batch-34.ts`; validation is still pending.
