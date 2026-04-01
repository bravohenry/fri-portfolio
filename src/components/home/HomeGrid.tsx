/**
 * [INPUT]: useSkin, all home components, SiteStats, ContentEntry
 * [OUTPUT]: HomeGrid — client skin-aware grid that swaps left column and taskbar per skin
 * [POS]: home/ layout bridge between server page.tsx and skin-conditional client components
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

"use client";

import { useSkin } from "@/lib/skin";
import { IdentityMatrix } from "@/components/home/IdentityMatrix";
import { WidgetPanel } from "@/components/home/WidgetPanel";
import { ActiveModules } from "@/components/home/ActiveModules";
import ArcReactor from "@/components/home/ArcReactor";
import { Terminal } from "@/components/home/Terminal";
import { Diagnostics } from "@/components/home/Diagnostics";
import { CoreDirectives } from "@/components/home/CoreDirectives";
import XPTaskbar from "@/components/home/XPTaskbar";
import type { SiteStats } from "@/lib/stats";

interface ContentEntry {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  cover?: string;
}

interface HomeGridProps {
  stats: SiteStats;
  diaryFragments: string[];
  weeklyEntries: ContentEntry[];
  dailyEntries: ContentEntry[];
}

export function HomeGrid({ stats, diaryFragments, weeklyEntries, dailyEntries }: HomeGridProps) {
  const { skin } = useSkin();

  return (
    <>
      <main className="flex-1 min-h-0 flex flex-col p-2 md:p-3 pb-2 md:pb-2 relative z-10 overflow-y-auto md:overflow-hidden">
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 grid-rows-auto md:grid-rows-[1fr] gap-3 overflow-visible md:overflow-hidden mobile-column-layout">

          {/* Left column */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-3 min-h-0 order-2 md:order-1">
            <IdentityMatrix
              diaryCount={stats.diaryCount}
              weeklyCount={stats.weeklyCount}
              lastEntryAge={stats.lastEntryAge}
            />
            {skin === "xp" ? (
              <WidgetPanel
                dailyEntries={dailyEntries}
                weeklyEntries={weeklyEntries}
              />
            ) : (
              <ActiveModules />
            )}
          </div>

          {/* Center column */}
          <div
            id="session-column"
            className="col-span-12 md:col-span-6 flex flex-col min-h-0 relative order-1 md:order-2"
          >
            <ArcReactor fragments={diaryFragments} />
            <Terminal stats={stats} />
          </div>

          {/* Right column */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-3 min-h-0 order-3">
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

      {/* XP Taskbar — only visible in xp skin (hidden by CSS in scifi skin) */}
      <XPTaskbar />
    </>
  );
}
