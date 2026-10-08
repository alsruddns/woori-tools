"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { randomInt, secureShuffle, pickUnique, pickUniqueRange } from "@/lib/random";
import { generateLottoGames } from "@/lib/lotto.mjs";
import { divideEvenly, normalizeWheelItems, rollDice } from "@/lib/random-tools.mjs";
import { copyText as copyToClipboard } from "@/lib/copy-to-clipboard";

const copy = {
  ko: { generate: "번호 생성", again: "다시 생성", copy: "복사", copyAll: "전체 복사", reset: "조건 초기화", games: "게임 수", one: "1게임", five: "5게임", include: "포함 번호", exclude: "제외 번호", selection: "번호 선택", included: "포함", excluded: "제외", clear: "선택 지우기", oddEven: "홀짝 비율", auto: "자동", odd: "홀수", even: "짝수", sorted: "오름차순 정렬", unique: "중복 없이", history: "최근 생성 기록", clearHistory: "기록 전체 삭제", reuse: "다시 사용", count: "개", draw: "굴리기", die: "면 주사위", diceCount: "주사위 개수", total: "합계", minimum: "최소값", maximum: "최대값", average: "평균값", explanation: "D는 Dice(주사위)를 뜻하고, 뒤 숫자는 면의 수입니다. D6은 6면, D20은 20면 주사위입니다.", participants: "참가자 (한 줄에 한 명)", participantCount: "명 참가", drawCount: "추첨 인원", repeats: "중복 당첨 허용", removeWinner: "당첨자는 목록에서 제거", shuffle: "목록 섞기", teams: "팀 설정", teamCount: "팀 수", teamSize: "팀당 인원", byTeams: "팀 수 기준", bySize: "인원 기준", teamNames: "팀 이름 (선택, 한 줄에 하나)", result: "결과", participantsRequired: "참가자를 한 명 이상 입력하세요.", invalidCount: "추첨 인원을 확인하세요.", includeMax: "포함 번호는 최대 6개까지 선택할 수 있습니다.", selectMode: "선택 모드", copyFailed: "복사하지 못했습니다." },
  en: { generate: "Generate numbers", again: "Generate again", copy: "Copy", copyAll: "Copy all", reset: "Reset conditions", games: "Games", one: "1 game", five: "5 games", include: "Include numbers", exclude: "Exclude numbers", selection: "Choose numbers", included: "Include", excluded: "Exclude", clear: "Clear selections", oddEven: "Odd/even ratio", auto: "Automatic", odd: "Odd", even: "Even", sorted: "Sort ascending", unique: "No repeats", history: "Recent generations", clearHistory: "Clear history", reuse: "Reuse", count: "items", draw: "Roll dice", die: "-sided die", diceCount: "Number of dice", total: "Total", minimum: "Minimum", maximum: "Maximum", average: "Average", explanation: "D means die; the number after D is its number of sides. D6 is a six-sided die and D20 is a twenty-sided die.", participants: "Participants (one per line)", participantCount: "participants", drawCount: "Winners", repeats: "Allow repeat winners", removeWinner: "Remove winners from the list", shuffle: "Shuffle list", teams: "Team settings", teamCount: "Number of teams", teamSize: "People per team", byTeams: "By team count", bySize: "By team size", teamNames: "Team names (optional, one per line)", result: "Result", participantsRequired: "Enter at least one participant.", invalidCount: "Check the number of winners.", includeMax: "Choose up to six included numbers.", selectMode: "Selection mode", copyFailed: "Could not copy." },
  ja: { generate: "番号を生成", again: "もう一度生成", copy: "コピー", copyAll: "すべてコピー", reset: "条件をリセット", games: "口数", one: "1口", five: "5口", include: "含める数字", exclude: "除外する数字", selection: "数字を選択", included: "含める", excluded: "除外", clear: "選択をクリア", oddEven: "奇数・偶数の比率", auto: "自動", odd: "奇数", even: "偶数", sorted: "昇順に並べる", unique: "重複なし", history: "最近の生成履歴", clearHistory: "履歴を削除", reuse: "再利用", count: "件", draw: "サイコロを振る", die: "面ダイス", diceCount: "サイコロの数", total: "合計", minimum: "最小値", maximum: "最大値", average: "平均値", explanation: "DはDice（サイコロ）を表し、後ろの数字は面の数です。D6は6面、D20は20面のサイコロです。", participants: "参加者（1行に1人）", participantCount: "人", drawCount: "当選人数", repeats: "重複当選を許可", removeWinner: "当選者をリストから削除", shuffle: "リストをシャッフル", teams: "チーム設定", teamCount: "チーム数", teamSize: "1チームの人数", byTeams: "チーム数で指定", bySize: "人数で指定", teamNames: "チーム名（任意、1行に1つ）", result: "結果", participantsRequired: "参加者を1人以上入力してください。", invalidCount: "当選人数を確認してください。", includeMax: "含める数字は最大6個までです。", selectMode: "選択方法", copyFailed: "コピーできませんでした。" },
  zh: { generate: "生成号码", again: "重新生成", copy: "复制", copyAll: "复制全部", reset: "重置条件", games: "注数", one: "1注", five: "5注", include: "包含号码", exclude: "排除号码", selection: "选择号码", included: "包含", excluded: "排除", clear: "清除选择", oddEven: "奇偶比例", auto: "自动", odd: "奇数", even: "偶数", sorted: "升序排列", unique: "不重复", history: "最近生成记录", clearHistory: "清空记录", reuse: "再次使用", count: "项", draw: "掷骰子", die: "面骰子", diceCount: "骰子数量", total: "合计", minimum: "最小值", maximum: "最大值", average: "平均值", explanation: "D代表Dice（骰子），后面的数字表示面数。D6是六面骰子，D20是二十面骰子。", participants: "参与者（每行一人）", participantCount: "人", drawCount: "中奖人数", repeats: "允许重复中奖", removeWinner: "从名单中移除中奖者", shuffle: "打乱名单", teams: "分组设置", teamCount: "队伍数量", teamSize: "每队人数", byTeams: "按队伍数量", bySize: "按每队人数", teamNames: "队伍名称（可选，每行一个）", result: "结果", participantsRequired: "请至少输入一名参与者。", invalidCount: "请检查中奖人数。", includeMax: "最多选择六个包含号码。", selectMode: "选择模式", copyFailed: "复制失败。" },
} as const;

type LottoHistory = { createdAt: string; games: number[][]; settings: { count: 1 | 5; included: number[]; excluded: number[]; oddCount: number | null; sorted: boolean } };

export function LottoWorkspace({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [mode, setMode] = useState<"include" | "exclude">("include");
  const [included, setIncluded] = useState<number[]>([]);
  const [excluded, setExcluded] = useState<number[]>([]);
  const [count, setCount] = useState<1 | 5>(1);
  const [oddCount, setOddCount] = useState<number | null>(null);
  const [sorted, setSorted] = useState(true);
  const [games, setGames] = useState<number[][]>([]);
  const [history, setHistory] = useState<LottoHistory[]>([]);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { const id = window.setTimeout(() => { try { setHistory(JSON.parse(localStorage.getItem("woori-lotto-history") || "[]").slice(0, 20)); } catch { setHistory([]); } setHydrated(true); }, 0); return () => window.clearTimeout(id); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem("woori-lotto-history", JSON.stringify(history.slice(0, 20))); }, [history, hydrated]);

  function generate() {
    try {
      const settings = { count, included, excluded, oddCount, sorted };
      const next = generateLottoGames(settings);
      setGames(next);
      setHistory((old) => [{ createdAt: new Date().toISOString(), games: next, settings }, ...old].slice(0, 20));
      setError("");
    } catch (cause) { setError(localizeLottoError(cause instanceof Error ? cause.message : "", locale)); }
  }
  function toggleNumber(number: number) {
    if (mode === "include") {
      if (included.includes(number)) setIncluded((old) => old.filter((item) => item !== number));
      else if (included.length < 6) setIncluded((old) => [...old, number].sort((a, b) => a - b));
      else setError(t.includeMax);
    } else {
      setExcluded((old) => old.includes(number) ? old.filter((item) => item !== number) : [...old, number].sort((a, b) => a - b));
    }
  }
  async function copyText(value: string) { await copyToClipboard(value); }
  const gameText = (value: number[][]) => value.map((game, index) => `${index + 1}: ${game.join(", ")}`).join("\n");
  const selected = mode === "include" ? included : excluded;

  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
      <fieldset><legend className="text-sm font-semibold">{t.selection}</legend>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t.selectMode}>
          <button type="button" onClick={() => setMode("include")} aria-pressed={mode === "include"} className={`rounded-lg border px-3 py-2 text-sm ${mode === "include" ? "border-indigo-600 bg-indigo-50 text-indigo-800" : "border-slate-300"}`}>{t.include}</button>
          <button type="button" onClick={() => setMode("exclude")} aria-pressed={mode === "exclude"} className={`rounded-lg border px-3 py-2 text-sm ${mode === "exclude" ? "border-rose-500 bg-rose-50 text-rose-800" : "border-slate-300"}`}>{t.exclude}</button>
        </div>
        <p className="mt-3 text-sm text-slate-600">{mode === "include" ? t.include : t.exclude}: {selected.length ? selected.map((number) => <button key={number} type="button" onClick={() => toggleNumber(number)} className="ml-1 rounded-full bg-slate-100 px-2.5 py-1 font-semibold">{number} ×</button>) : "—"}</p>
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-9">{Array.from({ length: 45 }, (_, index) => index + 1).map((number) => {
          const includedValue = included.includes(number), excludedValue = excluded.includes(number), active = mode === "include" ? includedValue : excludedValue;
          return <button key={number} type="button" aria-pressed={active} disabled={mode === "include" ? excludedValue : includedValue} onClick={() => toggleNumber(number)} className={`aspect-square min-h-10 rounded-full border text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-30 ${active ? mode === "include" ? "border-indigo-700 bg-indigo-600 text-white" : "border-rose-700 bg-rose-600 text-white" : "border-slate-200 bg-white hover:border-indigo-400"}`}>{number}</button>;
        })}</div>
        <div className="mt-3 flex flex-wrap gap-4"><button type="button" onClick={() => { setIncluded([]); setExcluded([]); setError(""); }} className="text-sm text-slate-600 underline">{t.clear}</button><button type="button" onClick={() => { setIncluded([]); setExcluded([]); setCount(1); setOddCount(null); setSorted(true); setMode("include"); setGames([]); setError(""); }} className="text-sm text-slate-600 underline">{t.reset}</button></div>
      </fieldset>
      <div className="space-y-5">
        <fieldset><legend className="text-sm font-semibold">{t.games}</legend><div className="mt-2 grid grid-cols-2 gap-2">{([1, 5] as const).map((value) => <button key={value} type="button" aria-pressed={count === value} onClick={() => setCount(value)} className={`rounded-xl border p-3 font-semibold ${count === value ? "border-indigo-600 bg-indigo-50 text-indigo-800" : "border-slate-300"}`}>{value === 1 ? t.one : t.five}</button>)}</div></fieldset>
        <label className="block text-sm font-semibold">{t.oddEven}<select value={oddCount === null ? "auto" : oddCount} onChange={(event) => setOddCount(event.target.value === "auto" ? null : Number(event.target.value))} className="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-3"><option value="auto">{t.auto}</option>{Array.from({ length: 7 }, (_, odd) => <option key={odd} value={odd}>{t.odd} {odd} · {t.even} {6 - odd}</option>)}</select></label>
        <label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={sorted} onChange={(event) => setSorted(event.target.checked)} />{t.sorted}</label>
        <button type="button" onClick={generate} className="min-h-12 w-full rounded-xl bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-700">{games.length ? t.again : t.generate}</button>
      </div>
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
    {games.length > 0 && <section className="mt-6 rounded-2xl bg-slate-50 p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">{t.result}</h3><button type="button" onClick={() => void copyText(gameText(games))} className="rounded-lg border bg-white px-3 py-2 text-sm">{t.copyAll}</button></div><div className="mt-4 grid gap-3">{games.map((game, index) => <article key={`${history[0]?.createdAt}-${index}`} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white p-3"><div><h4 className="mb-2 text-sm font-semibold">{index + 1}{locale === "ko" ? "게임" : locale === "ja" ? "口" : locale === "zh" ? "注" : " game"}</h4><div className="flex flex-wrap gap-2">{game.map((number) => <span key={number} className="grid size-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-900">{number}</span>)}</div></div><button type="button" onClick={() => void copyText(game.join(", "))} className="rounded-lg border px-3 py-2 text-sm">{t.copy}</button></article>)}</div></section>}
    <section className="mt-7 border-t border-slate-200 pt-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">{t.history}</h3>{history.length > 0 && <button type="button" onClick={() => setHistory([])} className="text-sm text-rose-700 underline">{t.clearHistory}</button>}</div>{history.length === 0 ? <p className="mt-2 text-sm text-slate-500">—</p> : <ul className="mt-3 space-y-2">{history.map((entry, index) => <li key={`${entry.createdAt}-${index}`} className="rounded-xl border p-3"><div className="flex flex-wrap items-center justify-between gap-2"><time className="text-xs text-slate-500">{new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(new Date(entry.createdAt))}</time><div className="flex gap-2"><button type="button" onClick={() => void copyText(gameText(entry.games))} className="text-sm text-indigo-700 underline">{t.copy}</button><button type="button" onClick={() => { setGames(entry.games); setCount(entry.settings.count); setIncluded(entry.settings.included); setExcluded(entry.settings.excluded); setOddCount(entry.settings.oddCount); setSorted(entry.settings.sorted); }} className="text-sm text-indigo-700 underline">{t.reuse}</button></div></div><p className="mt-1 text-sm">{gameText(entry.games)}</p></li>)}</ul>}</section>
  </section>;
}

export function DiceWorkspace({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(1);
  const [rolls, setRolls] = useState<number[]>([]);
  const [recent, setRecent] = useState<{ sides: number; values: number[] }[]>([]);
  const [error, setError] = useState("");
  function roll() { try { const result = rollDice(sides, count); setRolls(result); setRecent((old) => [{ sides, values: result }, ...old].slice(0, 10)); setError(""); } catch { setError(t.invalidCount); } }
  const stats = rolls.length ? { total: rolls.reduce((sum, value) => sum + value, 0), min: Math.min(...rolls), max: Math.max(...rolls), average: rolls.reduce((sum, value) => sum + value, 0) / rolls.length } : null;
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <p className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900">{t.explanation}</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">{t.selection}<select value={sides} onChange={(event) => setSides(Number(event.target.value))} className="mt-2 block w-full rounded-xl border p-3">{[4, 6, 8, 10, 12, 20].map((value) => <option key={value} value={value}>D{value} · {value}{t.die}</option>)}</select></label><label className="text-sm font-semibold">{t.diceCount}<input type="number" min="1" max="20" value={count} onChange={(event) => setCount(Number(event.target.value))} className="mt-2 block w-full rounded-xl border p-3" /></label></div>
    <button type="button" onClick={roll} className="mt-5 min-h-12 w-full rounded-xl bg-indigo-600 px-5 font-semibold text-white sm:w-auto">{t.draw}</button>
    {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
    {rolls.length > 0 && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><div className="flex flex-wrap gap-3">{rolls.map((value, index) => <span key={`${index}-${value}`} className="grid size-14 place-items-center rounded-full border-2 border-indigo-200 bg-white text-xl font-bold">{value}</span>)}</div><dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[[t.total, stats!.total], [t.minimum, stats!.min], [t.maximum, stats!.max], [t.average, stats!.average.toFixed(2)]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-white p-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>)}</dl></div>}
    {recent.length > 0 && <section className="mt-6 border-t pt-4"><h3 className="font-semibold">{t.history}</h3><ul className="mt-2 space-y-1 text-sm text-slate-600">{recent.map(({ sides: rolledSides, values }, index) => <li key={index}>D{rolledSides}: {values.join(", ")} · {t.total}: {values.reduce((sum, value) => sum + value, 0)}</li>)}</ul></section>}
  </section>;
}

export function RandomNumberWorkspace({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [min, setMin] = useState(1), [max, setMax] = useState(45), [count, setCount] = useState(1), [unique, setUnique] = useState(true), [sorted, setSorted] = useState(true);
  const [result, setResult] = useState<number[]>([]), [error, setError] = useState("");
  function draw() {
    if (![min, max, count].every(Number.isSafeInteger) || min > max || count < 1 || count > 100 || (unique && count > max - min + 1)) { setError(t.invalidCount); return; }
    if (max - min + 1 > 0x1_0000_0000) { setError(t.invalidCount); return; }
    const values = unique ? pickUniqueRange(min, max, count) : Array.from({ length: count }, () => randomInt(min, max));
    setResult(sorted ? [...values].sort((a, b) => a - b) : values); setError("");
  }
  async function copyResult() { await copyToClipboard(result.join(", ")); }
  return <section className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7"><div className="grid gap-4 sm:grid-cols-3">{[[t.minimum, min, setMin], [t.maximum, max, setMax], [t.drawCount, count, setCount]].map(([label, value, setter]) => <label key={String(label)} className="text-sm font-medium">{String(label)}<input type="number" min={label === t.drawCount ? 1 : undefined} max={label === t.drawCount ? 100 : undefined} value={Number(value)} onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))} className="mt-2 block w-full rounded-xl border p-3" /></label>)}</div><div className="mt-4 flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={unique} onChange={(event) => setUnique(event.target.checked)} />{t.unique}</label><label className="flex items-center gap-2"><input type="checkbox" checked={sorted} onChange={(event) => setSorted(event.target.checked)} />{t.sorted}</label></div><button type="button" onClick={draw} className="mt-5 min-h-12 rounded-xl bg-indigo-600 px-5 font-semibold text-white">{result.length ? t.again : t.generate}</button><button type="button" onClick={() => { setMin(1); setMax(45); setCount(1); setResult([]); setError(""); }} className="ml-2 min-h-12 rounded-xl border px-5">{t.reset}</button>{error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}{result.length > 0 && <section className="mt-5 rounded-2xl bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">{t.result}</h3><button type="button" onClick={() => void copyResult()} className="rounded-lg border bg-white px-3 py-2 text-sm">{t.copy}</button></div><div className="mt-3 flex flex-wrap gap-2">{result.map((number, index) => <span key={`${number}-${index}`} className="grid min-h-12 min-w-12 place-items-center rounded-xl bg-indigo-100 px-3 font-bold text-indigo-900">{number}</span>)}</div></section>}</section>;
}

export function RandomNameWorkspace({ locale, slug: _slug }: { locale: Locale; slug: "random-name-picker" | "draw-lots" }) {
  void _slug;
  const t = copy[locale];
  const [text, setText] = useState(""), [count, setCount] = useState(1), [repeats, setRepeats] = useState(false), [removeWinner, setRemoveWinner] = useState(false), [result, setResult] = useState<string[]>([]), [error, setError] = useState("");
  const names = useMemo(() => text.split(/\r?\n/).map((name) => name.trim()).filter(Boolean), [text]);
  function draw() { if (!names.length) { setError(t.participantsRequired); return; } if (!Number.isInteger(count) || count < 1 || count > (repeats ? 100 : names.length)) { setError(t.invalidCount); return; } const winners = repeats ? Array.from({ length: count }, () => names[randomInt(0, names.length - 1)]) : pickUnique(names, count); setResult(winners); if (removeWinner) setText((old) => { const remaining = [...old.split(/\r?\n/).map((name) => name.trim())]; for (const winner of winners) { const index = remaining.indexOf(winner); if (index >= 0) remaining.splice(index, 1); } return remaining.filter(Boolean).join("\n"); }); setError(""); }
  return <section className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7"><div className="grid gap-5 lg:grid-cols-2"><div><label htmlFor="participant-list" className="text-sm font-semibold">{t.participants}</label><textarea id="participant-list" rows={10} value={text} onChange={(event) => setText(event.target.value)} className="mt-2 w-full rounded-xl border p-3"/><p className="mt-1 text-sm text-slate-500">{names.length} {t.participantCount}</p><button type="button" onClick={() => setText(secureShuffle(names).join("\n"))} disabled={!names.length} className="mt-2 rounded-lg border px-3 py-2 text-sm disabled:opacity-50">{t.shuffle}</button></div><div><label className="text-sm font-semibold">{t.drawCount}<input type="number" min="1" max={repeats ? 100 : names.length} value={count} onChange={(event) => setCount(Number(event.target.value))} className="mt-2 block w-full rounded-xl border p-3"/></label><div className="mt-4 space-y-3 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={repeats} onChange={(event) => setRepeats(event.target.checked)} />{t.repeats}</label><label className="flex items-center gap-2"><input type="checkbox" checked={removeWinner} onChange={(event) => setRemoveWinner(event.target.checked)} />{t.removeWinner}</label></div><button type="button" onClick={draw} className="mt-5 min-h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white">{t.draw}</button></div></div>{error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}{result.length > 0 && <section className="mt-5 rounded-2xl bg-emerald-50 p-4"><div className="flex items-center justify-between"><h3 className="font-semibold">{t.result}</h3><button type="button" onClick={() => void copyToClipboard(result.join("\n"))} className="rounded-lg border bg-white px-3 py-2 text-sm">{t.copy}</button></div><ol className="mt-3 space-y-2">{result.map((name, index) => <li key={`${name}-${index}`} className="rounded-lg bg-white p-3 font-semibold">{name}</li>)}</ol></section>}</section>;
}

export function RandomTeamWorkspace({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [text, setText] = useState(""), [mode, setMode] = useState<"teams" | "size">("teams"), [amount, setAmount] = useState(2), [teamNamesText, setTeamNamesText] = useState(""), [teams, setTeams] = useState<string[][]>([]), [error, setError] = useState("");
  const people = useMemo(() => text.split(/\r?\n/).map((name) => name.trim()).filter(Boolean), [text]);
  function split() { if (!people.length) { setError(t.participantsRequired); return; } const teamCount = mode === "teams" ? amount : Math.ceil(people.length / amount); try { setTeams(divideEvenly(people, teamCount)); setError(""); } catch { setError(t.invalidCount); } }
  const names = teamNamesText.split(/\r?\n/).map((name) => name.trim()).filter(Boolean);
  const renderedNames = teams.map((_, index) => names[index] || `${locale === "ko" ? "팀" : "Team"} ${String.fromCharCode(65 + index)}`);
  return <section className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7"><div className="grid gap-5 lg:grid-cols-2"><div><label htmlFor="team-participants" className="text-sm font-semibold">{t.participants}</label><textarea id="team-participants" rows={10} value={text} onChange={(event) => setText(event.target.value)} className="mt-2 w-full rounded-xl border p-3"/><p className="mt-1 text-sm text-slate-500">{people.length} {t.participantCount}</p><button type="button" onClick={() => setText(secureShuffle(people).join("\n"))} disabled={!people.length} className="mt-2 rounded-lg border px-3 py-2 text-sm disabled:opacity-50">{t.shuffle}</button></div><div><fieldset><legend className="text-sm font-semibold">{t.teams}</legend><div className="mt-2 grid grid-cols-2 gap-2"><button type="button" onClick={() => setMode("teams")} aria-pressed={mode === "teams"} className={`rounded-lg border p-2 text-sm ${mode === "teams" ? "border-indigo-600 bg-indigo-50" : ""}`}>{t.byTeams}</button><button type="button" onClick={() => setMode("size")} aria-pressed={mode === "size"} className={`rounded-lg border p-2 text-sm ${mode === "size" ? "border-indigo-600 bg-indigo-50" : ""}`}>{t.bySize}</button></div></fieldset><label className="mt-4 block text-sm font-semibold">{mode === "teams" ? t.teamCount : t.teamSize}<input type="number" min="1" max={people.length || 1} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-2 block w-full rounded-xl border p-3"/></label><label className="mt-4 block text-sm">{t.teamNames}<textarea rows={3} value={teamNamesText} onChange={(event) => setTeamNamesText(event.target.value)} className="mt-2 block w-full rounded-xl border p-3"/></label><button type="button" onClick={split} className="mt-4 min-h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white">{teams.length ? t.again : t.generate}</button></div></div>{error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}{teams.length > 0 && <section className="mt-5"><div className="flex items-center justify-between"><h3 className="font-semibold">{t.result}</h3><button type="button" onClick={() => void copyToClipboard(teams.map((team, index) => `${renderedNames[index]}\n${team.join("\n")}`).join("\n\n"))} className="rounded-lg border px-3 py-2 text-sm">{t.copyAll}</button></div><div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{teams.map((team, index) => <article key={index} className="rounded-xl border bg-slate-50 p-4"><h4 className="font-semibold">{renderedNames[index]}</h4><ul className="mt-2 space-y-1 text-sm">{team.map((person) => <li key={person}>{person}</li>)}</ul></article>)}</div></section>}</section>;
}

export function RandomOrderWorkspace({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [text, setText] = useState("");
  const [order, setOrder] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(1);
  const people = useMemo(() => text.split(/\r?\n/).map((name) => name.trim()).filter(Boolean), [text]);
  const labels = { ko: { label: "참가자 (한 줄에 한 명)", count: "참가자", reveal: "다음 순서 공개", all: "전체 공개", numbers: "번호 표시", copy: "전체 복사" }, en: { label: "Participants (one per line)", count: "participants", reveal: "Reveal next", all: "Reveal all", numbers: "Show numbers", copy: "Copy all" }, ja: { label: "参加者（1行に1人）", count: "人", reveal: "次を公開", all: "すべて公開", numbers: "番号を表示", copy: "すべてコピー" }, zh: { label: "参与者（每行一人）", count: "人", reveal: "公开下一位", all: "全部公开", numbers: "显示序号", copy: "复制全部" } }[locale];
  const [showNumbers, setShowNumbers] = useState(true);
  function shuffle() { if (people.length) { setOrder(secureShuffle(people)); setRevealed(1); } }
  return <section className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7"><div className="grid gap-5 lg:grid-cols-2"><div><label htmlFor="order-people" className="text-sm font-semibold">{labels.label}</label><textarea id="order-people" rows={9} value={text} onChange={(e) => setText(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/><p className="mt-1 text-sm text-slate-500">{people.length} {labels.count}</p><button type="button" onClick={() => setText(secureShuffle(people).join("\n"))} className="mt-2 rounded-lg border px-3 py-2 text-sm">{t.shuffle}</button></div><div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showNumbers} onChange={(e) => setShowNumbers(e.target.checked)}/>{labels.numbers}</label><button type="button" onClick={shuffle} disabled={!people.length} className="mt-4 min-h-12 w-full rounded-xl bg-indigo-600 font-semibold text-white disabled:opacity-50">{order.length ? t.again : t.generate}</button>{order.length > 0 && <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => setRevealed((value) => Math.min(order.length, value + 1))} disabled={revealed >= order.length} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">{labels.reveal}</button><button type="button" onClick={() => setRevealed(order.length)} className="rounded-lg border px-3 py-2 text-sm">{labels.all}</button><button type="button" onClick={() => void copyToClipboard(order.map((name, index) => `${showNumbers ? `${index + 1}. ` : ""}${name}`).join("\n"))} className="rounded-lg border px-3 py-2 text-sm">{labels.copy}</button></div>}</div></div>{order.length > 0 && <ol className="mt-5 grid gap-2 sm:grid-cols-2">{order.map((name, index) => <li key={`${index}-${name}`} className={`rounded-xl border p-3 font-medium ${index >= revealed ? "text-slate-400" : "bg-slate-50"}`}>{index >= revealed ? "•••" : `${showNumbers ? `${index + 1}. ` : ""}${name}`}</li>)}</ol>}</section>;
}

export function RandomSeatWorkspace({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [text, setText] = useState("");
  const [rows, setRows] = useState(5), [columns, setColumns] = useState(6);
  const [seats, setSeats] = useState<string[]>([]);
  const people = useMemo(() => text.split(/\r?\n/).map((name) => name.trim()).filter(Boolean), [text]);
  const labels = { ko: { people: "참가자 (한 줄에 한 명)", rows: "행", columns: "열", arrange: "좌석 배치", empty: "빈자리" }, en: { people: "Participants (one per line)", rows: "Rows", columns: "Columns", arrange: "Assign seats", empty: "Empty" }, ja: { people: "参加者（1行に1人）", rows: "行", columns: "列", arrange: "座席を割り当て", empty: "空席" }, zh: { people: "参与者（每行一人）", rows: "行数", columns: "列数", arrange: "随机排座", empty: "空位" } }[locale];
  const capacity = Math.min(200, Math.max(1, rows * columns));
  function arrange() { if (people.length && people.length <= capacity) setSeats(secureShuffle(people)); }
  return <section className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7"><div className="grid gap-5 lg:grid-cols-2"><div><label htmlFor="seat-people" className="text-sm font-semibold">{labels.people}</label><textarea id="seat-people" rows={8} value={text} onChange={(e) => setText(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/><p className="mt-1 text-sm text-slate-500">{people.length} {t.participantCount}</p></div><div className="grid content-start grid-cols-2 gap-3"><label className="text-sm">{labels.rows}<input type="number" min="1" max="20" value={rows} onChange={(e) => setRows(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} className="mt-1 w-full rounded-lg border p-3"/></label><label className="text-sm">{labels.columns}<input type="number" min="1" max="20" value={columns} onChange={(e) => setColumns(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} className="mt-1 w-full rounded-lg border p-3"/></label><p className="col-span-2 text-sm text-slate-500">{people.length} / {capacity}</p><button type="button" onClick={arrange} disabled={!people.length || people.length > capacity} className="col-span-2 min-h-12 rounded-xl bg-indigo-600 font-semibold text-white disabled:opacity-50">{seats.length ? t.again : labels.arrange}</button>{people.length > capacity && <p role="alert" className="col-span-2 text-sm text-rose-700">{locale === "ko" ? "좌석 수를 늘리거나 참가자를 줄이세요." : locale === "ja" ? "座席を増やすか、参加者を減らしてください。" : locale === "zh" ? "请增加座位或减少参与者。" : "Add seats or remove participants."}</p>}</div></div>{seats.length > 0 && <div className="mt-5 grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>{Array.from({ length: capacity }, (_, index) => <div key={index} className="grid min-h-16 place-items-center rounded-lg border bg-slate-50 p-2 text-center text-sm"><span className="text-xs text-slate-400">{Math.floor(index / columns) + 1}-{index % columns + 1}</span><span className="font-medium">{seats[index] || labels.empty}</span></div>)}</div>}</section>;
}

const wheelCopy: Record<Locale, Record<string, string>> = {
  ko: { label: "항목을 줄마다 입력", entries: "등록 항목", add: "항목 추가", delete: "삭제", clear: "전체 삭제", dedupe: "중복 제거", empty: "빈 줄 제거", shuffle: "항목 섞기", duplicates: "중복 항목 허용", removeWinner: "당첨 항목을 제거한 뒤 다시 돌리기", speed: "회전 시간", fast: "빠르게", normal: "보통", slow: "천천히", spin: "룰렛 돌리기", spinning: "돌리는 중…", winner: "선택 결과", minimum: "항목을 2개 이상 입력하세요.", maximum: "항목은 최대 50개까지 입력할 수 있습니다.", option: "예: 점심 메뉴\n피자\n국수" },
  en: { label: "Enter one choice per line", entries: "Current entries", add: "Add entry", delete: "Remove", clear: "Clear all", dedupe: "Remove duplicates", empty: "Remove blank lines", shuffle: "Shuffle entries", duplicates: "Allow duplicate entries", removeWinner: "Remove the winner before spinning again", speed: "Spin duration", fast: "Fast", normal: "Normal", slow: "Slow", spin: "Spin the wheel", spinning: "Spinning…", winner: "Selected choice", minimum: "Enter at least two choices.", maximum: "A wheel can contain up to 50 entries.", option: "Lunch\nPizza\nNoodles" },
  ja: { label: "選択肢を1行ずつ入力", entries: "登録した項目", add: "項目を追加", delete: "削除", clear: "すべて削除", dedupe: "重複を削除", empty: "空行を削除", shuffle: "項目をシャッフル", duplicates: "同じ項目を許可", removeWinner: "当選項目を削除してから再抽選", speed: "回転時間", fast: "速い", normal: "標準", slow: "ゆっくり", spin: "ルーレットを回す", spinning: "回転中…", winner: "選ばれた項目", minimum: "選択肢を2つ以上入力してください。", maximum: "項目は最大50個までです。", option: "ランチ\nピザ\n麺類" },
  zh: { label: "每行输入一个选项", entries: "已添加选项", add: "添加选项", delete: "删除", clear: "全部清除", dedupe: "删除重复项", empty: "删除空行", shuffle: "打乱选项", duplicates: "允许重复选项", removeWinner: "下次抽选前移除中奖项", speed: "旋转时长", fast: "快速", normal: "普通", slow: "慢速", spin: "旋转转盘", spinning: "旋转中…", winner: "抽中结果", minimum: "请至少输入两个选项。", maximum: "最多可添加50个选项。", option: "午餐\n披萨\n面食" },
};

export function RandomWheelWorkspace({ locale }: { locale: Locale }) {
  const t = wheelCopy[locale];
  const starter = locale === "ko" ? ["피자", "치킨", "햄버거", "초밥"] : locale === "ja" ? ["ピザ", "チキン", "ハンバーガー", "寿司"] : locale === "zh" ? ["披萨", "鸡肉", "汉堡", "寿司"] : ["Pizza", "Chicken", "Burger", "Sushi"];
  const [text, setText] = useState(starter.join("\n"));
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [duration, setDuration] = useState(5000);
  const [turn, setTurn] = useState(0);
  const [winner, setWinner] = useState("");
  const [spinning, setSpinning] = useState(false);
  const items = useMemo(() => normalizeWheelItems(text, { allowDuplicates, limit: 1000 }), [allowDuplicates, text]);
  const tooMany = items.length > 50;
  const segment = items.length ? 360 / items.length : 360;
  const colors = ["#4f46e5", "#0284c7", "#059669", "#d97706", "#db2777", "#7c3aed", "#0891b2", "#65a30d"];

  function spin() {
    if (spinning || items.length < 2 || tooMany) return;
    const index = randomInt(0, items.length - 1);
    const midpoint = index * segment + segment / 2;
    setWinner(items[index]);
    setSpinning(true);
    setTurn((old) => old + 360 * 5 + (360 - midpoint));
  }
  function completeSpin(event: React.TransitionEvent<SVGSVGElement>) {
    if (event.propertyName !== "transform") return;
    setSpinning(false);
    if (removeWinner && winner) setText((old) => { const lines = old.split(/\r?\n/); const index = lines.findIndex((line) => line.trim() === winner); if (index >= 0) lines.splice(index, 1); return lines.join("\n"); });
  }
  function addItem() { if (items.length >= 50) return; const next = locale === "ko" ? "새 항목" : locale === "ja" ? "新しい項目" : locale === "zh" ? "新选项" : "New entry"; setText((old) => `${old}${old.trimEnd() ? "\n" : ""}${next}`); }
  function removeItem(index: number) { const next = [...items]; next.splice(index, 1); setText(next.join("\n")); setWinner(""); }
  function sectorPath(index: number) {
    const start = index * segment, end = (index + 1) * segment;
    const point = (angle: number) => { const radians = (angle - 90) * Math.PI / 180; return [100 + 96 * Math.cos(radians), 100 + 96 * Math.sin(radians)]; };
    const [x1, y1] = point(start), [x2, y2] = point(end);
    return `M 100 100 L ${x1} ${y1} A 96 96 0 ${segment > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;
  }
  function labelPosition(index: number) {
    const angle = (index + 0.5) * segment;
    const radians = (angle - 90) * Math.PI / 180;
    const x = 100 + 58 * Math.cos(radians), y = 100 + 58 * Math.sin(radians);
    const rotate = angle > 90 && angle < 270 ? angle + 180 : angle;
    const fontSize = Math.max(5, Math.min(13, 250 / items.length));
    const label = items[index].length > 22 ? `${items[index].slice(0, 21)}…` : items[index];
    return { x, y, rotate, fontSize, label };
  }

  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
      <div><label htmlFor="wheel-options" className="text-sm font-semibold">{t.label}</label><textarea id="wheel-options" rows={8} value={text} onChange={(event) => { setText(event.target.value); setWinner(""); }} placeholder={t.option} className="mt-2 w-full rounded-xl border p-3"/><p className="mt-2 text-sm text-slate-500">{items.length} {locale === "ko" ? "개 항목" : locale === "ja" ? "件" : locale === "zh" ? "项" : "entries"}</p>
        <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={addItem} disabled={items.length >= 50} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">{t.add}</button><button type="button" onClick={() => setText(items.join("\n"))} className="rounded-lg border px-3 py-2 text-sm">{t.dedupe}</button><button type="button" onClick={() => setText(text.split(/\r?\n/).filter((line) => line.trim()).join("\n"))} className="rounded-lg border px-3 py-2 text-sm">{t.empty}</button><button type="button" onClick={() => setText(secureShuffle(items).join("\n"))} className="rounded-lg border px-3 py-2 text-sm">{t.shuffle}</button><button type="button" onClick={() => { setText(""); setWinner(""); }} className="rounded-lg border px-3 py-2 text-sm">{t.clear}</button></div>
        <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={allowDuplicates} onChange={(event) => setAllowDuplicates(event.target.checked)} />{t.duplicates}</label>
        <ul className="mt-4 max-h-64 space-y-1 overflow-auto rounded-xl border p-2">{items.map((item, index) => <li key={`${index}-${item}`} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm"><span className="min-w-0 truncate">{item}</span><button type="button" aria-label={`${t.delete}: ${item}`} onClick={() => removeItem(index)} className="shrink-0 rounded px-2 py-1 text-rose-700 hover:bg-rose-50">{t.delete}</button></li>)}</ul>
      </div>
      <div className="flex flex-col items-center"><div className="mb-3 w-full max-w-sm"><label className="text-sm font-semibold">{t.speed}<select value={duration} onChange={(event) => setDuration(Number(event.target.value))} disabled={spinning} className="mt-1 block w-full rounded-lg border p-2"><option value={3000}>{t.fast}</option><option value={5000}>{t.normal}</option><option value={8000}>{t.slow}</option></select></label></div>
        <div className="relative w-full max-w-sm"><span aria-hidden="true" className="absolute left-1/2 top-0 z-10 -translate-x-1/2 border-x-[13px] border-t-[25px] border-x-transparent border-t-rose-600"/><svg viewBox="0 0 200 200" role="img" aria-label={items.join(", ")} onTransitionEnd={completeSpin} className="aspect-square w-full rounded-full border-4 border-white shadow-xl" style={{ transform: `rotate(${turn}deg)`, transitionProperty: "transform", transitionDuration: `${duration}ms`, transitionTimingFunction: "cubic-bezier(0.12, 0.75, 0.2, 1)" }}>{items.map((item, index) => { const label = labelPosition(index); return <g key={`${index}-${item}`}><path d={sectorPath(index)} fill={colors[index % colors.length]} stroke="white" strokeWidth="0.8"/><text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${label.rotate} ${label.x} ${label.y})`} fill="white" fontSize={label.fontSize} fontWeight="700" textLength={Math.max(4, Math.min(label.label.length * label.fontSize * 0.58, segment > 10 ? 34 : 22))} lengthAdjust="spacingAndGlyphs"><title>{item}</title>{label.label}</text></g>; })}</svg></div>
        <button type="button" disabled={spinning || items.length < 2 || tooMany} onClick={spin} className="mt-5 min-h-12 rounded-xl bg-indigo-600 px-6 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{spinning ? t.spinning : t.spin}</button>
        <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={removeWinner} onChange={(event) => setRemoveWinner(event.target.checked)} />{t.removeWinner}</label>
        {winner && !spinning && <div className="mt-4 w-full rounded-xl bg-emerald-50 p-4 text-center"><h3 className="font-semibold">{t.winner}</h3><p className="mt-1 text-xl font-bold">{winner}</p></div>}
        {items.length < 2 && <p className="mt-3 text-sm text-amber-700">{t.minimum}</p>}{tooMany && <p role="alert" className="mt-3 text-sm text-rose-700">{t.maximum}</p>}
      </div>
    </div>
  </section>;
}

function localizeLottoError(message: string, locale: Locale) {
  const translations: Record<Locale, Record<string, string>> = {
    ko: { "Choose at most six included numbers.": "포함 번호는 최대 6개까지 선택할 수 있습니다.", "A number cannot be both included and excluded.": "포함 번호와 제외 번호가 겹칩니다.", "The included and excluded numbers cannot satisfy this odd/even ratio.": "선택한 번호로 홀짝 비율을 만들 수 없습니다.", "There are not enough valid number combinations for the requested games.": "현재 조건으로 만들 수 있는 조합이 게임 수보다 적습니다.", "Could not find enough distinct valid games. Relax the conditions and try again.": "조건을 완화한 뒤 다시 시도해 주세요." },
    en: { "Choose at most six included numbers.": "Choose up to six included numbers.", "A number cannot be both included and excluded.": "A number cannot be both included and excluded.", "The included and excluded numbers cannot satisfy this odd/even ratio.": "The selected numbers cannot satisfy this odd/even ratio.", "There are not enough valid number combinations for the requested games.": "There are not enough valid combinations for the selected number of games.", "Could not find enough distinct valid games. Relax the conditions and try again.": "Relax the conditions and try again." },
    ja: { "Choose at most six included numbers.": "含める数字は6個まで選択できます。", "A number cannot be both included and excluded.": "同じ数字を含める設定と除外設定の両方にはできません。", "The included and excluded numbers cannot satisfy this odd/even ratio.": "選択した数字では指定の奇数・偶数比率にできません。", "There are not enough valid number combinations for the requested games.": "指定した口数を作るための有効な組み合わせが不足しています。", "Could not find enough distinct valid games. Relax the conditions and try again.": "条件を緩和してもう一度お試しください。" },
    zh: { "Choose at most six included numbers.": "最多选择六个包含号码。", "A number cannot be both included and excluded.": "同一个号码不能同时设为包含和排除。", "The included and excluded numbers cannot satisfy this odd/even ratio.": "当前包含和排除号码无法满足该奇偶比例。", "There are not enough valid number combinations for the requested games.": "符合条件的组合数量不足，无法生成所选注数。", "Could not find enough distinct valid games. Relax the conditions and try again.": "请放宽条件后重试。" },
  };
  return translations[locale][message] ?? message;
}
