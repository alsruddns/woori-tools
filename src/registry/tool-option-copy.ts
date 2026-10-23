import type { RouteLocale } from "@/i18n/routing";
export type ToolOptionLocale = RouteLocale | "pl";

type RenameCopy = { prefix: string; suffix: string; find: string; replace: string; start: string; padding: string; before: string; after: string; empty: string };
export const renameCopy: Record<ToolOptionLocale, RenameCopy> = {
  ko: { prefix:"접두사",suffix:"접미사",find:"찾을 문자열",replace:"바꿀 문자열",start:"시작 번호",padding:"번호 자릿수",before:"변경 전",after:"변경 후",empty:"파일을 선택하면 이름 미리보기가 표시됩니다." },
  en: { prefix:"Prefix",suffix:"Suffix",find:"Find",replace:"Replace",start:"Start number",padding:"Number padding",before:"Before",after:"After",empty:"Select files to preview their new names." },
  ja: { prefix:"接頭辞",suffix:"接尾辞",find:"検索文字列",replace:"置換文字列",start:"開始番号",padding:"番号の桁数",before:"変更前",after:"変更後",empty:"ファイルを選択すると新しい名前を表示します。" },
  zh: { prefix:"前缀",suffix:"后缀",find:"查找文本",replace:"替换文本",start:"起始编号",padding:"编号位数",before:"原文件名",after:"新文件名",empty:"选择文件后即可预览新名称。" },
  es: { prefix:"Prefijo",suffix:"Sufijo",find:"Buscar",replace:"Sustituir",start:"Número inicial",padding:"Dígitos del número",before:"Antes",after:"Después",empty:"Selecciona archivos para previsualizar sus nuevos nombres." },
  "pt-br": { prefix:"Prefixo",suffix:"Sufixo",find:"Buscar",replace:"Substituir",start:"Número inicial",padding:"Dígitos do número",before:"Antes",after:"Depois",empty:"Selecione arquivos para visualizar os novos nomes." },
  de: { prefix:"Präfix",suffix:"Suffix",find:"Suchen",replace:"Ersetzen",start:"Startnummer",padding:"Ziffernanzahl",before:"Vorher",after:"Nachher",empty:"Wähle Dateien aus, um die neuen Namen zu sehen." },
  fr: { prefix:"Préfixe",suffix:"Suffixe",find:"Rechercher",replace:"Remplacer",start:"Numéro de départ",padding:"Nombre de chiffres",before:"Avant",after:"Après",empty:"Sélectionnez des fichiers pour prévisualiser leurs nouveaux noms." },
  vi: { prefix:"Tiền tố",suffix:"Hậu tố",find:"Tìm",replace:"Thay thế",start:"Số bắt đầu",padding:"Số chữ số",before:"Trước",after:"Sau",empty:"Chọn tệp để xem trước tên mới." },
  id: { prefix:"Awalan",suffix:"Akhiran",find:"Cari",replace:"Ganti",start:"Nomor awal",padding:"Jumlah digit",before:"Sebelum",after:"Sesudah",empty:"Pilih file untuk melihat pratinjau nama baru." },
  th: { prefix:"คำนำหน้า",suffix:"คำต่อท้าย",find:"ค้นหา",replace:"แทนที่",start:"เลขเริ่มต้น",padding:"จำนวนหลัก",before:"ก่อน",after:"หลัง",empty:"เลือกไฟล์เพื่อดูตัวอย่างชื่อใหม่" },
  "zh-tw": { prefix:"前綴",suffix:"後綴",find:"尋找",replace:"取代",start:"起始編號",padding:"編號位數",before:"變更前",after:"變更後",empty:"選取檔案後即可預覽新名稱。" },
  it: { prefix:"Prefisso",suffix:"Suffisso",find:"Trova",replace:"Sostituisci",start:"Numero iniziale",padding:"Cifre del numero",before:"Prima",after:"Dopo",empty:"Seleziona file per vedere i nuovi nomi in anteprima." },
  nl: { prefix:"Voorvoegsel",suffix:"Achtervoegsel",find:"Zoeken",replace:"Vervangen",start:"Startnummer",padding:"Aantal cijfers",before:"Voor",after:"Na",empty:"Selecteer bestanden om de nieuwe namen te bekijken." },
  hi: { prefix:"उपसर्ग",suffix:"प्रत्यय",find:"खोजें",replace:"बदलें",start:"प्रारंभिक संख्या",padding:"अंकों की संख्या",before:"पहले",after:"बाद",empty:"नए नामों का पूर्वावलोकन देखने के लिए फ़ाइलें चुनें।" },
  pl: { prefix:"Prefiks",suffix:"Sufiks",find:"Szukany tekst",replace:"Tekst zastępczy",start:"Numer początkowy",padding:"Liczba cyfr",before:"Przed zmianą",after:"Po zmianie",empty:"Wybierz pliki, aby zobaczyć podgląd nowych nazw." },
};

type SelectionCopy = { noRepeat: string; repeat: string; digits: string; latin: string; hangul: string; special: string; custom: string };
export const selectionCopy: Record<ToolOptionLocale, SelectionCopy> = {
  ko: { noRepeat:"중복 없이",repeat:"중복 허용",digits:"숫자",latin:"영문",hangul:"한글",special:"특수문자",custom:"사용자 지정" },
  en: { noRepeat:"Without repeats",repeat:"Allow repeats",digits:"Digits",latin:"Latin letters",hangul:"Korean characters",special:"Special characters",custom:"Custom string" },
  ja: { noRepeat:"重複なし",repeat:"重複あり",digits:"数字",latin:"英字",hangul:"ハングル",special:"記号",custom:"指定文字列" },
  zh: { noRepeat:"不重复",repeat:"允许重复",digits:"数字",latin:"英文字母",hangul:"韩文",special:"特殊字符",custom:"自定义字符" },
  es: { noRepeat:"Sin repeticiones",repeat:"Permitir repeticiones",digits:"Dígitos",latin:"Letras latinas",hangul:"Caracteres coreanos",special:"Símbolos",custom:"Texto personalizado" },
  "pt-br": { noRepeat:"Sem repetições",repeat:"Permitir repetições",digits:"Dígitos",latin:"Letras latinas",hangul:"Caracteres coreanos",special:"Símbolos",custom:"Texto personalizado" },
  de: { noRepeat:"Ohne Wiederholungen",repeat:"Wiederholungen zulassen",digits:"Ziffern",latin:"Lateinische Buchstaben",hangul:"Koreanische Zeichen",special:"Sonderzeichen",custom:"Eigener Text" },
  fr: { noRepeat:"Sans répétition",repeat:"Autoriser les répétitions",digits:"Chiffres",latin:"Lettres latines",hangul:"Caractères coréens",special:"Symboles",custom:"Texte personnalisé" },
  vi: { noRepeat:"Không lặp lại",repeat:"Cho phép lặp",digits:"Chữ số",latin:"Chữ Latin",hangul:"Chữ Hàn",special:"Ký tự đặc biệt",custom:"Văn bản tùy chỉnh" },
  id: { noRepeat:"Tanpa pengulangan",repeat:"Izinkan pengulangan",digits:"Angka",latin:"Huruf Latin",hangul:"Huruf Korea",special:"Simbol",custom:"Teks khusus" },
  th: { noRepeat:"ไม่ซ้ำ",repeat:"อนุญาตให้ซ้ำ",digits:"ตัวเลข",latin:"อักษรละติน",hangul:"อักษรเกาหลี",special:"สัญลักษณ์",custom:"ข้อความกำหนดเอง" },
  "zh-tw": { noRepeat:"不重複",repeat:"允許重複",digits:"數字",latin:"拉丁字母",hangul:"韓文字元",special:"特殊符號",custom:"自訂文字" },
  it: { noRepeat:"Senza ripetizioni",repeat:"Consenti ripetizioni",digits:"Cifre",latin:"Lettere latine",hangul:"Caratteri coreani",special:"Simboli",custom:"Testo personalizzato" },
  nl: { noRepeat:"Zonder herhaling",repeat:"Herhaling toestaan",digits:"Cijfers",latin:"Latijnse letters",hangul:"Koreaanse tekens",special:"Speciale tekens",custom:"Aangepaste tekst" },
  hi: { noRepeat:"बिना दोहराव",repeat:"दोहराव की अनुमति",digits:"अंक",latin:"लैटिन अक्षर",hangul:"कोरियाई अक्षर",special:"विशेष वर्ण",custom:"अपना पाठ" },
  pl: { noRepeat:"Bez powtórzeń",repeat:"Z powtórzeniami",digits:"Cyfry",latin:"Litery łacińskie",hangul:"Znaki koreańskie",special:"Znaki specjalne",custom:"Własny tekst" },
};
