"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/routing";

type PillarKey = "year"|"month"|"day"|"hour";
type ElementKey = "wood"|"fire"|"earth"|"metal"|"water";
type Chart = { korean:Record<PillarKey,string>; hanja:Record<PillarKey,string>; elements:Record<ElementKey,number> };
const labels = {
 ko:{birth:"생년월일",time:"출생 시각",calendar:"달력 종류",solar:"양력",lunar:"음력",leap:"윤달",calculate:"사주 계산",again:"다시 계산",pillars:"사주팔자",year:"년주",month:"월주",day:"일주",hour:"시주",elements:"오행 분포",wood:"목",fire:"화",earth:"토",metal:"금",water:"수",basis:"한국 표준시(KST), 자정 날짜 경계 기준입니다. 진태양시 보정은 적용하지 않습니다.",method:"오행 수는 각 기둥의 천간과 지지 8글자를 동일한 비중으로 세었습니다. 지장간 가중치는 반영하지 않습니다.",privacy:"생년월일과 출생 시각은 브라우저 안에서만 계산하고 저장하거나 전송하지 않습니다.",note:"사주 계산은 전통 역법을 바탕으로 한 참고 정보이며 해석 방식은 학파에 따라 다를 수 있습니다.",error:"입력한 날짜와 시간이 계산 범위에 맞는지 확인해 주세요. 양력 지원 범위는 1800~2300년, 음력은 1800~2100년입니다."},
 en:{birth:"Date of birth",time:"Birth time",calendar:"Calendar",solar:"Solar",lunar:"Lunar",leap:"Leap month",calculate:"Calculate chart",again:"Calculate again",pillars:"Four pillars",year:"Year",month:"Month",day:"Day",hour:"Hour",elements:"Five elements",wood:"Wood",fire:"Fire",earth:"Earth",metal:"Metal",water:"Water",basis:"Uses Korea Standard Time (KST) and a midnight day boundary. True-solar-time correction is not applied.",method:"Element counts give equal weight to each of the eight heavenly-stem and earthly-branch characters. Hidden-stem weighting is not included.",privacy:"Your birth date and time are calculated in this browser only; they are not stored or sent.",note:"This chart is a reference based on traditional calendar rules. Interpretation conventions can vary by school.",error:"Check that the date and time are in range. Solar dates: 1800–2300; lunar dates: 1800–2100."},
 ja:{birth:"生年月日",time:"出生時刻",calendar:"暦の種類",solar:"太陽暦",lunar:"太陰暦",leap:"閏月",calculate:"命式を計算",again:"再計算",pillars:"四柱",year:"年柱",month:"月柱",day:"日柱",hour:"時柱",elements:"五行の分布",wood:"木",fire:"火",earth:"土",metal:"金",water:"水",basis:"韓国標準時（KST）と午前0時の日界を使用します。真太陽時補正は行いません。",method:"五行は四柱の天干・地支8字を同じ重みで数えます。蔵干の加重は含みません。",privacy:"生年月日と時刻はブラウザー内で計算し、保存や送信はしません。",note:"伝統暦に基づく計算参考です。解釈の慣例は流派によって異なる場合があります。",error:"日付と時刻が計算範囲内か確認してください。太陽暦は1800～2300年、太陰暦は1800～2100年です。"},
 zh:{birth:"出生日期",time:"出生时间",calendar:"历法",solar:"公历",lunar:"农历",leap:"闰月",calculate:"计算命盘",again:"重新计算",pillars:"四柱",year:"年柱",month:"月柱",day:"日柱",hour:"时柱",elements:"五行分布",wood:"木",fire:"火",earth:"土",metal:"金",water:"水",basis:"采用韩国标准时间（KST）与午夜换日规则，不进行真太阳时校正。",method:"五行统计将四柱天干地支共八字等权计数，不包含藏干权重。",privacy:"出生日期与时间仅在浏览器中计算，不会保存或发送。",note:"本命盘依据传统历法计算，仅供参考。不同流派的解读惯例可能不同。",error:"请确认日期和时间在计算范围内。公历支持1800至2300年，农历支持1800至2100年。"},
} as const;
const pillarKeys:PillarKey[]=["year","month","day","hour"];
const elementKeys:ElementKey[]=["wood","fire","earth","metal","water"];
const elementNames:Record<Locale,Record<"목"|"화"|"토"|"금"|"수",ElementKey>>={
 ko:{"목":"wood","화":"fire","토":"earth","금":"metal","수":"water"},
 en:{"목":"wood","화":"fire","토":"earth","금":"metal","수":"water"},
 ja:{"목":"wood","화":"fire","토":"earth","금":"metal","수":"water"},
 zh:{"목":"wood","화":"fire","토":"earth","금":"metal","수":"water"},
};

export function SajuWorkspace({locale}:{locale:Locale}) {
 const t=labels[locale]; const [birth,setBirth]=useState(""); const [time,setTime]=useState("12:00"); const [calendar,setCalendar]=useState<"solar"|"lunar">("solar"); const [leap,setLeap]=useState(false); const [chart,setChart]=useState<Chart|null>(null); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
 async function calculate(){ if(!birth||!time){setError(t.error);return;} setBusy(true);setError(""); try{
  const {calculateFourPillars}=await import("manseryeok");
  const [year,month,day]=birth.split("-").map(Number); const [hour,minute]=time.split(":").map(Number);
  const result=calculateFourPillars({year,month,day,hour,minute,isLunar:calendar==="lunar",isLeapMonth:calendar==="lunar"&&leap,dayBoundary:"midnight"});
  const korean=result.toObject(); const hanja=result.toHanjaObject(); const elements:Chart["elements"]={wood:0,fire:0,earth:0,metal:0,water:0};
  const elementPairs={year:result.yearElement,month:result.monthElement,day:result.dayElement,hour:result.hourElement};
  for(const key of pillarKeys){for(const value of [elementPairs[key].stem,elementPairs[key].branch]) elements[elementNames[locale][value]]+=1;}
  setChart({korean,hanja:{year:hanja.year.hanja,month:hanja.month.hanja,day:hanja.day.hanja,hour:hanja.hour.hanja},elements});
 }catch{setChart(null);setError(t.error);}finally{setBusy(false);} }
 return <section className="rounded-3xl border border-amber-200 bg-white p-5 shadow-sm sm:p-7">
  <div className="grid gap-4 sm:grid-cols-2"><label htmlFor="saju-date" className="text-sm font-semibold">{t.birth}<input id="saju-date" type="date" value={birth} onChange={e=>setBirth(e.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border p-2"/></label><label htmlFor="saju-time" className="text-sm font-semibold">{t.time}<input id="saju-time" type="time" value={time} onChange={e=>setTime(e.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border p-2"/></label>
   <label htmlFor="saju-calendar" className="text-sm font-semibold">{t.calendar}<select id="saju-calendar" value={calendar} onChange={e=>{setCalendar(e.target.value as typeof calendar);setLeap(false);}} className="mt-1 block min-h-11 w-full rounded-lg border p-2"><option value="solar">{t.solar}</option><option value="lunar">{t.lunar}</option></select></label>
   {calendar==="lunar"&&<label className="flex min-h-11 items-center gap-2 self-end text-sm"><input type="checkbox" checked={leap} onChange={e=>setLeap(e.target.checked)} className="size-4"/>{t.leap}</label>}
  </div><button type="button" disabled={busy} onClick={calculate} className="mt-5 min-h-12 rounded-xl bg-amber-700 px-6 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-60">{busy?"…":chart?t.again:t.calculate}</button>
  {error&&<p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
  {chart&&<div aria-live="polite" className="mt-7"><h2 className="text-xl font-bold">{t.pillars}</h2><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{pillarKeys.map(key=><article key={key} className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center"><h3 className="text-sm font-semibold text-slate-600">{t[key]}</h3><p className="mt-2 text-2xl font-bold">{chart.hanja[key]}</p><p className="mt-1 text-sm">{chart.korean[key]}</p></article>)}</div><h2 className="mt-6 text-xl font-bold">{t.elements}</h2><div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{elementKeys.map(key=><article key={key} className="rounded-xl bg-violet-50 p-3 text-center"><h3 className="text-sm font-semibold">{t[key]}</h3><p className="mt-1 text-2xl font-bold tabular-nums">{chart.elements[key]}</p></article>)}</div><p className="mt-3 text-xs leading-5 text-slate-500">{t.method}</p></div>}
  <div className="mt-5 space-y-2"><p className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{t.basis}</p><p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{t.privacy}</p><p className="text-sm leading-6 text-slate-600">{t.note}</p></div>
 </section>;
}
