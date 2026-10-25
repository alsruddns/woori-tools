"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublishedTargetLocale } from "@/i18n/routing";

const fallbackZones = ["Asia/Seoul", "Asia/Tokyo", "Asia/Shanghai", "Asia/Singapore", "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles", "Australia/Sydney", "Pacific/Auckland"];
const defaultZones = ["Asia/Seoul", "Asia/Tokyo", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Singapore", "Australia/Sydney"];
const labels: Record<string, Record<string, string>> = {
  ko: { title: "세계 시간", add: "도시 추가", remove: "삭제", search: "시간대 검색", none: "표시할 도시가 없습니다." },
  en: { title: "World clock", add: "Add city", remove: "Remove", search: "Search time zones", none: "No cities to display." },
  ja: { title: "世界時計", add: "都市を追加", remove: "削除", search: "タイムゾーンを検索", none: "表示する都市がありません。" },
  zh: { title: "世界时钟", add: "添加城市", remove: "删除", search: "搜索时区", none: "没有可显示的城市。" },
};
Object.assign(labels, {
  es:{title:"Reloj mundial",add:"Añadir ciudad",remove:"Quitar",search:"Buscar zonas horarias",none:"No hay ciudades para mostrar."},
  "pt-br":{title:"Relógio mundial",add:"Adicionar cidade",remove:"Remover",search:"Buscar fusos horários",none:"Não há cidades para exibir."},
  de:{title:"Weltuhr",add:"Stadt hinzufügen",remove:"Entfernen",search:"Zeitzonen suchen",none:"Keine Städte zum Anzeigen."},
  fr:{title:"Horloge mondiale",add:"Ajouter une ville",remove:"Supprimer",search:"Rechercher des fuseaux horaires",none:"Aucune ville à afficher."},
  vi:{title:"Đồng hồ thế giới",add:"Thêm thành phố",remove:"Xóa",search:"Tìm múi giờ",none:"Không có thành phố để hiển thị."},
  id:{title:"Jam dunia",add:"Tambah kota",remove:"Hapus",search:"Cari zona waktu",none:"Tidak ada kota untuk ditampilkan."},
  th:{title:"นาฬิกาโลก",add:"เพิ่มเมือง",remove:"นำออก",search:"ค้นหาเขตเวลา",none:"ไม่มีเมืองให้แสดง"},
  "zh-tw":{title:"世界時鐘",add:"新增城市",remove:"移除",search:"搜尋時區",none:"沒有可顯示的城市。"},
  it:{title:"Orologio mondiale",add:"Aggiungi città",remove:"Rimuovi",search:"Cerca fusi orari",none:"Nessuna città da visualizzare."},
  nl:{title:"Wereldklok",add:"Stad toevoegen",remove:"Verwijderen",search:"Tijdzones zoeken",none:"Geen steden om weer te geven."},
  hi:{title:"विश्व घड़ी",add:"शहर जोड़ें",remove:"हटाएँ",search:"समय क्षेत्र खोजें",none:"दिखाने के लिए कोई शहर नहीं है।"},
});
Object.assign(labels, {
  fil: { title: "Orasan sa mundo", add: "Magdagdag ng lungsod", remove: "Alisin", search: "Maghanap ng time zone", none: "Walang lungsod na ipapakita." },
  bn: { title: "বিশ্ব ঘড়ি", add: "শহর যোগ করুন", remove: "সরান", search: "সময় অঞ্চল খুঁজুন", none: "দেখানোর মতো কোনো শহর নেই।" },
  uk: { title: "Світовий годинник", add: "Додати місто", remove: "Вилучити", search: "Шукати часовий пояс", none: "Немає міст для відображення." },
  ms: { title: "Jam dunia", add: "Tambah bandar", remove: "Buang", search: "Cari zon waktu", none: "Tiada bandar untuk dipaparkan." },
  sv: { title: "Världsklocka", add: "Lägg till stad", remove: "Ta bort", search: "Sök tidszoner", none: "Det finns inga städer att visa." },
  cs: { title: "Světové hodiny", add: "Přidat město", remove: "Odebrat", search: "Hledat časová pásma", none: "Žádná města k zobrazení." },
  ro: { title: "Ceas mondial", add: "Adaugă un oraș", remove: "Elimină", search: "Caută fusuri orare", none: "Nu există orașe de afișat." },
  el: { title: "Παγκόσμιο ρολόι", add: "Προσθήκη πόλης", remove: "Αφαίρεση", search: "Αναζήτηση ζωνών ώρας", none: "Δεν υπάρχουν πόλεις για εμφάνιση." },
});

const zoneNames: Record<string, Record<string, string>> = {
  ko: { "Asia/Seoul": "서울", "Asia/Tokyo": "도쿄", "Asia/Shanghai": "상하이", "Asia/Singapore": "싱가포르", "Europe/London": "런던", "Europe/Paris": "파리", "America/New_York": "뉴욕", "America/Los_Angeles": "로스앤젤레스", "Australia/Sydney": "시드니", "Pacific/Auckland": "오클랜드" },
  en: { "Asia/Seoul": "Seoul", "Asia/Tokyo": "Tokyo", "Asia/Shanghai": "Shanghai", "Asia/Singapore": "Singapore", "Europe/London": "London", "Europe/Paris": "Paris", "America/New_York": "New York", "America/Los_Angeles": "Los Angeles", "Australia/Sydney": "Sydney", "Pacific/Auckland": "Auckland" },
  ja: { "Asia/Seoul": "ソウル", "Asia/Tokyo": "東京", "Asia/Shanghai": "上海", "Asia/Singapore": "シンガポール", "Europe/London": "ロンドン", "Europe/Paris": "パリ", "America/New_York": "ニューヨーク", "America/Los_Angeles": "ロサンゼルス", "Australia/Sydney": "シドニー", "Pacific/Auckland": "オークランド" },
  zh: { "Asia/Seoul": "首尔", "Asia/Tokyo": "东京", "Asia/Shanghai": "上海", "Asia/Singapore": "新加坡", "Europe/London": "伦敦", "Europe/Paris": "巴黎", "America/New_York": "纽约", "America/Los_Angeles": "洛杉矶", "Australia/Sydney": "悉尼", "Pacific/Auckland": "奥克兰" },
};

Object.assign(zoneNames, {
  es:{"Asia/Seoul":"Seúl","Asia/Tokyo":"Tokio","Asia/Shanghai":"Shanghái","Asia/Singapore":"Singapur","Europe/London":"Londres","Europe/Paris":"París","America/New_York":"Nueva York","America/Los_Angeles":"Los Ángeles","Australia/Sydney":"Sídney","Pacific/Auckland":"Auckland"},
  "pt-br":{"Asia/Seoul":"Seul","Asia/Tokyo":"Tóquio","Asia/Shanghai":"Xangai","Asia/Singapore":"Singapura","Europe/London":"Londres","Europe/Paris":"Paris","America/New_York":"Nova York","America/Los_Angeles":"Los Angeles","Australia/Sydney":"Sydney","Pacific/Auckland":"Auckland"},
  de:{"Asia/Seoul":"Seoul","Asia/Tokyo":"Tokio","Asia/Shanghai":"Shanghai","Asia/Singapore":"Singapur","Europe/London":"London","Europe/Paris":"Paris","America/New_York":"New York","America/Los_Angeles":"Los Angeles","Australia/Sydney":"Sydney","Pacific/Auckland":"Auckland"},
  fr:{"Asia/Seoul":"Séoul","Asia/Tokyo":"Tokyo","Asia/Shanghai":"Shanghai","Asia/Singapore":"Singapour","Europe/London":"Londres","Europe/Paris":"Paris","America/New_York":"New York","America/Los_Angeles":"Los Angeles","Australia/Sydney":"Sydney","Pacific/Auckland":"Auckland"},
  vi:{"Asia/Seoul":"Seoul","Asia/Tokyo":"Tokyo","Asia/Shanghai":"Thượng Hải","Asia/Singapore":"Singapore","Europe/London":"Luân Đôn","Europe/Paris":"Paris","America/New_York":"New York","America/Los_Angeles":"Los Angeles","Australia/Sydney":"Sydney","Pacific/Auckland":"Auckland"},
  id:{"Asia/Seoul":"Seoul","Asia/Tokyo":"Tokyo","Asia/Shanghai":"Shanghai","Asia/Singapore":"Singapura","Europe/London":"London","Europe/Paris":"Paris","America/New_York":"New York","America/Los_Angeles":"Los Angeles","Australia/Sydney":"Sydney","Pacific/Auckland":"Auckland"},
  th:{"Asia/Seoul":"โซล","Asia/Tokyo":"โตเกียว","Asia/Shanghai":"เซี่ยงไฮ้","Asia/Singapore":"สิงคโปร์","Europe/London":"ลอนดอน","Europe/Paris":"ปารีส","America/New_York":"นิวยอร์ก","America/Los_Angeles":"ลอสแอนเจลิส","Australia/Sydney":"ซิดนีย์","Pacific/Auckland":"โอ๊คแลนด์"},
  "zh-tw":{"Asia/Seoul":"首爾","Asia/Tokyo":"東京","Asia/Shanghai":"上海","Asia/Singapore":"新加坡","Europe/London":"倫敦","Europe/Paris":"巴黎","America/New_York":"紐約","America/Los_Angeles":"洛杉磯","Australia/Sydney":"雪梨","Pacific/Auckland":"奧克蘭"},
  it:{"Asia/Seoul":"Seul","Asia/Tokyo":"Tokyo","Asia/Shanghai":"Shanghai","Asia/Singapore":"Singapore","Europe/London":"Londra","Europe/Paris":"Parigi","America/New_York":"New York","America/Los_Angeles":"Los Angeles","Australia/Sydney":"Sydney","Pacific/Auckland":"Auckland"},
  nl:{"Asia/Seoul":"Seoel","Asia/Tokyo":"Tokio","Asia/Shanghai":"Shanghai","Asia/Singapore":"Singapore","Europe/London":"Londen","Europe/Paris":"Parijs","America/New_York":"New York","America/Los_Angeles":"Los Angeles","Australia/Sydney":"Sydney","Pacific/Auckland":"Auckland"},
  hi:{"Asia/Seoul":"सियोल","Asia/Tokyo":"टोक्यो","Asia/Shanghai":"शंघाई","Asia/Singapore":"सिंगापुर","Europe/London":"लंदन","Europe/Paris":"पेरिस","America/New_York":"न्यूयॉर्क","America/Los_Angeles":"लॉस एंजिलिस","Australia/Sydney":"सिडनी","Pacific/Auckland":"ऑकलैंड"},
});

Object.assign(labels, { ru: { title: "Мировые часы", add: "Добавить город", remove: "Удалить", search: "Поиск часовых поясов", none: "Нет городов для отображения." } });
Object.assign(zoneNames, { ru: { "Asia/Seoul": "Сеул", "Asia/Tokyo": "Токио", "Asia/Shanghai": "Шанхай", "Asia/Singapore": "Сингапур", "Europe/London": "Лондон", "Europe/Paris": "Париж", "America/New_York": "Нью-Йорк", "America/Los_Angeles": "Лос-Анджелес", "Australia/Sydney": "Сидней", "Pacific/Auckland": "Окленд" } });

Object.assign(labels, { tr: { title: "Dünya saati", add: "Şehir ekle", remove: "Kaldır", search: "Saat dilimlerini ara", none: "Gösterilecek şehir yok." } });
Object.assign(zoneNames, { tr: { "Asia/Seoul": "Seul", "Asia/Tokyo": "Tokyo", "Asia/Shanghai": "Şanghay", "Asia/Singapore": "Singapur", "Europe/London": "Londra", "Europe/Paris": "Paris", "America/New_York": "New York", "America/Los_Angeles": "Los Angeles", "Australia/Sydney": "Sidney", "Pacific/Auckland": "Auckland" } });
Object.assign(labels, { pl: { title: "Zegar światowy", add: "Dodaj miasto", remove: "Usuń", search: "Wyszukaj strefy czasowe", none: "Brak miast do wyświetlenia." } });
Object.assign(zoneNames, { pl: { "Asia/Seoul": "Seul", "Asia/Tokyo": "Tokio", "Asia/Shanghai": "Szanghaj", "Asia/Singapore": "Singapur", "Europe/London": "Londyn", "Europe/Paris": "Paryż", "America/New_York": "Nowy Jork", "America/Los_Angeles": "Los Angeles", "Australia/Sydney": "Sydney", "Pacific/Auckland": "Auckland" } });
Object.assign(zoneNames, {
  fil: { "Asia/Seoul": "Seoul", "Asia/Tokyo": "Tokyo", "Asia/Shanghai": "Shanghai", "Asia/Singapore": "Singapore", "Europe/London": "London", "Europe/Paris": "Paris", "America/New_York": "New York", "America/Los_Angeles": "Los Angeles", "Australia/Sydney": "Sydney", "Pacific/Auckland": "Auckland" },
  bn: { "Asia/Seoul": "সিউল", "Asia/Tokyo": "টোকিও", "Asia/Shanghai": "সাংহাই", "Asia/Singapore": "সিঙ্গাপুর", "Europe/London": "লন্ডন", "Europe/Paris": "প্যারিস", "America/New_York": "নিউ ইয়র্ক", "America/Los_Angeles": "লস অ্যাঞ্জেলেস", "Australia/Sydney": "সিডনি", "Pacific/Auckland": "অকল্যান্ড" },
  uk: { "Asia/Seoul": "Сеул", "Asia/Tokyo": "Токіо", "Asia/Shanghai": "Шанхай", "Asia/Singapore": "Сінгапур", "Europe/London": "Лондон", "Europe/Paris": "Париж", "America/New_York": "Нью-Йорк", "America/Los_Angeles": "Лос-Анджелес", "Australia/Sydney": "Сідней", "Pacific/Auckland": "Окленд" },
  ms: { "Asia/Seoul": "Seoul", "Asia/Tokyo": "Tokyo", "Asia/Shanghai": "Shanghai", "Asia/Singapore": "Singapura", "Europe/London": "London", "Europe/Paris": "Paris", "America/New_York": "New York", "America/Los_Angeles": "Los Angeles", "Australia/Sydney": "Sydney", "Pacific/Auckland": "Auckland" },
  sv: { "Asia/Seoul": "Seoul", "Asia/Tokyo": "Tokyo", "Asia/Shanghai": "Shanghai", "Asia/Singapore": "Singapore", "Europe/London": "London", "Europe/Paris": "Paris", "America/New_York": "New York", "America/Los_Angeles": "Los Angeles", "Australia/Sydney": "Sydney", "Pacific/Auckland": "Auckland" },
  cs: { "Asia/Seoul": "Soul", "Asia/Tokyo": "Tokio", "Asia/Shanghai": "Šanghaj", "Asia/Singapore": "Singapur", "Europe/London": "Londýn", "Europe/Paris": "Paříž", "America/New_York": "New York", "America/Los_Angeles": "Los Angeles", "Australia/Sydney": "Sydney", "Pacific/Auckland": "Auckland" },
  ro: { "Asia/Seoul": "Seul", "Asia/Tokyo": "Tokyo", "Asia/Shanghai": "Shanghai", "Asia/Singapore": "Singapore", "Europe/London": "Londra", "Europe/Paris": "Paris", "America/New_York": "New York", "America/Los_Angeles": "Los Angeles", "Australia/Sydney": "Sydney", "Pacific/Auckland": "Auckland" },
  el: { "Asia/Seoul": "Σεούλ", "Asia/Tokyo": "Τόκιο", "Asia/Shanghai": "Σαγκάη", "Asia/Singapore": "Σιγκαπούρη", "Europe/London": "Λονδίνο", "Europe/Paris": "Παρίσι", "America/New_York": "Νέα Υόρκη", "America/Los_Angeles": "Λος Άντζελες", "Australia/Sydney": "Σίδνεϊ", "Pacific/Auckland": "Όκλαντ" },
});

export function WorldClockWorkspace({ locale }: { locale:PublishedTargetLocale }) {
  const t = labels[locale];
  const zones = useMemo(() => {
    try { return typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : fallbackZones; } catch { return fallbackZones; }
  }, []);
  const [cities, setCities] = useState(defaultZones);
  const [selected, setSelected] = useState("Asia/Seoul");
  const [query, setQuery] = useState("");
  const [now, setNow] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const id = window.setTimeout(() => { try { const saved = JSON.parse(localStorage.getItem("woori-world-clock-zones") || "null"); if (Array.isArray(saved)) setCities(saved.filter((zone) => zones.includes(zone)).slice(0, 20)); } catch { /* Keep defaults if saved data is invalid. */ } setLoaded(true); }, 0); return () => window.clearTimeout(id); }, [zones]);
  useEffect(() => { if (loaded) localStorage.setItem("woori-world-clock-zones", JSON.stringify(cities)); }, [cities, loaded]);
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(id); }, []);
  const filtered = zones.filter((zone) => zone.toLowerCase().includes(query.toLowerCase())).slice(0, 80);
  function add() { if (cities.length < 20 && !cities.includes(selected)) setCities((old) => [...old, selected]); }
  function cityName(zone: string) { return zoneNames[locale][zone] || zone.replaceAll("_", " ").split("/").at(-1)?.replaceAll("_", " ") || zone; }
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-xl font-semibold">{t.title}</h2><div className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(220px,1fr)_auto]"><label className="sr-only" htmlFor="zone-search">{t.search}</label><input id="zone-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} className="min-h-11 rounded-xl border px-3"/><label className="sr-only" htmlFor="zone-select">{t.search}</label><select id="zone-select" value={selected} onChange={(event) => setSelected(event.target.value)} className="min-h-11 rounded-xl border bg-white px-3">{filtered.map((zone) => <option key={zone} value={zone}>{cityName(zone)} · {zone}</option>)}</select><button type="button" onClick={add} disabled={cities.length >= 20 || cities.includes(selected)} className="min-h-11 rounded-xl bg-indigo-600 px-4 font-semibold text-white disabled:opacity-50">{t.add}</button></div>{cities.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{cities.map((zone) => <article key={zone} className="rounded-xl bg-slate-50 p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-medium">{cityName(zone)}</h3><p className="text-xs text-slate-500">{zone}</p></div><button type="button" onClick={() => setCities((old) => old.filter((item) => item !== zone))} aria-label={`${t.remove}: ${cityName(zone)}`} className="rounded px-2 py-1 text-xs text-slate-600 hover:bg-white">{t.remove}</button></div><p className="mt-3 font-mono text-2xl">{now ? new Intl.DateTimeFormat(locale, { timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now) : "--:--:--"}</p><p className="text-sm text-slate-500">{now ? new Intl.DateTimeFormat(locale, { timeZone: zone, dateStyle: "medium" }).format(now) : ""}</p></article>)}</div> : <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{t.none}</p>}</section>;
}
