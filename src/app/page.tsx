/**
 * [INPUT]:  SystemHeader, HomeGrid, lib/stats, lib/content
 * [OUTPUT]: Root page — outer viewport shell + SystemHeader + HomeGrid (client skin-switcher)
 * [POS]:    Root page — delegates skin-aware layout to HomeGrid
 * [PROTOCOL]: Update this header on any layout change, then check CLAUDE.md
 */

import { SystemHeader } from "@/components/home/SystemHeader";
import { HomeGrid } from "@/components/home/HomeGrid";
import { getSiteStats, getDiaryFragments } from "@/lib/stats";
import { getEntries } from "@/lib/content";

export default async function Home() {
  const stats = getSiteStats();
  const weeklyEntries = await getEntries("weekly");
  const dailyEntries = await getEntries("daily");
  const diaryFragments = getDiaryFragments();

  return (
    <div className="flex flex-col overflow-auto md:overflow-hidden h-auto md:h-screen w-screen">
      <SystemHeader
        totalEntries={stats.totalEntries}
        totalWords={stats.totalWords}
        daysSinceLaunch={stats.daysSinceLaunch}
      />
      <HomeGrid
        stats={stats}
        diaryFragments={diaryFragments}
        weeklyEntries={weeklyEntries.map(({ slug, title, date, summary, cover }) => ({ slug, title, date, summary, cover }))}
        dailyEntries={dailyEntries.map(({ slug, title, date, summary }) => ({ slug, title, date, summary }))}
      />
    </div>
  );
}
