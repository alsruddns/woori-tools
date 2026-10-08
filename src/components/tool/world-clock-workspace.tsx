"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/routing";

const fallbackZones = ["Asia/Seoul", "Asia/Tokyo", "Asia/Shanghai", "Asia/Singapore", "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles", "Australia/Sydney", "Pacific/Auckland"];
const defaultZones = ["Asia/Seoul", "Asia/Tokyo", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Singapore", "Australia/Sydney"];
const labels: Record<Locale, Record<string, string>> = {
  ko: { title: "세계 시간", add: "도시 추가", remove: "삭제", search: "시간대 검색", none: "표시할 도시가 없습니다." },
  en: { title: "World clock", add: "Add city", remove: "Remove", search: "Search time zones", none: "No cities to display." },
  ja: { title: "世界時計", add: "都市を追加", remove: "削除", search: "タイムゾーンを検索", none: "表示する都市がありません。" },
  zh: { title: "世界时钟", add: "添加城市", remove: "删除", search: "搜索时区", none: "没有可显示的城市。" },
};
const zoneNames: Record<Locale, Record<string, string>> = {
  ko: { "Asia/Seoul": "서울", "Asia/Tokyo": "도쿄", "Asia/Shanghai": "상하이", "Asia/Singapore": "싱가포르", "Europe/London": "런던", "Europe/Paris": "파리", "America/New_York": "뉴욕", "America/Los_Angeles": "로스앤젤레스", "Australia/Sydney": "시드니", "Pacific/Auckland": "오클랜드" },
  en: { "Asia/Seoul": "Seoul", "Asia/Tokyo": "Tokyo", "Asia/Shanghai": "Shanghai", "Asia/Singapore": "Singapore", "Europe/London": "London", "Europe/Paris": "Paris", "America/New_York": "New York", "America/Los_Angeles": "Los Angeles", "Australia/Sydney": "Sydney", "Pacific/Auckland": "Auckland" },
  ja: { "Asia/Seoul": "ソウル", "Asia/Tokyo": "東京", "Asia/Shanghai": "上海", "Asia/Singapore": "シンガポール", "Europe/London": "ロンドン", "Europe/Paris": "パリ", "America/New_York": "ニューヨーク", "America/Los_Angeles": "ロサンゼルス", "Australia/Sydney": "シドニー", "Pacific/Auckland": "オークランド" },
  zh: { "Asia/Seoul": "首尔", "Asia/Tokyo": "东京", "Asia/Shanghai": "上海", "Asia/Singapore": "新加坡", "Europe/London": "伦敦", "Europe/Paris": "巴黎", "America/New_York": "纽约", "America/Los_Angeles": "洛杉矶", "Australia/Sydney": "悉尼", "Pacific/Auckland": "奥克兰" },
};

export function WorldClockWorkspace({ locale }: { locale: Locale }) {
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
