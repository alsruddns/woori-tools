import Link from "next/link";
import { ToolDirectory } from "@/components/tool/tool-directory";
import { categories } from "@/registry/categories";
import { tools } from "@/registry/tools";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "무료 온라인 도구 모음", description: "이미지, PDF, 텍스트, 개발자 도구를 브라우저에서 안전하게 사용하세요.", path: "/" });

export default function ToolsPage() {
  const popular = ["jpg-to-png", "image-compress", "pdf-merge", "character-count", "json-formatter", "uuid-generator"];
  return <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <section className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 px-6 py-12 sm:px-12 sm:py-16">
      <p className="font-semibold text-indigo-700">무료 온라인 도구 모음</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">필요한 작업을, 간편하게</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">이미지, PDF, 텍스트와 개발 작업을 돕는 무료 도구를 한곳에서 사용하세요. 파일은 브라우저에서 직접 처리됩니다.</p>
      <ToolDirectory tools={tools} />
    </section>
    <section className="py-12"><h2 className="text-2xl font-bold">자주 찾는 도구</h2><p className="mt-2 text-slate-600">바로 사용할 수 있는 인기 도구</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{popular.map((slug) => { const tool = tools.find((item) => item.slug === slug)!; return <ToolCard key={slug} tool={tool} />; })}</div></section>
    <section className="py-8"><h2 className="text-2xl font-bold">카테고리</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{categories.filter((category) => tools.some((tool) => tool.category === category.id)).map((category) => <Link key={category.id} href={`/category/${category.id}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"><span className="font-semibold">{category.name}</span><span className="mt-2 block text-sm text-slate-500">{tools.filter((tool) => tool.category === category.id).length}개 도구</span></Link>)}</div></section>
    <section className="py-8"><h2 className="text-2xl font-bold">전체 도구</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div></section>
    <p className="mt-8 rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900">개인정보 보호를 위해 파일 도구는 파일을 서버에 업로드하지 않고 브라우저에서 처리합니다.</p>
  </main>;
}

function ToolCard({ tool }: { tool: (typeof tools)[number] }) { return <Link href={`/${tool.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm"><h3 className="font-semibold text-slate-900">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p></Link>; }
