import type { MetadataRoute } from "next"

const baseUrl = "https://wawerpolisy.pl"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes = [
    "",
    "/kontakt",
    "/wycena",
    "/apk",
    "/faq",
    "/o-mnie",
    "/towarzystwa",
    "/blog",
    "/ubezpieczenia",
    "/ubezpieczenia/komunikacyjne",
    "/ubezpieczenia/mieszkaniowe",
    "/ubezpieczenia/turystyczne",
    "/ubezpieczenia/zdrowotne",
    "/ubezpieczenia/zyciowe",
    "/ubezpieczenia/firmowe",
    "/polityka-prywatnosci",
    "/rodo",
    "/regulamin",
  ]

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/blog") ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }))
}
