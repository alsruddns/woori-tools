const utf8 = new TextEncoder();

export function decodeJwt(value: string, now = Date.now()) {
  const parts = value.trim().split(".");
  if (parts.length < 2) throw new Error("invalid-jwt");
  const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")), (char) => char.charCodeAt(0));
  const payload: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("invalid-payload");
  const exp = (payload as Record<string, unknown>).exp;
  const expiry = typeof exp === "number" && Number.isFinite(exp) ? exp * 1000 : null;
  return { payload, expiry, status: expiry === null ? "no-exp" : expiry <= now ? "expired" : "active" } as const;
}

export function parseUrlQuery(value: string) {
  const input = value.trim();
  if (!input) return [] as Array<[string, string]>;
  const url = input.includes("://") ? new URL(input) : new URL(`?${input.replace(/^\?/, "")}`, "https://local.invalid");
  const params = url.searchParams;
  return [...params.entries()];
}

export function inspectUserAgent(value: string) {
  const ua = value.trim();
  const browser = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /(?:Chrome|CriOS)\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Unknown";
  const os = /Android/.test(ua) ? "Android" : /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Windows NT/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Unknown";
  const versionMatch = ua.match(browser === "Edge" ? /Edg\/([\d.]+)/ : browser === "Firefox" ? /Firefox\/([\d.]+)/ : browser === "Chrome" ? /(?:Chrome|CriOS)\/([\d.]+)/ : /Version\/([\d.]+)/);
  return { browser, version: versionMatch?.[1] ?? "Unknown", os, mobile: /Mobile|Android|iPhone|iPad|iPod/i.test(ua) };
}

function ipv4ToBigInt(address: string) {
  const octets = address.split(".");
  if (octets.length !== 4 || octets.some((part) => !/^\d{1,3}$/.test(part) || Number(part) > 255)) throw new Error("invalid-ipv4");
  return octets.reduce((value, part) => (value << BigInt("8")) | BigInt(Number(part)), BigInt("0"));
}

function bigIntToIpv4(value: bigint) {
  return [BigInt("24"), BigInt("16"), BigInt("8"), BigInt("0")].map((shift) => Number((value >> shift) & BigInt("255"))).join(".");
}

export function calculateIpv4Cidr(value: string) {
  const [address, prefixText, extra] = value.trim().split("/");
  const prefix = Number(prefixText);
  if (extra !== undefined || !/^\d+$/.test(prefixText ?? "") || prefix < 0 || prefix > 32) throw new Error("invalid-cidr");
  const ip = ipv4ToBigInt(address);
  const mask = prefix === 0 ? BigInt("0") : (BigInt("4294967295") << BigInt(32 - prefix)) & BigInt("4294967295");
  const network = ip & mask;
  const broadcast = network | (BigInt("4294967295") ^ mask);
  const count = BigInt("1") << BigInt(32 - prefix);
  const usableStart = prefix <= 30 ? network + BigInt("1") : network;
  const usableEnd = prefix <= 30 ? broadcast - BigInt("1") : broadcast;
  return {
    address: bigIntToIpv4(ip), prefix, network: bigIntToIpv4(network), broadcast: bigIntToIpv4(broadcast),
    netmask: bigIntToIpv4(mask), firstUsable: bigIntToIpv4(usableStart), lastUsable: bigIntToIpv4(usableEnd),
    addressCount: count.toString(), usableCount: (prefix <= 30 ? count - BigInt("2") : count).toString(),
    binary: [BigInt("24"), BigInt("16"), BigInt("8"), BigInt("0")].map((shift) => Number((ip >> shift) & BigInt("255")).toString(2).padStart(8, "0")).join("."),
  };
}

const base32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
export function encodeBase32(value: string) {
  const bytes = utf8.encode(value);
  let buffer = 0, bits = 0, output = "";
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte; bits += 8;
    while (bits >= 5) { bits -= 5; output += base32Alphabet[(buffer >> bits) & 31]; }
  }
  if (bits) output += base32Alphabet[(buffer << (5 - bits)) & 31];
  while (output.length % 8) output += "=";
  return output;
}

export function decodeBase32(value: string) {
  const clean = value.toUpperCase().replace(/\s|=/g, "");
  if (!/^[A-Z2-7]*$/.test(clean)) throw new Error("invalid-base32");
  let buffer = 0, bits = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    buffer = (buffer << 5) | base32Alphabet.indexOf(char); bits += 5;
    if (bits >= 8) { bits -= 8; bytes.push((buffer >> bits) & 255); }
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
}

export function createUuidV7(now = Date.now(), cryptoApi: Crypto = crypto) {
  const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
  let timestamp = BigInt(now);
  for (let index = 5; index >= 0; index--) { bytes[index] = Number(timestamp & BigInt("255")); timestamp >>= BigInt("8"); }
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const crockford = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
export function createUlid(now = Date.now(), cryptoApi: Crypto = crypto) {
  let value = (BigInt(now) << BigInt("80")) | BigInt(`0x${Array.from(cryptoApi.getRandomValues(new Uint8Array(10)), (byte) => byte.toString(16).padStart(2, "0")).join("")}`);
  let output = "";
  for (let index = 0; index < 26; index++) { output = crockford[Number(value & BigInt("31"))] + output; value >>= BigInt("5"); }
  return output;
}

export function compareHashes(first: string, second: string) {
  const clean = (value: string) => value.trim().replace(/^(?:sha-?\d+|md5)\s*:?\s*/i, "").toLowerCase();
  const a = clean(first), b = clean(second);
  return { equal: Boolean(a && b && a === b), first: a, second: b };
}

export function replaceWithRegex(patternInput: string, sample: string, replacement: string) {
  const match = patternInput.trim().match(/^\/([\s\S]*)\/([dgimsuvy]*)$/);
  if (!match || match[1].length > 500 || sample.length > 20_000) throw new Error("invalid-regex-input");
  if (/\([^)]*(?:[+*]|\{\d+,?\d*\})[^)]*\)(?:[+*]|\{)|\\[1-9]/.test(match[1])) throw new Error("unsafe-regex");
  return sample.replace(new RegExp(match[1], match[2].replace(/[gy]/g, "") + "g"), replacement);
}

export function encodeHtmlEntities(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function decodeHtmlEntities(value: string) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

export function calculateChmod(value: string) {
  const input = value.trim();
  const mode = /^[0-7]{3,4}$/.test(input) ? Number.parseInt(input.slice(-3), 8) : null;
  if (mode === null || mode > 0o777) throw new Error("invalid-chmod");
  const symbolic = [6, 3, 0].map((shift) => {
    const bits = (mode >> shift) & 7;
    return `${bits & 4 ? "r" : "-"}${bits & 2 ? "w" : "-"}${bits & 1 ? "x" : "-"}`;
  }).join("");
  return { octal: mode.toString(8).padStart(3, "0"), symbolic, owner: symbolic.slice(0, 3), group: symbolic.slice(3, 6), others: symbolic.slice(6, 9) };
}

type JsonPathToken = string | number | "*";
export function evaluateJsonPath(jsonText: string, path: string) {
  const root: unknown = JSON.parse(jsonText);
  if (!path.startsWith("$") || path.length > 500) throw new Error("invalid-jsonpath");
  const tokens: JsonPathToken[] = [];
  const remainder = path.slice(1);
  const tokenPattern = /(?:\.([A-Za-z_$][\w$]*|\*)|\[(\d+|\*|"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')\])/gy;
  let cursor = 0;
  while (cursor < remainder.length) {
    tokenPattern.lastIndex = cursor;
    const match = tokenPattern.exec(remainder);
    if (!match) throw new Error("invalid-jsonpath");
    const raw = match[2];
    tokens.push(match[1] === "*" || raw === "*" ? "*" : match[1] ?? (raw.startsWith("\"") || raw.startsWith("'") ? (match[3] ?? match[4]) : Number(raw)));
    cursor = tokenPattern.lastIndex;
  }
  let values: unknown[] = [root];
  for (const token of tokens) values = values.flatMap((value) => {
    if (token === "*") return Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : [];
    if (Array.isArray(value) && typeof token === "number") return token < value.length ? [value[token]] : [];
    return value && typeof value === "object" && typeof token === "string" && token in value ? [(value as Record<string, unknown>)[token]] : [];
  });
  return values;
}

export function convertCsvTsv(value: string, direction: "csv-to-tsv" | "tsv-to-csv") {
  const delimiter = direction === "csv-to-tsv" ? "," : "\t";
  const target = direction === "csv-to-tsv" ? "\t" : ",";
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (quoted && char === '"' && value[index + 1] === '"') { cell += '"'; index++; }
    else if (char === '"') quoted = !quoted;
    else if (!quoted && char === delimiter) { row.push(cell); cell = ""; }
    else if (!quoted && (char === "\n" || char === "\r")) { row.push(cell); rows.push(row); row = []; cell = ""; if (char === "\r" && value[index + 1] === "\n") index++; }
    else cell += char;
  }
  if (quoted) throw new Error("invalid-delimited-text");
  if (cell || row.length || value.endsWith(delimiter)) { row.push(cell); rows.push(row); }
  return rows.map((cells) => cells.map((item) => {
    const escaped = item.replace(/"/g, '""');
    return escaped.includes(target) || escaped.includes('"') || escaped.includes("\n") ? `"${escaped}"` : escaped;
  }).join(target)).join("\n");
}

export function createUrlSlug(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

export function inspectCodePoints(value: string) {
  return Array.from(value).map((character, index) => {
    const codePoint = character.codePointAt(0)!;
    return { index, character: character === " " ? "(space)" : character === "\n" ? "(newline)" : character, codePoint: `U+${codePoint.toString(16).toUpperCase().padStart(codePoint <= 0xffff ? 4 : 5, "0")}`, decimal: codePoint, utf8Bytes: utf8.encode(character).length };
  });
}
