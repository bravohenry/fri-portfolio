/**
 * [INPUT]:  @/lib/content (getEntry, getSlugs), @/components/content/EntryPage
 * [OUTPUT]: Single daily digest page — SSG at /daily/[slug]
 * [POS]:    app/daily/[slug]/ route — renders one daily briefing by slug
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

import { getEntry, getSlugs } from "@/lib/content";
import { EntryPage } from "@/components/content/EntryPage";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await getSlugs("daily");
  return slugs.map((slug) => ({ slug }));
}

export default async function DailyEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getEntry("daily", slug);
  if (!entry) notFound();
  return <EntryPage entry={entry} type="daily" backHref="/daily" />;
}
