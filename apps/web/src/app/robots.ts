import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/shared/utils/helpers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
