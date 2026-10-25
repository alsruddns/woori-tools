import { plannedLocaleConfig } from "../src/i18n/routing";
import { targetLocalePublication } from "../src/registry/target-locale-publication";
import { tools } from "../src/registry/tools";
import { getTargetToolTranslation } from "../src/registry/target-tool-translation";

const failures: string[] = [];
for (const { routeLocale } of plannedLocaleConfig) {
  const localizedSlugs = new Set<string>();
  for (const { slug, title, description } of tools) {
    const translation = getTargetToolTranslation(routeLocale, slug);
    if (!translation) {
      failures.push(`${routeLocale}/${slug}: missing translation`);
      continue;
    }
    localizedSlugs.add(slug);
    const fields = [translation.title, translation.description, translation.seoTitle, translation.seoDescription,
      translation.example, translation.options, translation.caution,
      ...translation.steps, translation.faq.example, translation.faq.caution];
    if (fields.some((value) => !value.trim())) failures.push(`${routeLocale}/${slug}: empty required copy`);
    if (fields.some((value) => value === title || value === description)) failures.push(`${routeLocale}/${slug}: source-language copy reused`);
  }
  if (localizedSlugs.size !== tools.length) failures.push(`${routeLocale}: ${localizedSlugs.size}/${tools.length} tool translations`);
  const publication = targetLocalePublication[routeLocale];
  if (publication.publishedToolSlugs.length > publication.uiVerifiedToolSlugs.length
    || publication.publishedToolSlugs.length > publication.seoVerifiedToolSlugs.length) {
    failures.push(`${routeLocale}: publication exceeds UI or SEO verification`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated authored tool content: ${plannedLocaleConfig.length} locales × ${tools.length} tools; publication lists remain gated by UI and SEO verification.`);
}
