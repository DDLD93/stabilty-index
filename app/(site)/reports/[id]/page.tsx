import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportArticle } from "@/components/publication/ReportArticle";
import { defaultMetadata, siteConfig } from "@/lib/metadata";
import { getBreadcrumbSchema, getArticleSchema, renderJsonLd } from "@/lib/seo";
import { formatDate, getReport } from "@/lib/snapshots";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const report = await getReport(id).catch(() => null);
  if (!report) {
    return { ...defaultMetadata, title: "Report not found", robots: { index: false } };
  }
  const title = `${report.period}: ${report.overallScore.toFixed(1)} out of 10`;
  const description = `The Nigeria Stability Index for ${report.period} (edition ${report.edition}, published ${formatDate(report.publishedAt)}) read ${report.overallScore.toFixed(1)} out of 10. Pillar scores, state and institution spotlights, and what people said.`;
  return {
    ...defaultMetadata,
    title,
    description,
    alternates: { canonical: `/reports/${id}` },
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url: `${siteConfig.url}/reports/${id}`,
      type: "article",
      publishedTime: report.publishedAt.toISOString(),
    },
    twitter: { ...defaultMetadata.twitter, title, description },
  };
}

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  const article = getArticleSchema({
    headline: `${report.period}: the Nigeria Stability Index read ${report.overallScore.toFixed(1)} out of 10`,
    description: `Edition ${report.edition} of the Nigeria Stability Index.`,
    url: `${siteConfig.url}/reports/${id}`,
    datePublished: report.publishedAt.toISOString(),
  });
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Reports", url: `${siteConfig.url}/reports` },
    { name: report.period, url: `${siteConfig.url}/reports/${id}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderJsonLd(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbs) }} />
      <ReportArticle report={report} />
    </>
  );
}
