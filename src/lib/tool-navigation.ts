export type SearchableTool = { slug: string; title: string; description: string; keywords: string[] };

export function matchesToolSearch(tool: SearchableTool, query: string, locale: string): boolean {
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  if (!normalizedQuery) return true;
  return `${tool.title} ${tool.description} ${tool.keywords.join(" ")} ${tool.slug}`
    .toLocaleLowerCase(locale)
    .includes(normalizedQuery);
}
