# Batch 33 Korean editorial draft checkpoint

Selected tools and verified processor behavior:

- `brazil-cnpj-validator`: strips punctuation and uppercases input; validates 14 characters and the two CNPJ control digits. The processor accepts the alphanumeric 2026 format. Example `12.ABC.345/01DE-35` passes; replacing the final digit with `4` fails.
- `brazil-phone-number-formatter`: accepts 10 or 11 digits, formats area code in parentheses, and uses a hyphen before the final four digits. `11987654321` becomes `+55 (11) 98765-4321`. This is formatting only; no carrier or ownership lookup.
- `brazil-cep-formatter`: strips nondigits, requires exactly eight digits, and inserts a hyphen after five. `01310930` becomes `01310-930`; it does not look up an address.
- `netherlands-iban-validator`: removes spaces/hyphens, uppercases, checks NL IBAN structure and MOD 97 checksum. `NL91ABNA0417164300` passes; format/checksum does not verify account existence.
- `dutch-number-format-converter`: uses `nl-NL` grouping and decimal separators. `1234567.89` becomes `1.234.567,89`; no currency conversion is performed.

Draft per-tool material:

- CNPJ: Explain the two check digits and the new alphanumeric base, use a checksum-valid sample, clarify that no government registry is queried, and advise checking copied characters and punctuation when rejected.
- Brazilian phone: Explain accepted 10/11-digit local forms, area-code grouping, domestic/international input tolerance, and that formatting cannot prove assignment or reachability.
- CEP: Explain the eight-digit postal pattern and 5+3 display grouping, with an example; clarify that no postal database or address lookup is involved.
- Dutch IBAN: Explain country prefix, bank code, account digits and MOD 97; distinguish structural/checksum validity from an open or owned account.
- Dutch number: Explain periods as group separators and comma as decimal separator; show conversion from a decimal-point sample and warn that currency/rounding is outside scope.

This is a checkpoint only. Locale content, tests, SSR, and browser verification remain pending.
