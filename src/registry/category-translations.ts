import type { Locale } from "@/i18n/routing";
import { categories, type ToolCategory } from "./categories";

const names: Record<Locale, Record<ToolCategory, { name: string; description: string }>> = {
  ko: {
    image: { name: "이미지", description: "이미지 변환과 편집 도구" },
    pdf: { name: "PDF", description: "브라우저에서 사용하는 PDF 도구" },
    text: { name: "텍스트", description: "텍스트 정리와 비교 도구" },
    developer: { name: "개발자", description: "개발 작업을 돕는 변환 및 생성 도구" },
    qr: { name: "QR · 생활", description: "QR 코드와 생활 도구" },
  },
  en: {
    image: { name: "Image", description: "Convert and edit images" },
    pdf: { name: "PDF", description: "PDF tools that run in your browser" },
    text: { name: "Text", description: "Format and compare text" },
    developer: { name: "Developer", description: "Conversion and generation tools for development" },
    qr: { name: "QR & Utilities", description: "QR codes and everyday utilities" },
  },
  ja: {
    image: { name: "画像", description: "画像の変換と編集ツール" },
    pdf: { name: "PDF", description: "ブラウザーで使えるPDFツール" },
    text: { name: "テキスト", description: "テキストの整理と比較ツール" },
    developer: { name: "開発者", description: "開発を支援する変換・生成ツール" },
    qr: { name: "QR・ユーティリティ", description: "QRコードと日常に便利なツール" },
  },
  zh: {
    image: { name: "图片", description: "图像转换与编辑工具" },
    pdf: { name: "PDF", description: "在浏览器中使用的PDF工具" },
    text: { name: "文本", description: "文本整理与比较工具" },
    developer: { name: "开发者", description: "帮助开发工作的转换与生成工具" },
    qr: { name: "二维码与实用工具", description: "二维码和日常实用工具" },
  },
};

export function getLocalizedCategory(id: ToolCategory, locale: Locale) {
  const original = categories.find((category) => category.id === id);
  if (!original) return undefined;
  return { ...original, ...names[locale][id] };
}

export function findLocalizedCategory(id: string, locale: Locale) {
  const original = categories.find((category) => category.id === id);
  return original ? { ...original, ...names[locale][original.id] } : undefined;
}

export function getLocalizedCategories(locale: Locale) {
  return categories.map((category) => ({ ...category, ...names[locale][category.id] }));
}
