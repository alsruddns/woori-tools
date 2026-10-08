"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/routing";

const labels: Record<Locale, Record<string, string>> = {
  ko: { hours: "시", minutes: "분", seconds: "초", start: "시작", pause: "일시정지", resume: "계속", reset: "초기화", focus: "집중", short: "짧은 휴식", long: "긴 휴식", cycles: "긴 휴식까지 세션 수", session: "세션", presets: "빠른 설정", complete: "시간이 끝났습니다.", next: "다음 세션 시작", cyclesDone: "완료한 집중 세션", phaseFocus: "집중 시간", phaseShort: "짧은 휴식", phaseLong: "긴 휴식" },
  en: { hours: "Hours", minutes: "Minutes", seconds: "Seconds", start: "Start", pause: "Pause", resume: "Resume", reset: "Reset", focus: "Focus", short: "Short break", long: "Long break", cycles: "Focus sessions before long break", session: "Session", presets: "Quick presets", complete: "Time is up.", next: "Start next session", cyclesDone: "Completed focus sessions", phaseFocus: "Focus", phaseShort: "Short break", phaseLong: "Long break" },
  ja: { hours: "時間", minutes: "分", seconds: "秒", start: "開始", pause: "一時停止", resume: "再開", reset: "リセット", focus: "集中", short: "短い休憩", long: "長い休憩", cycles: "長い休憩までの集中回数", session: "セッション", presets: "クイック設定", complete: "時間です。", next: "次のセッションを開始", cyclesDone: "完了した集中セッション", phaseFocus: "集中時間", phaseShort: "短い休憩", phaseLong: "長い休憩" },
  zh: { hours: "小时", minutes: "分钟", seconds: "秒", start: "开始", pause: "暂停", resume: "继续", reset: "重置", focus: "专注", short: "短休息", long: "长休息", cycles: "长休息前的专注次数", session: "阶段", presets: "快捷时长", complete: "时间到。", next: "开始下一阶段", cyclesDone: "已完成专注次数", phaseFocus: "专注时间", phaseShort: "短休息", phaseLong: "长休息" },
};
const presetLabels: Record<Locale, string[]> = { ko: ["1분", "3분", "5분", "10분", "30분", "1시간"], en: ["1 min", "3 min", "5 min", "10 min", "30 min", "1 hour"], ja: ["1分", "3分", "5分", "10分", "30分", "1時間"], zh: ["1分钟", "3分钟", "5分钟", "10分钟", "30分钟", "1小时"] };

type Phase = "focus" | "short" | "long";
type Settings = { focus: number; short: number; long: number; cycleLength: number };

export function CountdownWorkspace({ slug, locale }: { slug: "timer" | "pomodoro-timer"; locale: Locale }) {
  const t = labels[locale];
  const [settings, setSettings] = useState<Settings>({ focus: 25, short: 5, long: 15, cycleLength: 4 });
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [phase, setPhase] = useState<Phase>("focus");
  const [sessions, setSessions] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [now, setNow] = useState(0);
  const [hours, setHours] = useState(0), [minutes, setMinutes] = useState(5), [seconds, setSeconds] = useState(0);

  useEffect(() => { const id = window.setTimeout(() => { try { const saved = JSON.parse(localStorage.getItem("woori-pomodoro-settings") || "{}"); setSettings((old) => ({ ...old, ...saved })); } catch { /* Use defaults for invalid local data. */ } setSettingsLoaded(true); }, 0); return () => window.clearTimeout(id); }, []);
  useEffect(() => { if (settingsLoaded) localStorage.setItem("woori-pomodoro-settings", JSON.stringify(settings)); }, [settings, settingsLoaded]);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setNow(Date.now());
      const next = Math.max(0, deadline - Date.now());
      setRemaining(next);
      if (next === 0) {
        setRunning(false);
        setFinished(true);
        if (slug === "pomodoro-timer") {
          if (phase === "focus") {
            const nextSessions = sessions + 1;
            setSessions(nextSessions);
            setPhase(nextSessions % Math.max(1, settings.cycleLength) === 0 ? "long" : "short");
          } else setPhase("focus");
        }
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [deadline, phase, running, sessions, settings.cycleLength, slug]);

  const format = (milliseconds: number) => {
    const total = Math.ceil(milliseconds / 1000);
    return `${String(Math.floor(total / 3600)).padStart(2, "0")}:${String(Math.floor(total / 60) % 60).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };
  const configuredDuration = slug === "timer" ? (hours * 3600 + minutes * 60 + seconds) * 1000 : (phase === "focus" ? settings.focus : phase === "short" ? settings.short : settings.long) * 60_000;
  function start(duration = remaining || configuredDuration) {
    if (duration <= 0) return;
    const startedAt = Date.now();
    setRemaining(duration);
    setNow(startedAt);
    setDeadline(startedAt + duration);
    setRunning(true);
    setFinished(false);
  }
  function updateSetting(key: keyof Settings, value: number) { setSettings((old) => ({ ...old, [key]: Math.max(1, Math.min(key === "cycleLength" ? 12 : 180, value || 1)) })); }
  const presets = [60, 180, 300, 600, 1800, 3600];
  const presetsText = presetLabels[locale];

  return <section className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-7">
    {slug === "pomodoro-timer" ? <>
      <p className="text-sm font-semibold text-indigo-700">{phase === "focus" ? t.phaseFocus : phase === "short" ? t.phaseShort : t.phaseLong} · {t.session} {sessions + (phase === "focus" ? 1 : 0)}</p>
      {!running && <div className="mx-auto mt-4 grid max-w-lg gap-3 sm:grid-cols-4"><label className="text-left text-sm">{t.focus}<input type="number" min="1" max="180" value={settings.focus} onChange={(e) => updateSetting("focus", Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2" /></label><label className="text-left text-sm">{t.short}<input type="number" min="1" max="180" value={settings.short} onChange={(e) => updateSetting("short", Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2" /></label><label className="text-left text-sm">{t.long}<input type="number" min="1" max="180" value={settings.long} onChange={(e) => updateSetting("long", Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2" /></label><label className="text-left text-sm">{t.cycles}<input type="number" min="1" max="12" value={settings.cycleLength} onChange={(e) => updateSetting("cycleLength", Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2" /></label></div>}
      <p className="mt-3 text-sm text-slate-500">{t.cyclesDone}: {sessions}</p>
    </> : <>
      {!running && <div className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-3">{[[t.hours, hours, setHours], [t.minutes, minutes, setMinutes], [t.seconds, seconds, setSeconds]].map(([label, value, setter]) => <label key={String(label)} className="text-sm">{String(label)}<input type="number" min="0" max="999" value={Number(value)} onChange={(e) => (setter as (v: number) => void)(Math.max(0, Number(e.target.value) || 0))} className="mt-1 w-full rounded-lg border p-2 text-center" /></label>)}</div>}
      {!running && <div className="mt-4"><p className="text-xs font-medium text-slate-500">{t.presets}</p><div className="mt-2 flex flex-wrap justify-center gap-2">{presets.map((value, index) => <button key={value} type="button" onClick={() => { setHours(Math.floor(value / 3600)); setMinutes(Math.floor(value % 3600 / 60)); setSeconds(value % 60); setRemaining(0); }} className="rounded-lg border px-3 py-2 text-sm">{presetsText[index]}</button>)}</div></div>}
    </>}
    <p className="mt-5 font-mono text-5xl font-bold tabular-nums sm:text-7xl">{format(running ? Math.max(0, deadline - now) : remaining)}</p>
    <div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" disabled={!running && configuredDuration <= 0 && remaining <= 0} onClick={() => running ? (setNow(Date.now()), setRemaining(Math.max(0, deadline - Date.now())), setRunning(false)) : start()} className="min-h-12 rounded-xl bg-indigo-600 px-5 font-semibold text-white disabled:opacity-50">{running ? t.pause : remaining > 0 ? t.resume : t.start}</button><button type="button" onClick={() => { setRunning(false); setRemaining(0); setFinished(false); setPhase("focus"); setSessions(0); }} className="min-h-12 rounded-xl border px-5">{t.reset}</button>{slug === "pomodoro-timer" && !running && <button type="button" onClick={() => start(configuredDuration)} className="min-h-12 rounded-xl border px-5">{t.next}</button>}</div>
    {finished && <p role="status" className="mt-4 font-medium text-amber-700">{t.complete}</p>}
  </section>;
}
