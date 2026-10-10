"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/routing";
import { generateLotteryGames, type LotteryKind } from "@/lib/lottery.mjs";
import { copyText } from "@/lib/copy-to-clipboard";

const labels: Record<Locale, { draw: string; again: string; games: string; one: string; five: string; result: string; copy: string; main: string; special: string; notice: string; rules: string; game: string }> = {
  ko: { draw: "번호 추첨하기", again: "다시 추첨", games: "게임 수", one: "1게임", five: "5게임 추첨", result: "추첨 결과", copy: "전체 복사", main: "메인 번호", special: "특수 공", notice: "이 도구는 오락을 위한 무작위 번호 추첨 도구이며, 당첨 번호를 예측하거나 당첨을 보장하지 않습니다. 실제 복권 구매, 참가 가능 지역, 연령 및 최신 게임 규칙은 공식 안내를 확인하세요.", rules: "게임 규칙", game: "게임" },
  en: { draw: "Draw numbers", again: "Draw again", games: "Number of games", one: "1 game", five: "Draw 5 games", result: "Results", copy: "Copy all", main: "Main numbers", special: "Special ball", notice: "This tool draws random numbers for entertainment. It cannot predict winning numbers or guarantee a prize. Check official guidance for purchase, eligible locations, age requirements, and current game rules.", rules: "Game rules", game: "Game" },
  ja: { draw: "番号を抽選", again: "もう一度抽選", games: "口数", one: "1口", five: "5口を抽選", result: "抽選結果", copy: "すべてコピー", main: "メイン番号", special: "特別なボール", notice: "このツールは娯楽目的でランダムな番号を抽選します。当せん番号の予測や当せんの保証はできません。購入方法、販売地域、年齢制限、最新のゲームルールは宝くじ公式サイトをご確認ください。", rules: "ゲームのルール", game: "口" },
  zh: { draw: "抽取号码", again: "再次抽取", games: "注数", one: "1注", five: "抽取5注", result: "抽取结果", copy: "复制全部", main: "主号码", special: "特别球", notice: "本工具仅供娱乐，随机抽取号码，不会预测中奖号码或保证中奖。购票方式、可参与地区、年龄要求及最新规则请查看官方说明。", rules: "游戏规则", game: "注" },
};

const ranges: Record<Locale, Record<LotteryKind, string>> = {
  ko: { lotto: "1~45 중 중복 없는 번호 6개", powerball: "1~69 흰 공 5개 + 1~26 Powerball 1개", megaMillions: "1~70 메인 번호 5개 + 1~24 Mega Ball 1개", japanLoto6: "1~43 중 중복 없는 번호 6개", japanLoto7: "1~37 중 중복 없는 번호 7개", japanMiniLoto: "1~31 중 중복 없는 번호 5개" },
  en: { lotto: "6 unique numbers from 1 to 45", powerball: "5 white balls from 1 to 69 + 1 Powerball from 1 to 26", megaMillions: "5 main numbers from 1 to 70 + 1 Mega Ball from 1 to 24", japanLoto6: "6 unique numbers from 1 to 43", japanLoto7: "7 unique numbers from 1 to 37", japanMiniLoto: "5 unique numbers from 1 to 31" },
  ja: { lotto: "1～45から重複なしで6個", powerball: "1～69から白いボール5個 + 1～26からPowerballを1個", megaMillions: "1～70からメイン数字5個 + 1～24からMega Ballを1個", japanLoto6: "1～43から異なる数字を6個", japanLoto7: "1～37から異なる数字を7個", japanMiniLoto: "1～31から異なる数字を5個" },
  zh: { lotto: "从1至45中抽取6个不重复号码", powerball: "从1至69中抽取5个白球 + 从1至26中抽取1个Powerball", megaMillions: "从1至70中抽取5个主号码 + 从1至24中抽取1个Mega Ball", japanLoto6: "从1至43中抽取6个不重复号码", japanLoto7: "从1至37中抽取7个不重复号码", japanMiniLoto: "从1至31中抽取5个不重复号码" },
};

export function LotteryWorkspace({ locale, kind }: { locale: Locale; kind: LotteryKind }) {
  const t = labels[locale];
  const [count, setCount] = useState<1 | 5>(1);
  const [games, setGames] = useState<ReturnType<typeof generateLotteryGames>>([]);
  function draw() { setGames(generateLotteryGames(kind, count)); }
  const format = (game: (typeof games)[number]) => [...game.main, ...(game.special === undefined ? [] : [game.special])].join(", ");
  return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <p className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900">{t.rules}: {ranges[locale][kind]}. {locale === "ko" ? "메인 번호는 중복 없이 오름차순으로 표시하고 특수 공은 따로 표시합니다." : locale === "ja" ? "メイン数字は重複なしで昇順に並べ、特別なボールは別に表示します。" : locale === "zh" ? "主号码不重复并按升序排列，特别球单独显示。" : "Main numbers are unique and sorted; the special ball is shown separately."}</p>
    <fieldset className="mt-5"><legend className="text-sm font-semibold">{t.games}</legend><div className="mt-2 grid max-w-sm grid-cols-2 gap-2">{([1, 5] as const).map((value) => <button key={value} type="button" aria-pressed={count === value} onClick={() => setCount(value)} className={`rounded-xl border p-3 font-semibold ${count === value ? "border-indigo-600 bg-indigo-50 text-indigo-800" : "border-slate-300"}`}>{value === 1 ? t.one : t.five}</button>)}</div></fieldset>
    <button type="button" onClick={draw} className="mt-5 min-h-12 w-full rounded-xl bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-700 sm:w-auto">{games.length ? t.again : t.draw}</button>
    {games.length > 0 && <section className="mt-6 rounded-2xl bg-slate-50 p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">{t.result}</h2><button type="button" onClick={() => void copyText(games.map((game, index) => `${index + 1}. ${format(game)}`).join("\n"))} className="rounded-lg border bg-white px-3 py-2 text-sm">{t.copy}</button></div><div className="mt-4 grid gap-3">{games.map((game, index) => <article key={`${index}-${format(game)}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-3"><div><h3 className="mb-2 text-sm font-semibold">{index + 1} {t.game}</h3><div className="flex flex-wrap gap-2" aria-label={t.main}>{game.main.map((number) => <span key={number} className="grid size-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-900">{number}</span>)}</div>{game.special !== undefined && <div className="mt-3"><h4 className="mb-2 text-sm font-semibold">{kind === "powerball" ? "Powerball" : "Mega Ball"}</h4><span className="grid size-10 place-items-center rounded-full bg-rose-100 font-bold text-rose-900">{game.special}</span></div>}</div><button type="button" onClick={() => void copyText(format(game))} className="rounded-lg border px-3 py-2 text-sm">{locale === "ko" ? "복사" : locale === "ja" ? "コピー" : locale === "zh" ? "复制" : "Copy"}</button></article>)}</div></section>}
    <p className="mt-6 border-t pt-4 text-sm leading-6 text-slate-600">{t.notice}</p>
  </section>;
}
