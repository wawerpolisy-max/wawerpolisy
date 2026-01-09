import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/kontakt", "/wycena", "/ubezpieczenia", "/ubezpieczenia/"],
        disallow: ["/admin", "/portal"],
      },
    ],
    sitemap: "https://wawerpolisy.pl/sitemap.xml",
  }
}
