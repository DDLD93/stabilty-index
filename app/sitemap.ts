import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/metadata";

// Rebuilt hourly so new reports and Honors pages appear without a redeploy.
export const revalidate = 3600;

/**
 * Generate dynamic sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reports`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/subscribe`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/spotlights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Dynamic report pages
  try {
    const reports = await db.snapshot.findMany({
      where: { publishedAt: { not: null } },
      select: { id: true, publishedAt: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    const reportPages: MetadataRoute.Sitemap = reports.map((report) => ({
      url: `${baseUrl}/reports/${report.id}`,
      lastModified: report.updatedAt || report.publishedAt || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    // Separate guard: a missing Honors table (migration not yet applied) must not drop the report URLs.
    const honorsEdition = await db.honorsEdition
      .findFirst({
        where: { status: { not: "DRAFT" } },
        orderBy: { year: "desc" },
        select: { updatedAt: true, categories: { where: { isActive: true }, select: { slug: true, updatedAt: true } } },
      })
      .catch(() => null);
    const honorsPages: MetadataRoute.Sitemap = (honorsEdition?.categories ?? []).map((c) => ({
      url: `${baseUrl}/honors/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticPages, ...reportPages, ...honorsPages];
  } catch (error) {
    // If database is unavailable, return static pages only
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}
