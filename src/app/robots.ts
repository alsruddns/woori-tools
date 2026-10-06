import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/tools/"},sitemap:"https://www.woori.today/tools/sitemap.xml",host:"https://www.woori.today"};}
