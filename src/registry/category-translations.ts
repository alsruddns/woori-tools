import type { PublishedTargetLocale } from "@/i18n/routing";
import { categories, type ToolCategory } from "./categories";

const names: Record<string, Record<ToolCategory, { name: string; description: string }>> = {
  ru: {
    random: { name: "Случайный выбор", description: "Инструменты для случайного выбора и жеребьёвки" }, "date-time": { name: "Дата и время", description: "Инструменты для измерения времени и планирования" }, utility: { name: "Полезные инструменты", description: "Практичные инструменты для повседневных задач" }, fortune: { name: "Предсказания и досуг", description: "Лёгкие расклады для развлечения и самоанализа" }, image: { name: "Изображения", description: "Преобразование и редактирование изображений" }, pdf: { name: "PDF", description: "Инструменты для PDF в браузере" }, text: { name: "Текст", description: "Обработка и сравнение текста" }, developer: { name: "Для разработчиков", description: "Инструменты преобразования и генерации для разработки" }, qr: { name: "QR-коды и полезные инструменты", description: "QR-коды и повседневные инструменты" },
  },
  es: {
    random: { name: "Sorteos y selección", description: "Herramientas para elegir y sortear al azar" }, "date-time": { name: "Fecha y hora", description: "Herramientas para medir y organizar el tiempo" }, utility: { name: "Utilidades", description: "Herramientas prácticas para el día a día" }, fortune: { name: "Fortuna y entretenimiento", description: "Lecturas ligeras para reflexionar y divertirse" }, image: { name: "Imagen", description: "Convierte y edita imágenes" }, pdf: { name: "PDF", description: "Herramientas PDF que funcionan en el navegador" }, text: { name: "Texto", description: "Organiza y compara textos" }, developer: { name: "Desarrollo", description: "Herramientas de conversión y generación para desarrollo" }, qr: { name: "QR y utilidades", description: "Códigos QR y utilidades cotidianas" },
  },
  "pt-br": {
    random: { name: "Sorteios e escolhas", description: "Ferramentas para escolhas e sorteios aleatórios" }, "date-time": { name: "Data e hora", description: "Ferramentas para medir e organizar o tempo" }, utility: { name: "Utilidades", description: "Ferramentas práticas para o dia a dia" }, fortune: { name: "Sorte e entretenimento", description: "Leituras leves para refletir e se divertir" }, image: { name: "Imagem", description: "Converta e edite imagens" }, pdf: { name: "PDF", description: "Ferramentas PDF que funcionam no navegador" }, text: { name: "Texto", description: "Organize e compare textos" }, developer: { name: "Desenvolvimento", description: "Ferramentas de conversão e geração para desenvolvimento" }, qr: { name: "QR e utilidades", description: "Códigos QR e utilidades do dia a dia" },
  },
  de: {
    random: { name: "Zufall & Auswahl", description: "Werkzeuge für zufällige Auswahl und faire Ziehungen" }, "date-time": { name: "Datum & Uhrzeit", description: "Werkzeuge zum Messen und Planen von Zeit" }, utility: { name: "Alltag", description: "Praktische Werkzeuge für tägliche Aufgaben" }, fortune: { name: "Orakel & Unterhaltung", description: "Unbeschwerte Deutungen zur Unterhaltung und Reflexion" }, image: { name: "Bild", description: "Bilder konvertieren und bearbeiten" }, pdf: { name: "PDF", description: "PDF-Werkzeuge direkt im Browser" }, text: { name: "Text", description: "Texte formatieren und vergleichen" }, developer: { name: "Entwicklung", description: "Konvertierungs- und Generatorwerkzeuge für die Entwicklung" }, qr: { name: "QR & Alltag", description: "QR-Codes und praktische Alltagswerkzeuge" },
  },
  fr: {
    random: { name: "Hasard et tirages", description: "Outils de sélection aléatoire et de tirage équitable" }, "date-time": { name: "Date et heure", description: "Outils pour mesurer et organiser le temps" }, utility: { name: "Utilitaires", description: "Outils pratiques pour les tâches quotidiennes" }, fortune: { name: "Divination et loisirs", description: "Lectures légères pour réfléchir et se divertir" }, image: { name: "Image", description: "Convertir et modifier des images" }, pdf: { name: "PDF", description: "Outils PDF utilisables dans le navigateur" }, text: { name: "Texte", description: "Mettre en forme et comparer du texte" }, developer: { name: "Développement", description: "Outils de conversion et de génération pour le développement" }, qr: { name: "QR et utilitaires", description: "Codes QR et outils du quotidien" },
  },
  vi: {
    random: { name: "Ngẫu nhiên và bốc thăm", description: "Công cụ chọn ngẫu nhiên và bốc thăm công bằng" }, "date-time": { name: "Ngày và giờ", description: "Công cụ đo và quản lý thời gian" }, utility: { name: "Tiện ích", description: "Công cụ hữu ích cho công việc hằng ngày" }, fortune: { name: "Vận may và giải trí", description: "Nội dung giải trí nhẹ nhàng để chiêm nghiệm" }, image: { name: "Hình ảnh", description: "Chuyển đổi và chỉnh sửa hình ảnh" }, pdf: { name: "PDF", description: "Công cụ PDF chạy trong trình duyệt" }, text: { name: "Văn bản", description: "Định dạng và so sánh văn bản" }, developer: { name: "Lập trình", description: "Công cụ chuyển đổi và tạo nội dung cho lập trình" }, qr: { name: "QR và tiện ích", description: "Mã QR và tiện ích hằng ngày" },
  },
  id: {
    random: { name: "Acak & Undian", description: "Alat untuk memilih dan mengundi secara acak" }, "date-time": { name: "Tanggal & Waktu", description: "Alat untuk mengukur dan mengatur waktu" }, utility: { name: "Utilitas", description: "Alat praktis untuk kebutuhan sehari-hari" }, fortune: { name: "Ramalan & Hiburan", description: "Bacaan ringan untuk refleksi dan hiburan" }, image: { name: "Gambar", description: "Konversi dan edit gambar" }, pdf: { name: "PDF", description: "Alat PDF yang berjalan di browser" }, text: { name: "Teks", description: "Rapikan dan bandingkan teks" }, developer: { name: "Pengembangan", description: "Alat konversi dan pembuatan untuk pengembangan" }, qr: { name: "QR & Utilitas", description: "Kode QR dan utilitas sehari-hari" },
  },
  th: {
    random: { name: "สุ่มและจับฉลาก", description: "เครื่องมือสุ่มเลือกและจับรางวัลอย่างยุติธรรม" }, "date-time": { name: "วันที่และเวลา", description: "เครื่องมือจับเวลาและจัดการเวลา" }, utility: { name: "เครื่องมือทั่วไป", description: "เครื่องมือที่มีประโยชน์สำหรับงานประจำวัน" }, fortune: { name: "ดวงและความบันเทิง", description: "คำทำนายเบา ๆ เพื่อความสนุกและทบทวนตัวเอง" }, image: { name: "รูปภาพ", description: "แปลงและแก้ไขรูปภาพ" }, pdf: { name: "PDF", description: "เครื่องมือ PDF ที่ทำงานในเบราว์เซอร์" }, text: { name: "ข้อความ", description: "จัดรูปแบบและเปรียบเทียบข้อความ" }, developer: { name: "นักพัฒนา", description: "เครื่องมือแปลงและสร้างสำหรับงานพัฒนา" }, qr: { name: "QR และเครื่องมือทั่วไป", description: "รหัส QR และเครื่องมือในชีวิตประจำวัน" },
  },
  "zh-tw": {
    random: { name: "隨機與抽選", description: "公平的隨機選擇與抽籤工具" }, "date-time": { name: "日期與時間", description: "計時與時間管理工具" }, utility: { name: "生活工具", description: "日常工作中實用的工具" }, fortune: { name: "運勢與娛樂", description: "輕鬆體驗並用於自我反思的占卜內容" }, image: { name: "圖片", description: "圖片轉換與編輯工具" }, pdf: { name: "PDF", description: "在瀏覽器中使用的 PDF 工具" }, text: { name: "文字", description: "文字整理與比較工具" }, developer: { name: "開發者", description: "協助開發工作的轉換與產生工具" }, qr: { name: "QR 與生活工具", description: "QR 碼與日常實用工具" },
  },
  it: {
    random: { name: "Casualità e sorteggi", description: "Strumenti per scegliere e sorteggiare in modo casuale" }, "date-time": { name: "Data e ora", description: "Strumenti per misurare e gestire il tempo" }, utility: { name: "Utilità", description: "Strumenti pratici per le attività quotidiane" }, fortune: { name: "Oroscopo e intrattenimento", description: "Letture leggere per riflettere e divertirsi" }, image: { name: "Immagine", description: "Converti e modifica immagini" }, pdf: { name: "PDF", description: "Strumenti PDF utilizzabili nel browser" }, text: { name: "Testo", description: "Formatta e confronta testi" }, developer: { name: "Sviluppo", description: "Strumenti di conversione e generazione per lo sviluppo" }, qr: { name: "QR e utilità", description: "Codici QR e utilità quotidiane" },
  },
  nl: {
    random: { name: "Willekeurig kiezen", description: "Hulpmiddelen voor eerlijke willekeurige selecties en trekkingen" }, "date-time": { name: "Datum en tijd", description: "Hulpmiddelen om tijd te meten en te beheren" }, utility: { name: "Hulpmiddelen", description: "Handige hulpmiddelen voor dagelijkse taken" }, fortune: { name: "Horoscoop en entertainment", description: "Luchtige lezingen voor reflectie en plezier" }, image: { name: "Afbeelding", description: "Afbeeldingen converteren en bewerken" }, pdf: { name: "PDF", description: "PDF-hulpmiddelen in je browser" }, text: { name: "Tekst", description: "Tekst opmaken en vergelijken" }, developer: { name: "Ontwikkeling", description: "Conversie- en generatiehulpmiddelen voor ontwikkeling" }, qr: { name: "QR en hulpmiddelen", description: "QR-codes en dagelijkse hulpmiddelen" },
  },
  hi: {
    random: { name: "रैंडम और चयन", description: "यादृच्छिक चयन और निष्पक्ष ड्रॉ के उपकरण" }, "date-time": { name: "तिथि और समय", description: "समय मापने और व्यवस्थित करने के उपकरण" }, utility: { name: "उपयोगिताएँ", description: "रोज़मर्रा के कामों के लिए उपयोगी उपकरण" }, fortune: { name: "भाग्य और मनोरंजन", description: "मनोरंजन और आत्मचिंतन के लिए हल्की रीडिंग" }, image: { name: "छवि", description: "छवियों को बदलें और संपादित करें" }, pdf: { name: "PDF", description: "ब्राउज़र में चलने वाले PDF उपकरण" }, text: { name: "टेक्स्ट", description: "टेक्स्ट को व्यवस्थित और तुलना करें" }, developer: { name: "डेवलपर", description: "विकास कार्यों के लिए रूपांतरण और जनरेशन उपकरण" }, qr: { name: "QR और उपयोगिताएँ", description: "QR कोड और रोज़मर्रा के उपयोगी उपकरण" },
  },
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

export function getLocalizedCategory(id: ToolCategory, locale: PublishedTargetLocale) {
  const original = categories.find((category) => category.id === id);
  if (!original) return undefined;
  return { ...original, ...(names[locale] ?? names.en)[id] };
}

export function findLocalizedCategory(id: string, locale: PublishedTargetLocale) {
  const original = categories.find((category) => category.id === id);
  return original ? { ...original, ...(names[locale] ?? names.en)[original.id] } : undefined;
}

export function getLocalizedCategories(locale: PublishedTargetLocale) {
  return categories.map((category) => ({ ...category, ...(names[locale] ?? names.en)[category.id] }));
}
