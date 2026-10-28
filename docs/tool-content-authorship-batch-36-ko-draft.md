# Batch 36 Korean editorial draft checkpoint

Last three public tools and their processor examples:

- `uk-postcode-formatter`: `sw1a1aa` becomes `SW1A 1AA`; this normalizes a supported pattern but does not search addresses or confirm delivery.
- `australia-postcode-formatter`: `2000` passes the four-digit format check; the processor reports format validity and does not map postcodes to cities.
- `english-date-format-converter`: ISO `2026-03-04` becomes `03/04/2026` in US mode and `04/03/2026` in UK mode. Reverse conversion uses the selected order; ambiguous dates are not inferred.

All three have localized editorial entries across the 26 published locales. Final validation is pending.
