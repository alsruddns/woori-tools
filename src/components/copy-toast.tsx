"use client";

import { useEffect, useState } from "react";
import { isPlannedLocale, type TargetLocale } from "@/i18n/routing";
import { targetCoreMessages } from "@/i18n/target-locale-copy";

const copyMessages: Record<string, { success: string; failure: string }> = {
  ko: { success: "복사됐습니다.", failure: "복사에 실패했습니다." },
  en: { success: "Copied.", failure: "Failed to copy." },
  ja: { success: "コピーしました。", failure: "コピーに失敗しました。" },
  zh: { success: "已复制。", failure: "复制失败。" },
  es: { success: "Copiado.", failure: "No se pudo copiar." },
  "pt-br": { success: "Copiado.", failure: "Não foi possível copiar." },
  de: { success: "Kopiert.", failure: "Kopieren fehlgeschlagen." },
  fr: { success: "Copié.", failure: "Échec de la copie." },
  vi: { success: "Đã sao chép.", failure: "Không thể sao chép." },
  id: { success: "Disalin.", failure: "Gagal menyalin." },
  th: { success: "คัดลอกแล้ว", failure: "คัดลอกไม่สำเร็จ" },
  "zh-tw": { success: "已複製。", failure: "複製失敗。" },
  it: { success: "Copiato.", failure: "Copia non riuscita." },
  nl: { success: "Gekopieerd.", failure: "Kopiëren mislukt." },
  hi: { success: "कॉपी किया गया।", failure: "कॉपी नहीं हो सका।" },
};

export function CopyToast({ locale }: { locale: TargetLocale }) {
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    let timeout: number | undefined;
    const onCopyResult = (event: Event) => {
      const result = (event as CustomEvent<{ success: boolean }>).detail.success;
      setSuccess(result);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setSuccess(null), 1800);
    };
    window.addEventListener("woori-tools:copy-result", onCopyResult);
    return () => {
      window.removeEventListener("woori-tools:copy-result", onCopyResult);
      window.clearTimeout(timeout);
    };
  }, []);

  if (success === null) return null;
  const message = isPlannedLocale(locale)
    ? success ? targetCoreMessages[locale].copySuccess : targetCoreMessages[locale].copyFailure
    : success ? copyMessages[locale].success : copyMessages[locale].failure;
  return <div role={success ? "status" : "alert"} aria-live={success ? "polite" : "assertive"} className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
    {message}
  </div>;
}
