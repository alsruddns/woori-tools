"use client";

import { useState } from "react";
import { copyText } from "@/lib/copy-to-clipboard";
import { calculateChmod, calculateIpv4Cidr, compareHashes, convertCsvTsv, createUlid, createUuidV7, decodeBase32, decodeHtmlEntities, decodeJwt, encodeBase32, encodeHtmlEntities, evaluateJsonPath, inspectCodePoints, inspectUserAgent, parseUrlQuery, replaceWithRegex } from "@/lib/browser-developer-tools";

export type TurkishDeveloperSlug = "jwt-decoder" | "url-query-parameter-parser" | "user-agent-parser" | "ip-cidr-calculator" | "hash-compare" | "regex-replace" | "html-entity-encoder-decoder" | "chmod-calculator" | "json-path-tester" | "csv-tsv-converter" | "url-slug-generator" | "unicode-code-point-checker" | "base32-encoder-decoder" | "ulid-generator" | "uuid-v7-generator";

type ToolCopy = { title: string; first: string; second?: string; third?: string; placeholder: string; secondPlaceholder?: string; initial?: "encode" | "csv-to-tsv"; hint?: string };

const copyBySlug: Record<TurkishDeveloperSlug, ToolCopy> = {
  "jwt-decoder": { title: "JWT Çözücü", first: "JWT belirteci", placeholder: "header.payload.signature biçimindeki belirteci yapıştırın", hint: "Payload alanını gösterir ve yalnızca exp süresini kontrol eder. İmza doğrulanmaz; belirtecin geçerliliği kanıtlanmaz." },
  "url-query-parameter-parser": { title: "URL Sorgu Parametresi Ayrıştırıcı", first: "URL veya sorgu metni", placeholder: "https://example.com/?ad=Ayşe&etiket=a&etiket=b", hint: "Tekrarlanan parametreleri URL içindeki sıralarıyla gösterir." },
  "user-agent-parser": { title: "User-Agent Ayrıştırıcı", first: "User-Agent metni", placeholder: "Tarayıcının User-Agent dizesini yapıştırın", hint: "Yerel sezgisel kuralları kullanır; tarayıcı ve cihaz tanımlaması kesin değildir." },
  "ip-cidr-calculator": { title: "IP ve CIDR Hesaplayıcı", first: "IPv4 adresi ve CIDR", placeholder: "192.168.1.15/24", hint: "IPv4 CIDR gösterimini kullanır." },
  "hash-compare": { title: "Hash Karşılaştırıcı", first: "İlk hash", second: "İkinci hash", placeholder: "İlk hash değerini girin", secondPlaceholder: "İkinci hash değerini girin" },
  "regex-replace": { title: "Düzenli İfadeyle Değiştir", first: "Desen ve bayraklar", second: "Kaynak metin", third: "Yeni metin", placeholder: "/kelime/gi", secondPlaceholder: "Üzerinde değişiklik yapılacak metin" },
  "html-entity-encoder-decoder": { title: "HTML Entity Kodlayıcı ve Çözücü", first: "Metin veya HTML entity", placeholder: "Örnek: <p>Merhaba</p>", initial: "encode" },
  "chmod-calculator": { title: "Chmod İzin Hesaplayıcı", first: "Sekizlik izin değeri", placeholder: "755", hint: "644 veya 0755 gibi bir değer girin." },
  "json-path-tester": { title: "JSONPath Sınayıcı", first: "JSON belgesi", second: "JSONPath ifadesi", placeholder: '{"magaza":{"urunler":[{"ad":"Kalem"}]}}', secondPlaceholder: "$.magaza.urunler[*].ad" },
  "csv-tsv-converter": { title: "CSV ve TSV Dönüştürücü", first: "Tablo verisi", placeholder: "ad,yaş\nAyşe,28", initial: "csv-to-tsv" },
  "url-slug-generator": { title: "URL Slug Oluşturucu", first: "Başlık veya metin", placeholder: "Örnek bir Türkçe başlık" },
  "unicode-code-point-checker": { title: "Unicode Kod Noktası Denetleyici", first: "İncelenecek metin", placeholder: "Herhangi bir Unicode karakteri girin" },
  "base32-encoder-decoder": { title: "Base32 Kodlayıcı ve Çözücü", first: "Metin veya Base32 değeri", placeholder: "Kodlanacak metni ya da çözülecek Base32 değerini girin", initial: "encode" },
  "ulid-generator": { title: "ULID Oluşturucu", first: "Üretilecek miktar", placeholder: "5", hint: "Zaman sıralı ULID değerleri tarayıcınızda üretilir." },
  "uuid-v7-generator": { title: "UUID v7 Oluşturucu", first: "Üretilecek miktar", placeholder: "5", hint: "Zaman sıralı UUID v7 değerleri tarayıcınızda üretilir." },
};

const encodeLabel = "Kodla";
const decodeLabel = "Çöz";

function createTurkishSlug(value: string) {
  const transliterated = value.replace(/[ıİğĞüÜşŞöÖçÇ]/g, (character) => ({ ı: "i", İ: "I", ğ: "g", Ğ: "G", ü: "u", Ü: "U", ş: "s", Ş: "S", ö: "o", Ö: "O", ç: "c", Ç: "C" })[character] ?? character);
  return transliterated.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("en").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function TurkishDeveloperToolsWorkspace({ slug }: { slug: TurkishDeveloperSlug }) {
  const copy = copyBySlug[slug];
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [amount, setAmount] = useState(5);
  const [choice, setChoice] = useState<"encode" | "decode" | "csv-to-tsv" | "tsv-to-csv">(copy.initial ?? "encode");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const needsSecond = ["hash-compare", "regex-replace", "json-path-tester"].includes(slug);
  const needsThird = slug === "regex-replace";
  const directional = slug === "html-entity-encoder-decoder" || slug === "csv-tsv-converter" || slug === "base32-encoder-decoder";
  const generatesIdentifiers = slug === "ulid-generator" || slug === "uuid-v7-generator";

  function run() {
    setError(""); setResult("");
    try {
      let value: unknown;
      switch (slug) {
        case "jwt-decoder": {
          const decoded = decodeJwt(first);
          const status = decoded.expiry === null ? "exp alanı yok" : decoded.status === "active" ? `Süresi dolmamış (son tarih: ${new Date(decoded.expiry).toISOString()})` : `Süresi dolmuş (${new Date(decoded.expiry).toISOString()})`;
          value = `Payload:\n${JSON.stringify(decoded.payload, null, 2)}\n\nexp durumu: ${status}`; break;
        }
        case "url-query-parameter-parser": value = parseUrlQuery(first).map(([key, item]) => `${key}\t${item}`).join("\n") || "Sorgu parametresi bulunamadı."; break;
        case "user-agent-parser": {
          const parsed = inspectUserAgent(first);
          value = `Tarayıcı: ${parsed.browser}\nSürüm: ${parsed.version}\nİşletim sistemi: ${parsed.os}\nMobil cihaz: ${parsed.mobile ? "Evet" : "Hayır"}`; break;
        }
        case "ip-cidr-calculator": {
          const network = calculateIpv4Cidr(first);
          value = `Adres: ${network.address}\nÖnek: /${network.prefix}\nAğ: ${network.network}\nAlt ağ maskesi: ${network.netmask}\nYayın adresi: ${network.broadcast}\nİlk kullanılabilir adres: ${network.firstUsable}\nSon kullanılabilir adres: ${network.lastUsable}\nToplam adres: ${network.addressCount}\nKullanılabilir adres: ${network.usableCount}\nİkili gösterim: ${network.binary}`; break;
        }
        case "hash-compare": {
          const compared = compareHashes(first, second);
          value = `${compared.equal ? "Hash değerleri aynı." : "Hash değerleri farklı."}\nİlk değer: ${compared.first}\nİkinci değer: ${compared.second}`; break;
        }
        case "regex-replace": value = replaceWithRegex(first, second, third); break;
        case "html-entity-encoder-decoder": value = choice === "encode" ? encodeHtmlEntities(first) : decodeHtmlEntities(first); break;
        case "chmod-calculator": {
          const mode = calculateChmod(first);
          value = `Sekizlik gösterim: ${mode.octal}\nSembolik gösterim: ${mode.symbolic}\nSahip: ${mode.owner}\nGrup: ${mode.group}\nDiğerleri: ${mode.others}`; break;
        }
        case "json-path-tester": value = JSON.stringify(evaluateJsonPath(first, second), null, 2); break;
        case "csv-tsv-converter": value = convertCsvTsv(first, choice === "tsv-to-csv" ? "tsv-to-csv" : "csv-to-tsv"); break;
        case "url-slug-generator": value = createTurkishSlug(first); break;
        case "unicode-code-point-checker": value = Array.from(first).map((character, index) => {
          const item = inspectCodePoints(character)[0];
          const shown = item.character === "(space)" ? "(boşluk)" : item.character === "(newline)" ? "(satır sonu)" : item.character;
          return `${index + 1}. ${shown}\t${item.codePoint}\tOndalık: ${item.decimal}\tUTF-8: ${item.utf8Bytes} bayt`;
        }).join("\n"); break;
        case "base32-encoder-decoder": value = choice === "encode" ? encodeBase32(first) : decodeBase32(first); break;
        case "ulid-generator":
        case "uuid-v7-generator": {
          const count = Number.isInteger(amount) ? amount : 0;
          if (count < 1 || count > 50) throw new Error("invalid-count");
          value = Array.from({ length: count }, () => slug === "ulid-generator" ? createUlid() : createUuidV7()).join("\n");
          break;
        }
      }
      setResult(typeof value === "string" ? value : JSON.stringify(value, null, 2));
    } catch {
      setError("İşlem tamamlanamadı. Girdi biçimini ve seçilen seçenekleri kontrol edin.");
    }
  }

  return <section aria-label={copy.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-xl font-semibold text-slate-900">{copy.title}</h2>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {!generatesIdentifiers && <label className="block text-sm font-medium">{copy.first}<textarea value={first} onChange={(event) => setFirst(event.target.value)} placeholder={copy.placeholder} rows={slug === "json-path-tester" ? 9 : 5} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>}
      {needsSecond && <label className="block text-sm font-medium">{copy.second}<textarea value={second} onChange={(event) => setSecond(event.target.value)} placeholder={copy.secondPlaceholder} rows={slug === "json-path-tester" ? 5 : 5} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>}
      {needsThird && <label className="block text-sm font-medium">{copy.third}<textarea value={third} onChange={(event) => setThird(event.target.value)} placeholder="Değiştirilecek metin" rows={3} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm" /></label>}
    </div>
    {generatesIdentifiers && <label className="mt-4 block max-w-xs text-sm font-medium">Üretilecek değer sayısı<input type="number" min={1} max={50} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 px-3" /></label>}
    {directional && <label className="mt-4 block text-sm font-medium">İşlem yönü<select value={choice} onChange={(event) => { const selected = event.target.value; if (selected === "encode" || selected === "decode" || selected === "csv-to-tsv" || selected === "tsv-to-csv") setChoice(selected); }} className="mt-2 block min-h-11 rounded-xl border border-slate-300 bg-white px-3">
      {slug === "csv-tsv-converter" ? <><option value="csv-to-tsv">CSV → TSV</option><option value="tsv-to-csv">TSV → CSV</option></> : <><option value="encode">{encodeLabel}</option><option value="decode">{decodeLabel}</option></>}
    </select></label>}
    {copy.hint && <p className="mt-3 text-sm text-slate-600">{copy.hint}</p>}
    <p className="mt-3 text-xs text-slate-500">İşlem tarayıcınızda yapılır; girdiğiniz veriler sunucuya gönderilmez.</p>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={run} className="min-h-11 rounded-xl bg-indigo-600 px-5 font-semibold text-white">{generatesIdentifiers ? "Oluştur" : "Çalıştır"}</button><button type="button" onClick={() => { setFirst(""); setSecond(""); setThird(""); setAmount(5); setChoice(copy.initial ?? "encode"); setResult(""); setError(""); }} className="min-h-11 rounded-xl border px-5">Temizle</button></div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <section aria-live="polite" className="mt-5 rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold">Sonuç</h3><pre className="mt-2 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words font-mono text-sm">{result}</pre><button type="button" onClick={() => void copyText(result)} className="mt-3 min-h-10 rounded-lg border px-4">Kopyala</button></section>}
  </section>;
}
