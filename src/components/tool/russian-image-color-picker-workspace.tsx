"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

const maxBytes = 30 * 1024 * 1024;

export function RussianImageColorPickerWorkspace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File>();
  const [color, setColor] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) return;
    let active = true;
    let bitmap: ImageBitmap | undefined;
    const canvas = canvasRef.current;
    void createImageBitmap(file).then((image) => {
      if (!active) { image.close(); return; }
      bitmap = image;
      if (!canvas) return;
      const scale = Math.min(1, 1200 / image.width, 1200 / image.height);
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
    }).catch(() => { if (active) setError("Не удалось открыть изображение в этом браузере."); });
    return () => { active = false; bitmap?.close(); if (canvas) { canvas.width = 0; canvas.height = 0; } };
  }, [file]);

  function select(selected?: File) {
    setError("");
    setColor("");
    setFile(undefined);
    if (!selected) return;
    if (selected.size > maxBytes) { setError("Размер файла не должен превышать 30 МБ."); return; }
    if (!selected.type.startsWith("image/")) { setError("Выберите файл изображения."); return; }
    setFile(selected);
  }

  function pick(event: MouseEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width - 1, Math.floor((event.clientX - rect.left) * canvas.width / rect.width)));
    const y = Math.max(0, Math.min(canvas.height - 1, Math.floor((event.clientY - rect.top) * canvas.height / rect.height)));
    const pixel = canvas.getContext("2d")?.getImageData(x, y, 1, 1).data;
    if (!pixel) return;
    const hex = `#${[pixel[0], pixel[1], pixel[2]].map((value) => value.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
    setColor(`${hex} · RGB(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`);
  }

  return <section aria-label="Пипетка цвета изображения" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <label htmlFor="color-picker-image" className="block text-sm font-medium text-slate-800">Выберите изображение<input id="color-picker-image" type="file" accept="image/*" onChange={(event) => select(event.currentTarget.files?.[0])} className="mt-2 block min-h-12 w-full rounded-xl border border-slate-300 p-3 text-sm" /></label>
    {file && <p className="mt-3 text-sm text-slate-600">Нажмите на нужную точку изображения, чтобы узнать цвет.</p>}
    {file && <canvas ref={canvasRef} onClick={pick} aria-label="Нажмите, чтобы выбрать цвет" className="mt-4 max-h-96 max-w-full cursor-crosshair rounded-xl border border-slate-200" />}
    {color && <p role="status" aria-live="polite" className="mt-4 rounded-xl bg-slate-100 p-4 font-mono text-lg">{color}</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
    <p className="mt-4 text-sm text-slate-600">Изображение обрабатывается в браузере и не отправляется на сервер.</p>
  </section>;
}
