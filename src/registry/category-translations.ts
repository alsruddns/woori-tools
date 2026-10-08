import type { Locale } from "@/i18n/routing";
import { categories, type ToolCategory } from "./categories";

const names: Record<Locale, Record<ToolCategory, { name: string; description: string }>> = {
  ko: {
    random: { name: "랜덤 · 추첨", description: "무작위 선택과 공정한 추첨 도구" },
    "date-time": { name: "날짜 · 시간", description: "시간을 재고 일정한 간격을 관리하는 도구" },
    utility: { name: "생활", description: "일상에서 바로 쓰는 편리한 도구" },
    fortune: { name: "운세 · 엔터테인먼트", description: "가볍게 즐기며 생각을 정리하는 운세와 카드 도구" },
    image: { name: "이미지", description: "이미지 변환과 편집 도구" },
    pdf: { name: "PDF", description: "브라우저에서 사용하는 PDF 도구" },
    text: { name: "텍스트", description: "텍스트 정리와 비교 도구" },
    developer: { name: "개발자", description: "개발 작업을 돕는 변환 및 생성 도구" },
    qr: { name: "QR · 생활", description: "QR 코드와 생활 도구" },
  },
  en: {
    random: { name: "Random & Pickers", description: "Fair random selection and drawing tools" },
    "date-time": { name: "Date & Time", description: "Tools for timing and managing time" },
    utility: { name: "Utilities", description: "Useful tools for everyday tasks" },
    fortune: { name: "Fortune & Entertainment", description: "Lighthearted readings for reflection and entertainment" },
    image: { name: "Image", description: "Convert and edit images" },
    pdf: { name: "PDF", description: "PDF tools that run in your browser" },
    text: { name: "Text", description: "Format and compare text" },
    developer: { name: "Developer", description: "Conversion and generation tools for development" },
    qr: { name: "QR & Utilities", description: "QR codes and everyday utilities" },
  },
  ja: {
    random: { name: "ランダム・抽選", description: "ランダム選択や公平な抽選に使えるツール" },
    "date-time": { name: "日付・時間", description: "時間計測や時間管理に便利なツール" },
    utility: { name: "生活ツール", description: "日常ですぐに使える便利なツール" },
    fortune: { name: "占い・エンタメ", description: "気軽に楽しみ、自分を振り返るための占いツール" },
    image: { name: "画像", description: "画像の変換と編集ツール" },
    pdf: { name: "PDF", description: "ブラウザーで使えるPDFツール" },
    text: { name: "テキスト", description: "テキストの整理と比較ツール" },
    developer: { name: "開発者", description: "開発を支援する変換・生成ツール" },
    qr: { name: "QR・ユーティリティ", description: "QRコードと日常に便利なツール" },
  },
  zh: {
    random: { name: "随机与抽选", description: "公平随机选择与抽选工具" },
    "date-time": { name: "日期与时间", description: "计时与时间管理工具" },
    utility: { name: "生活工具", description: "日常任务中实用的工具" },
    fortune: { name: "运势与娱乐", description: "用于轻松娱乐和自我反思的运势工具" },
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
