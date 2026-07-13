import type { MetadataRoute } from "next";

/* robots.txt (PORTAL_SPEC Security flag) — the logged-in portals must be
   excluded from crawlers until real auth is live. The marketing/legal/auth
   pages stay indexable. Pairs with the per-route `robots: { index: false }`
   metadata and the X-Robots-Tag header set in proxy.ts. */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/super-admin/", "/admin/", "/power-user/", "/pitch-holder/"],
    },
  };
}
