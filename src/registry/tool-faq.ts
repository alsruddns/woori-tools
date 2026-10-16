import type { Locale } from "@/i18n/routing";

const questions: Record<Locale, { example: (title: string) => string; caution: (title: string) => string }> = {
  ko: { example: (title) => `${title}에서는 어떤 입력을 시험할 수 있나요?`, caution: (title) => `${title} 결과를 사용할 때 무엇을 확인해야 하나요?` },
  en: { example: (title) => `What can I try in ${title}?`, caution: (title) => `What should I check before using the ${title} result?` },
  ja: { example: (title) => `${title}ではどのような入力を試せますか？`, caution: (title) => `${title}の結果を使う前に何を確認すべきですか？` },
  zh: { example: (title) => `${title}可以尝试什么输入？`, caution: (title) => `使用${title}的结果前需要检查什么？` },
  es: { example: (title) => `¿Qué puedo probar en ${title}?`, caution: (title) => `¿Qué debo revisar antes de usar el resultado de ${title}?` },
  "pt-br": { example: (title) => `O que posso testar em ${title}?`, caution: (title) => `O que devo conferir antes de usar o resultado de ${title}?` },
  de: { example: (title) => `Welche Eingabe kann ich in ${title} ausprobieren?`, caution: (title) => `Was sollte ich vor der Verwendung des Ergebnisses von ${title} prüfen?` },
  fr: { example: (title) => `Que puis-je essayer dans ${title} ?`, caution: (title) => `Que vérifier avant d’utiliser le résultat de ${title} ?` },
  vi: { example: (title) => `Tôi có thể thử dữ liệu nào trong ${title}?`, caution: (title) => `Cần kiểm tra gì trước khi dùng kết quả của ${title}?` },
  id: { example: (title) => `Masukan apa yang bisa dicoba di ${title}?`, caution: (title) => `Apa yang perlu diperiksa sebelum memakai hasil ${title}?` },
  th: { example: (title) => `ลองป้อนข้อมูลอะไรใน ${title} ได้บ้าง`, caution: (title) => `ควรตรวจสอบอะไร ก่อนใช้ผลลัพธ์จาก ${title}` },
  "zh-tw": { example: (title) => `${title}可以嘗試什麼輸入？`, caution: (title) => `使用${title}的結果前應確認什麼？` },
  it: { example: (title) => `Cosa posso provare in ${title}?`, caution: (title) => `Cosa devo verificare prima di usare il risultato di ${title}?` },
  nl: { example: (title) => `Welke invoer kan ik proberen in ${title}?`, caution: (title) => `Wat moet ik controleren voordat ik het resultaat van ${title} gebruik?` },
  hi: { example: (title) => `${title} में किस इनपुट को आज़मा सकता हूँ?`, caution: (title) => `${title} का परिणाम उपयोग करने से पहले क्या जाँचूँ?` },
};

export function getToolFaqQuestions(locale: Locale, title: string) {
  return { example: questions[locale].example(title), caution: questions[locale].caution(title) };
}
