"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ToolDefinition } from "@/registry/tools";

export function ToolDirectory({ tools }: { tools: ToolDefinition[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return q ? tools.filter((tool) => `${tool.title} ${tool.description} ${tool.keywords.join(" ")}`.toLocaleLowerCase().includes(q)) : [];
  }, [query, tools]);
  return <div className="relative mt-8 max-w-2xl">
    <label htmlFor="tool-search" className="sr-only">도구 검색</label>
    <input id="tool-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="어떤 작업을 도와드릴까요? 예: jpg, PDF, JSON" className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
    {query && <div className="absolute z-10 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl" role="listbox">{filtered.length ? filtered.slice(0, 8).map((tool) => <Link key={tool.slug} href={`/${tool.slug}`} className="block rounded-xl p-3 hover:bg-slate-50"><span className="font-medium">{tool.title}</span><span className="mt-1 block text-sm text-slate-500">{tool.description}</span></Link>) : <p className="p-3 text-sm text-slate-500">검색 결과가 없습니다.</p>}</div>}
  </div>;
}
