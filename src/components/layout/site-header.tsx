import Image from "next/image";
import Link from "next/link";
import { categories } from "@/registry/categories";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="woori.today 홈"
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src="/tools/images/brand/woori-logo.png"
            alt="woori.today"
            width={419}
            height={99}
            sizes="(max-width: 639px) 135px, 160px"
            priority
            className="h-auto w-[135px] sm:w-[160px]"
          />
          <span className="text-sm font-semibold tracking-tight text-slate-700 sm:text-base">
            Tools
          </span>
        </Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-3 text-sm sm:gap-5">
          <Link href="/" className="font-medium text-slate-700 hover:text-indigo-700">도구</Link>
          <div className="hidden items-center gap-4 md:flex">
            {categories.filter((category) => category.id !== "qr").map((category) => (
              <Link key={category.id} href={`/category/${category.id}`} className="text-slate-600 hover:text-indigo-700">
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
