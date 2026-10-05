export const categories = [
  { id: "image", name: "이미지", description: "이미지 변환과 편집 도구" },
  { id: "pdf", name: "PDF", description: "브라우저에서 사용하는 PDF 도구" },
  { id: "text", name: "텍스트", description: "텍스트 정리와 비교 도구" },
  { id: "developer", name: "개발자", description: "개발 작업을 돕는 변환 및 생성 도구" },
  { id: "qr", name: "QR · 생활", description: "QR 코드와 생활 도구" },
] as const;

export type ToolCategory = (typeof categories)[number]["id"];
export const categoryById = Object.fromEntries(categories.map((item) => [item.id, item])) as Record<ToolCategory, (typeof categories)[number]>;
