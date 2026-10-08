export function createSitemapEntries(slugs, serviceBaseUrl) {
  const baseUrl = serviceBaseUrl.replace(/\/+$/, "");

  return slugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}
