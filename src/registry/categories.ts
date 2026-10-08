export const categories = [
  { id: "random", name: "랜덤 · 추첨", description: "무작위 선택과 공정한 추첨 도구" },
  { id: "date-time", name: "날짜 · 시간", description: "시간을 재고 일정한 간격을 관리하는 도구" },
  { id: "utility", name: "생활", description: "일상에서 바로 쓰는 편리한 도구" },
  { id: "image", name: "이미지", description: "이미지 변환과 편집 도구" },
  { id: "pdf", name: "PDF", description: "브라우저에서 사용하는 PDF 도구" },
  { id: "text", name: "텍스트", description: "텍스트 정리와 비교 도구" },
  { id: "developer", name: "개발자", description: "개발 작업을 돕는 변환 및 생성 도구" },
  { id: "qr", name: "QR · 생활", description: "QR 코드와 생활 도구" },
] as const;

export type ToolCategory = (typeof categories)[number]["id"];
export const categoryById = Object.fromEntries(categories.map((item) => [item.id, item])) as Record<ToolCategory, (typeof categories)[number]>;
