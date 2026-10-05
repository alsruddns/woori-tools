import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/"},sitemap:"https://www.woori.today/sitemap.xml",host:"https://www.woori.today"};}
