"use client";

export async function copyText(text: string): Promise<boolean> {
  let success = false;
  try {
    await navigator.clipboard.writeText(text);
    success = true;
  } catch {
    success = false;
  }

  window.dispatchEvent(new CustomEvent("woori-tools:copy-result", { detail: { success } }));
  return success;
}
