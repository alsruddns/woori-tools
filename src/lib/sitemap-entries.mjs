/**
 * @param {{ tools: Array<{ slug: string, supportedLocales?: ReadonlyArray<string> }>, locales: ReadonlyArray<string>, siteOrigin: string, languageAlternates: (path: string, supportedLocales?: ReadonlyArray<string>) => Record<string, string>, lastModified?: Date }} options
 * @returns {Array<{ url: string, lastModified: Date, changeFrequency: "weekly" | "monthly", priority: number, alternates: { languages: Record<string, string> } }>}
 */
export function createSitemapEntries({
  tools,
  locales,
  siteOrigin,
  languageAlternates,
  lastModified = new Date(),
}) {
  const paths = [{ path: "/tools", supportedLocales: locales }, ...tools.map(({ slug, supportedLocales = locales }) => ({ path: `/tools/${slug}`, supportedLocales }))];

  return paths.flatMap(({ path, supportedLocales }) =>
    supportedLocales.map((locale) => ({
      url: `${siteOrigin}/${locale}${path}`,
      lastModified,
      changeFrequency: path === "/tools" ? "weekly" : "monthly",
      priority: path === "/tools" ? 1 : 0.8,
      alternates: { languages: languageAlternates(path, supportedLocales) },
    })),
  );
}
