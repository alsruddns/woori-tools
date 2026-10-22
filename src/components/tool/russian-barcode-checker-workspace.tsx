"use client";

import { useState } from "react";

const copy = {
  title: "Проверка контрольной цифры штрихкода",
  input: "Введите номер штрихкода",
  placeholder: "12 цифр UPC-A или 13 цифр EAN-13",
  check: "Проверить номер",
  reset: "Очистить",
  empty: "Введите номер штрихкода.",
  digits: "Номер должен содержать только цифры.",
  length: "Введите 12 цифр для UPC-A или 13 цифр для EAN-13.",
  valid: "Контрольная цифра верна.",
  invalid: "Контрольная цифра не совпадает.",
  expected: "Ожидаемая контрольная цифра",
  status: "Результат проверки штрихкода",
} as const;

export function RussianBarcodeCheckerWorkspace() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<{ valid: boolean; expected: number } | null>(null);
  const [error, setError] = useState("");

  function check() {
    const code = value.trim();
    setResult(null);
    if (!code) { setError(copy.empty); return; }
    if (!/^\d+$/.test(code)) { setError(copy.digits); return; }
    if (code.length !== 12 && code.length !== 13) { setError(copy.length); return; }

    const body = code.slice(0, -1);
    const sum = Array.from(body, (digit, index) => Number(digit) * ((body.length - index) % 2 === 1 ? 3 : 1))
      .reduce((total, digit) => total + digit, 0);
    const expected = (10 - sum % 10) % 10;
    setError("");
    setResult({ valid: Number(code.at(-1)) === expected, expected });
  }

  function reset() {
    setValue("");
    setError("");
    setResult(null);
  }

  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-label={copy.title}>
    <label htmlFor="barcode-checker-value" className="block text-sm font-medium text-slate-800">
      {copy.input}
      <input id="barcode-checker-value" value={value} onChange={(event) => { setValue(event.target.value); setError(""); setResult(null); }}
        inputMode="numeric" autoComplete="off" maxLength={32} placeholder={copy.placeholder}
        className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 font-mono text-base outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
    </label>
    <p className="mt-2 text-sm leading-6 text-slate-600">{copy.placeholder}</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={check} className="min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white hover:bg-indigo-700">{copy.check}</button>
      <button type="button" onClick={reset} className="min-h-12 rounded-xl border border-slate-300 px-5 font-medium hover:bg-slate-50">{copy.reset}</button>
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    {result && <div role="status" aria-live="polite" aria-label={copy.status} className={`mt-5 rounded-2xl p-5 ${result.valid ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-950"}`}>
      <p className="font-semibold">{result.valid ? copy.valid : copy.invalid}</p>
      {!result.valid && <p className="mt-2 text-sm">{copy.expected}: <span className="font-mono font-semibold">{result.expected}</span></p>}
    </div>}
  </section>;
}
