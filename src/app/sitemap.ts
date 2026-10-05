import type { MetadataRoute } from "next";
import { categories } from "@/registry/categories";
import { tools } from "@/registry/tools";
export default function sitemap():MetadataRoute.Sitemap{const base="https://www.woori.today";const now=new Date();return ["/tools","/privacy","/terms",...categories.filter((category)=>tools.some((tool)=>tool.category===category.id)).map((category)=>`/tools/category/${category.id}`),...tools.map((tool)=>`/tools/${tool.slug}`)].map((path)=>({url:`${base}${path}`,lastModified:now,changeFrequency:path==="/tools"?"weekly":"monthly",priority:path==="/tools"?1:path.startsWith("/tools/")?0.8:0.4}));}
