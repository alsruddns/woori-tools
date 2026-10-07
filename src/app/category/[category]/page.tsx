import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/registry/categories";
import { tools } from "@/registry/tools";
import { createPageMetadata } from "@/lib/seo";

export function generateStaticParams(){return categories.filter((category)=>tools.some((tool)=>tool.category===category.id)).map(({id})=>({category:id}));}
export async function generateMetadata({params}:PageProps<"/category/[category]">){const {category:id}=await params;const category=categories.find((item)=>item.id===id);if(!category)return{};return createPageMetadata({title:`${category.name} 도구`,description:category.description,path:`/category/${id}`});}
export default async function CategoryPage({params}:PageProps<"/category/[category]">){const {category:id}=await params;const category=categories.find((item)=>item.id===id);const list=tools.filter((tool)=>tool.category===id);if(!category||!list.length)notFound();return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><nav className="mb-6 text-sm text-slate-500"><Link href="/">도구</Link> / {category.name}</nav><h1 className="text-3xl font-bold">{category.name} 도구</h1><p className="mt-3 text-slate-600">{category.description}</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((tool)=><Link key={tool.slug} href={`/${tool.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300"><h2 className="font-semibold">{tool.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p></Link>)}</div></main>;}
