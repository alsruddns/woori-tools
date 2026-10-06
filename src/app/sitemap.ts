import type { MetadataRoute } from "next";
import { categories } from "@/registry/categories";
import { tools } from "@/registry/tools";
export default function sitemap():MetadataRoute.Sitemap{const base="https://www.woori.today/tools";const now=new Date();return ["/","/privacy","/terms",...categories.filter((category)=>tools.some((tool)=>tool.category===category.id)).map((category)=>`/category/${category.id}`),...tools.map((tool)=>`/${tool.slug}`)].map((path)=>({url:`${base}${path}`,lastModified:now,changeFrequency:path==="/"?"weekly":"monthly",priority:path==="/"?1:0.8}));}
