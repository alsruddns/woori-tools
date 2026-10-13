export const COUNTRY_TOOL_SLUGS = [
  "simplified-traditional-chinese-converter", "chinese-number-kanji-converter", "rmb-uppercase-converter", "chinese-zodiac-calculator", "chinese-sexagenary-cycle-calculator", "chinese-phone-number-formatter", "taiwan-phone-number-formatter",
  "indian-number-format-converter", "lakh-crore-converter", "pan-format-validator", "gstin-format-validator", "india-phone-number-formatter",
  "germany-iban-validator", "german-number-format-converter", "german-date-format-converter",
  "spain-dni-validator", "spain-nie-validator", "spanish-number-format-converter", "spanish-date-format-converter",
  "france-phone-number-formatter", "french-number-format-converter", "french-date-format-converter",
  "brazil-cpf-validator", "brazil-cnpj-validator", "brazil-phone-number-formatter", "brazil-cep-formatter",
  "netherlands-iban-validator", "dutch-number-format-converter", "dutch-date-format-converter", "vietnam-phone-number-formatter", "vietnam-number-format-converter",
  "italy-fiscal-code-format-validator", "italy-vat-number-validator", "italy-number-format-converter", "italian-date-format-converter",
  "us-phone-number-formatter", "us-zip-code-formatter", "canada-postal-code-formatter", "uk-postcode-formatter", "australia-postcode-formatter", "english-date-format-converter",
] as const;
export type CountryToolSlug = typeof COUNTRY_TOOL_SLUGS[number];
