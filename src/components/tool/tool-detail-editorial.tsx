import { getToolDetailEditorial } from "@/registry/tool-detail-editorials";
import type { PublishedTargetLocale } from "@/i18n/routing";

export function ToolDetailEditorial({ locale, slug }: { locale: PublishedTargetLocale; slug: string }) {
  const editorial = getToolDetailEditorial(locale, slug);
  if (!editorial) return null;

  return (
    <section data-testid="tool-detail-editorial" className="mt-4 grid min-w-0 gap-4 [overflow-wrap:anywhere]" aria-label={editorial.labels.faq}>
      <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-xl font-bold sm:text-2xl">{editorial.labels.principle}</h2>
        <p className="mt-3 leading-7 text-slate-700">{editorial.principle}</p>
      </article>
      <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-xl font-bold sm:text-2xl">{editorial.labels.useCase}</h2>
        <p className="mt-3 leading-7 text-slate-700">{editorial.useCase}</p>
      </article>
      <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-xl font-bold sm:text-2xl">{editorial.labels.troubleshooting}</h2>
        <p className="mt-3 leading-7 text-slate-700">{editorial.troubleshooting}</p>
      </article>
      <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-xl font-bold sm:text-2xl">{editorial.labels.faq}</h2>
        <h3 className="mt-3 font-semibold">{editorial.faqQuestion}</h3>
        <p className="mt-2 leading-7 text-slate-700">{editorial.faqAnswer}</p>
      </article>
    </section>
  );
}
