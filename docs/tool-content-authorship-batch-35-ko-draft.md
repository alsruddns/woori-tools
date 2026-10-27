# Batch 35 Korean editorial draft checkpoint

Verified processor behavior and examples:

- `italy-number-format-converter`: `1234567.89` => `1.234.567,89` using `it-IT` separators.
- `italian-date-format-converter`: ISO `2026-10-13` => `13/10/2026`; reverse direction returns `2026-10-13` and invalid calendar dates fail.
- `us-phone-number-formatter`: `2125550123` => `+1 (212) 555-0123`; formatting does not look up a subscriber.
- `us-zip-code-formatter`: `123456789` => `12345-6789`; this is formatting, not an address lookup.
- `canada-postal-code-formatter`: lowercase `k1a0b1` => `K1A 0B1`; only the postal character pattern is checked.

The 26-locale editorial records describe each tool's own separators, ordering, accepted pattern, example, limits, and troubleshooting. Verification is pending.
