import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolWorkspace } from "@/components/tool/tool-workspace";
import { categoryById } from "@/registry/categories";
import { getTool, tools } from "@/registry/tools";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() { return tools.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params; const tool = getTool(slug); if (!tool) return {};
  return createPageMetadata({ title: tool.title, description: tool.description, keywords: tool.keywords, path: `/${tool.slug}` });
}

export default async function ToolPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params; const tool = getTool(slug); if (!tool) notFound();
  const category = categoryById[tool.category];
  const related = (tool.relatedTools ?? []).map((id) => getTool(id)).filter((item) => item !== undefined);
  const questions = [`${tool.title}는 무료인가요?`, "파일이 서버로 전송되나요?", "처리할 수 있는 파일 크기는 얼마인가요?"];
  return <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500"><Link href="/" className="hover:text-indigo-700">도구</Link><span className="mx-2">/</span><Link href={`/category/${category.id}`} className="hover:text-indigo-700">{category.name}</Link><span className="mx-2">/</span><span aria-current="page" className="text-slate-700">{tool.shortTitle}</span></nav>
    <header className="mb-7"><h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{tool.title}</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">{tool.description}</p><p className="mt-3 text-sm text-emerald-800">🔒 파일 도구는 브라우저 안에서 처리됩니다.</p></header>
    <ToolWorkspace key={tool.slug} tool={tool} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
      { "@context": "https://schema.org", "@type": "WebApplication", name: tool.title, description: tool.description, url: absoluteUrl(`/${tool.slug}`), inLanguage: "ko-KR", applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" } },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "도구", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: category.name, item: absoluteUrl(`/category/${category.id}`) },
        { "@type": "ListItem", position: 3, name: tool.title, item: absoluteUrl(`/${tool.slug}`) },
      ] },
      { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions.map((question,index) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: index === 1 ? "아니요. 처리는 브라우저에서 진행되고 파일 내용이나 이름을 서버로 보내지 않습니다." : index === 2 ? "브라우저 메모리와 기기 성능을 고려해 이미지 30MB, PDF 50MB까지 처리하도록 제한합니다." : "네. Woori Tools의 도구는 무료로 사용할 수 있습니다." } })) },
    ]).replace(/</g, "\\u003c") }} />
    <section className="mt-12"><h2 className="text-2xl font-bold">사용 방법</h2><ol className="mt-4 list-inside list-decimal space-y-2 text-slate-700"><li>{tool.category==="image"||tool.category==="pdf"?"파일을 선택하거나 파일 선택 영역에 끌어 놓습니다.":"입력 영역에 변환하거나 처리할 내용을 입력합니다."}</li><li>필요한 옵션을 선택하고 실행 버튼을 누릅니다.</li><li>결과를 확인하고 복사하거나 기기에 다운로드합니다.</li></ol><h2 className="mt-9 text-2xl font-bold">도구 소개</h2><p className="mt-3 leading-7 text-slate-700">{tool.description} 모든 처리는 사용자의 브라우저에서 이루어지며 원본 입력은 변경하지 않습니다.</p><p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">개인정보 보호: 파일 도구는 파일 내용을 서버에 업로드하지 않습니다. 결과는 이 브라우저에서 생성됩니다.</p></section>
    <section className="mt-10"><h2 className="text-2xl font-bold">자주 묻는 질문</h2><div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200">{questions.map((question,index)=><details key={question} className="group p-4" open={index===0}><summary className="cursor-pointer font-medium">{question}</summary><p className="mt-3 text-sm leading-6 text-slate-600">{index===1?"아니요. 처리는 브라우저에서 진행되고 파일 내용이나 이름을 서버로 보내지 않습니다.":index===2?"브라우저 메모리와 기기 성능을 고려해 이미지 30MB, PDF 50MB까지 처리하도록 제한합니다.":"네. Woori Tools의 도구는 무료로 사용할 수 있습니다."}</p></details>)}</div></section>
    {related.length>0&&<section className="mt-10"><h2 className="text-2xl font-bold">관련 도구</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{related.map((item)=><Link key={item.slug} href={`/${item.slug}`} className="rounded-xl border border-slate-200 p-4 hover:border-indigo-300"><span className="font-semibold">{item.title}</span><span className="mt-1 block text-sm text-slate-600">{item.description}</span></Link>)}</div></section>}
  </main>;
}
