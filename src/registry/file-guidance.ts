import type { Locale } from "@/i18n/routing";
import type { ToolDefinition } from "@/registry/tools";

const labels: Record<Locale, { types: string; limit: string; result: string; browser: string }> = {
  ko: { types: "지원 형식", limit: "크기 제한", result: "결과 파일을 만들면 다운로드 버튼으로 기기에 저장합니다.", browser: "고정 상한 없음 · 브라우저 메모리 범위 내" },
  en: { types: "Accepted files", limit: "Size limit", result: "When a result file is created, use Download to save it to your device.", browser: "No fixed cap · limited by browser memory" },
  ja: { types: "対応ファイル", limit: "サイズ制限", result: "結果ファイルが作成された場合は、ダウンロードから端末に保存できます。", browser: "固定上限なし · ブラウザーのメモリに依存" },
  zh: { types: "支持的文件", limit: "大小限制", result: "生成结果文件后，可通过下载按钮保存到设备。", browser: "无固定上限 · 受浏览器内存限制" },
  es: { types: "Archivos admitidos", limit: "Límite de tamaño", result: "Si se crea un archivo, usa Descargar para guardarlo en tu dispositivo.", browser: "Sin límite fijo · depende de la memoria del navegador" },
  "pt-br": { types: "Arquivos aceitos", limit: "Limite de tamanho", result: "Se um arquivo for criado, use Baixar para salvá-lo no dispositivo.", browser: "Sem limite fixo · depende da memória do navegador" },
  de: { types: "Unterstützte Dateien", limit: "Größenlimit", result: "Wenn eine Ergebnisdatei erstellt wird, speichere sie mit Herunterladen auf deinem Gerät.", browser: "Kein festes Limit · abhängig vom Browserspeicher" },
  fr: { types: "Fichiers acceptés", limit: "Taille maximale", result: "Si un fichier est créé, utilisez Télécharger pour l’enregistrer sur votre appareil.", browser: "Pas de limite fixe · selon la mémoire du navigateur" },
  vi: { types: "Tệp được hỗ trợ", limit: "Giới hạn dung lượng", result: "Nếu có tệp kết quả, hãy dùng nút Tải xuống để lưu trên thiết bị.", browser: "Không có mức cố định · phụ thuộc bộ nhớ trình duyệt" },
  id: { types: "File yang didukung", limit: "Batas ukuran", result: "Jika file hasil dibuat, gunakan Unduh untuk menyimpannya di perangkat.", browser: "Tanpa batas tetap · tergantung memori browser" },
  th: { types: "ไฟล์ที่รองรับ", limit: "ขนาดสูงสุด", result: "หากมีไฟล์ผลลัพธ์ ให้กดดาวน์โหลดเพื่อบันทึกลงอุปกรณ์", browser: "ไม่มีขีดจำกัดตายตัว · ขึ้นกับหน่วยความจำเบราว์เซอร์" },
  "zh-tw": { types: "支援的檔案", limit: "大小限制", result: "若產生結果檔案，可使用下載按鈕儲存到裝置。", browser: "無固定上限 · 受瀏覽器記憶體限制" },
  it: { types: "File supportati", limit: "Limite dimensione", result: "Se viene creato un file, usa Scarica per salvarlo sul dispositivo.", browser: "Nessun limite fisso · dipende dalla memoria del browser" },
  nl: { types: "Ondersteunde bestanden", limit: "Maximale grootte", result: "Als er een resultaatbestand is, sla het dan met Downloaden op je apparaat op.", browser: "Geen vaste limiet · afhankelijk van browsergeheugen" },
  hi: { types: "समर्थित फ़ाइलें", limit: "आकार सीमा", result: "परिणाम फ़ाइल बनने पर डाउनलोड से उसे अपने डिवाइस पर सहेजें।", browser: "कोई निश्चित सीमा नहीं · ब्राउज़र मेमोरी पर निर्भर" },
};

export function getFileGuidance(tool: ToolDefinition, locale: Locale) {
  if (!tool.usesFileInput) return undefined;
  const label = labels[locale];
  const isImage = tool.category === "image";
  const isPdf = tool.category === "pdf";
  const types = isImage ? "image/*, HEIC, HEIF" : isPdf ? "PDF (.pdf)" : "*/*";
  const limit = tool.slug === "pdf-page-size-checker" ? label.browser
    : tool.slug === "image-collage" ? "30 MB / file · 6 files · 100 MB total"
    : tool.slug === "images-to-pdf" ? "30 MB / file · 50 MB total"
    : isImage ? "30 MB / file"
    : isPdf ? "50 MB total"
    : "100 MB / file · 100 files · 200 MB total";
  return { types: `${label.types}: ${types}`, limit: `${label.limit}: ${limit}`, result: label.result };
}
