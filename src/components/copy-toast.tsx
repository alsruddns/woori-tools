"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";

const copyMessages: Record<Locale, { success: string; failure: string }> = {
  ko: { success: "복사됐습니다.", failure: "복사에 실패했습니다." },
  en: { success: "Copied.", failure: "Failed to copy." },
  ja: { success: "コピーしました。", failure: "コピーに失敗しました。" },
  zh: { success: "已复制。", failure: "复制失败。" },
};

export function CopyToast({ locale }: { locale: Locale }) {
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
  return <div role={success ? "status" : "alert"} aria-live={success ? "polite" : "assertive"} className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
    {success ? copyMessages[locale].success : copyMessages[locale].failure}
  </div>;
}
