/** Small, deterministic examples that are also executed by check:content-quality. */
export type VerifiedTextExample = {
  input: string;
  output: string;
  secondText?: string;
  option?: string;
  amount?: number;
  resultIsError?: boolean;
};

export const verifiedTextExamples: Record<string, VerifiedTextExample> = {
  "json-formatter": { input: '{"name":"Mina","active":true}', output: '{\n  "name": "Mina",\n  "active": true\n}' },
  "json-validator": { input: '{"name":}', output: "", resultIsError: true },
  "json-to-yaml": { input: '{"name":"Mina","active":true}', output: "name: Mina\nactive: true\n" },
  "yaml-to-json": { input: "name: Mina\nactive: true", output: '{\n  "name": "Mina",\n  "active": true\n}' },
  "csv-to-json": { input: "name,city\nMina,Seoul", output: '[\n  {\n    "name": "Mina",\n    "city": "Seoul"\n  }\n]' },
  "json-to-csv": { input: '[{"name":"Mina","city":"Seoul"}]', output: "name,city\r\nMina,Seoul" },
  base64: { input: "Woori Tools", output: "V29vcmkgVG9vbHM=" },
  "url-encode-decode": { input: "tea & coffee", output: "tea%20%26%20coffee" },
  "remove-spaces": { input: "Mina   Kim", output: "Mina Kim" },
  "remove-line-breaks": { input: "first\nsecond", output: "first second" },
  "remove-duplicate-lines": { input: "apple\npear\napple", output: "apple\npear" },
  "sort-lines": { input: "pear\napple\nbanana", output: "apple\nbanana\npear" },
  "text-case-converter": { input: "hello Woori", option: "upper", output: "HELLO WOORI" },
  "text-compare": { input: "color\nsize", secondText: "colour\nsize", output: "− color\n+ colour" },
  "reverse-text": { input: "Woori", output: "irooW" },
  "remove-duplicate-words": { input: "red blue red", output: "red blue" },
  "add-line-numbers": { input: "alpha\nbeta", output: "1. alpha\n2. beta" },
  "remove-line-numbers": { input: "1. alpha\n2. beta", output: "alpha\nbeta" },
  "remove-empty-lines": { input: "alpha\n\nbeta", output: "alpha\nbeta" },
  "remove-characters": { input: "a1b2c3", option: "digits", output: "abc" },
  "text-repeater": { input: "Ha", amount: 3, output: "HaHaHa" },
  "color-converter": { input: "#ff0000", output: "HEX: #FF0000\nRGB: rgb(255, 0, 0)\nHSL: hsl(0, 100%, 50%)" },
  "sql-formatter": { input: "select id from users where active = true", output: "select\n  id\nfrom\n  users\nwhere\n  active = true" },
  "html-formatter": { input: "<div><p>Hello</p></div>", output: "<div><p>Hello</p></div>\n" },
  "css-formatter": { input: "h1{color:red}", output: "h1 {\n  color: red;\n}\n" },
  "javascript-formatter": { input: "const total=1+2", output: "const total = 1 + 2;\n" },
  "barcode-checker": { input: "4006381333931", output: "EAN-13: Valid\nExpected check digit: 1" },
};
