import type { Metadata } from "next";
import { PublicationDashboard } from "@/components/publication/PublicationDashboard";
import Link from "next/link";
import { db } from "@/lib/db";
import { defaultMetadata, siteConfig } from "@/lib/metadata";
import { getArticleSchema, renderJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const snapshot = await db.snapshot.findUnique({
      where: { id },
      select: {
        period: true,
        overallScore: true,
        overallNarrative: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    if (!snapshot || !snapshot.publishedAt) {
      return {
        ...defaultMetadata,
        title: "Report Not Found",
        description: "The requested stability report could not be found.",
      };
    }

    const title = `${snapshot.period} Report - Nigeria Stability Index`;
    const description =
      snapshot.overallNarrative ||
      `Nigeria Stability Index ${snapshot.period} report. Overall score: ${snapshot.overallScore.toFixed(1)}/10.`;

    return {
      ...defaultMetadata,
      title,
      description,
      openGraph: {
        ...defaultMetadata.openGraph,
        title,
        description,
        url: `${siteConfig.url}/reports/${id}`,
        type: "article",
        publishedTime: snapshot.publishedAt.toISOString(),
        modifiedTime: snapshot.updatedAt?.toISOString(),
      },
      twitter: {
        ...defaultMetadata.twitter,
        title,
        description,
      },
      alternates: {
        canonical: `/reports/${id}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata for report:", error);
    return {
      ...defaultMetadata,
      title: "Report",
      description: "Nigeria Stability Index report.",
    };
  }
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let articleSchema = null;
  try {
    const snapshot = await db.snapshot.findUnique({
      where: { id },
      select: {
        period: true,
        overallScore: true,
        overallNarrative: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    if (snapshot && snapshot.publishedAt) {
      articleSchema = getArticleSchema({
        headline: `${snapshot.period} Report - Nigeria Stability Index`,
        description:
          snapshot.overallNarrative ||
          `Nigeria Stability Index ${snapshot.period} report. Overall score: ${snapshot.overallScore.toFixed(1)}/10.`,
        url: `${siteConfig.url}/reports/${id}`,
        datePublished: snapshot.publishedAt.toISOString(),
        dateModified: snapshot.updatedAt?.toISOString(),
      });
    }
  } catch (error) {
    console.error("Error fetching snapshot for structured data:", error);
  }

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(articleSchema) }}
        />
      )}
      <main className="w-full pb-24">
        {/* Breadcrumb nav */}
        <div className="pt-20">
          <div className="mx-auto w-full max-w-5xl px-6 pb-8">
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-[color:var(--nsi-ink-soft)] backdrop-blur-sm transition-all hover:bg-white hover:text-[color:var(--nsi-ink)]"
            >
              <span aria-hidden>←</span>
              All Reports
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl px-6">
          <PublicationDashboard snapshotId={id} />
        </div>
      </main>
    </>
  );
}
