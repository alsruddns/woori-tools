export const COUNTRY_TOOL_SLUGS = [
  "simplified-traditional-chinese-converter", "chinese-number-kanji-converter", "rmb-uppercase-converter", "chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter",
  "indian-number-format-converter", "lakh-crore-converter", "pan-format-validator", "gstin-format-validator",
  "germany-iban-validator", "german-number-format-converter", "german-date-format-converter",
  "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter",
  "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter",
  "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter",
  "netherlands-iban-validator", "dutch-number-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter",
  "italy-fiscal-code-format-validator", "italy-number-format-converter",
] as const;
export type CountryToolSlug = typeof COUNTRY_TOOL_SLUGS[number];
