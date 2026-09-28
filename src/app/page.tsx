/**
 * [INPUT]:  All home components, lib/stats for real metrics
 * [OUTPUT]: Viewport-locked 3-column dashboard homepage with live data
 * [POS]:    Root page — assembles the FRI interface grid. Viewport lock lives HERE,
 *           not in layout.tsx, so content pages can scroll normally.
 * [PROTOCOL]: Update this header on any layout change, then check CLAUDE.md
 */

import { SystemHeader } from "@/components/home/SystemHeader";
import { IdentityMatrix } from "@/components/home/IdentityMatrix";
import { WidgetPanel } from "@/components/home/WidgetPanel";
import ArcReactor from "@/components/home/ArcReactor";
import { Terminal } from "@/components/home/Terminal";
import { Diagnostics } from "@/components/home/Diagnostics";
import { CoreDirectives } from "@/components/home/CoreDirectives";
import { getSiteStats, getDiaryFragments } from "@/lib/stats";
import { getEntries } from "@/lib/content";

export default async function Home() {
  const stats = getSiteStats();
  const weeklyEntries = await getEntries("weekly");
  const dailyEntries = await getEntries("daily");
  const diaryFragments = getDiaryFragments();

  return (
    <div className="flex flex-col overflow-auto md:overflow-hidden h-auto md:h-screen w-screen">
      <div className="scanline-overlay" />
      <div className="scanner-bar" />

      <SystemHeader
        totalEntries={stats.totalEntries}
        totalWords={stats.totalWords}
        daysSinceLaunch={stats.daysSinceLaunch}
      />

      <main className="flex-1 min-h-0 flex flex-col p-4 md:p-6 pb-4 md:pb-6 relative z-10 overflow-y-auto md:overflow-hidden">
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 grid-rows-auto md:grid-rows-[1fr] gap-6 overflow-visible md:overflow-hidden mobile-column-layout">

          <div className="col-span-12 md:col-span-3 flex flex-col gap-6 min-h-0 order-2 md:order-1">
            <IdentityMatrix
              diaryCount={stats.diaryCount}
              weeklyCount={stats.weeklyCount}
              lastEntryAge={stats.lastEntryAge}
            />
            <WidgetPanel
              dailyEntries={dailyEntries.map(({ slug, title, date, summary }) => ({ slug, title, date, summary }))}
              weeklyEntries={weeklyEntries.map(({ slug, title, date, summary, cover }) => ({ slug, title, date, summary, cover }))}
            />
          </div>

          <div
            id="session-column"
            className="col-span-12 md:col-span-6 flex flex-col min-h-0 relative order-1 md:order-2"
          >
            <ArcReactor fragments={diaryFragments} />
            <Terminal stats={stats} />
          </div>

          <div className="col-span-12 md:col-span-3 flex flex-col gap-6 min-h-0 order-3">
            <Diagnostics
              thisWeekCount={stats.thisWeekCount}
              thisMonthCount={stats.thisMonthCount}
              dailyActivity={stats.dailyActivity}
              diaryCount={stats.diaryCount}
              weeklyCount={stats.weeklyCount}
              cachedUrls={stats.cachedUrls}
            />
            <CoreDirectives />
          </div>

        </div>
      </main>
    </div>
  );
}
