/**
 * [INPUT]: fs, path (node builtins), content directory
 * [OUTPUT]: getSiteStats() — real-time site metrics from content/
 * [POS]: lib/stats — build-time stats for homepage dashboard
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const LAUNCH_DATE = new Date(2026, 0, 30, 22, 0, 0);

export interface SiteStats {
  diaryCount: number;
  weeklyCount: number;
  dailyCount: number;
  totalEntries: number;
  totalWords: number;
  daysSinceLaunch: number;
  lastEntryDate: string;
  lastEntryAge: string;
  thisWeekCount: number;
  thisMonthCount: number;
  dailyActivity: { date: string; count: number }[];
  cachedUrls: number;
}

function countWords(text: string): number {
  const stripped = text.replace(/^---[\s\S]*?---\n/, "");
  const cjk = (stripped.match(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
  const latin = stripped.replace(/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]/g, "")
    .split(/\s+/).filter(Boolean).length;
  return cjk + latin;
}

function getFiles(type: string): string[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
}

function getDateFromFilename(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function relativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return "just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return `${Math.floor(diffD / 7)}w ago`;
}

export function getSiteStats(): SiteStats {
  const diaryFiles = getFiles("diary");
  const weeklyFiles = getFiles("weekly");
  const dailyFiles = getFiles("daily");
  const allFiles = [
    ...diaryFiles.map((f) => ({ f, dir: "diary" })),
    ...weeklyFiles.map((f) => ({ f, dir: "weekly" })),
    ...dailyFiles.map((f) => ({ f, dir: "daily" })),
  ];

  let totalWords = 0;
  const dates: string[] = [];

  for (const { f, dir } of allFiles) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, dir, f), "utf8");
    totalWords += countWords(raw);
    // extract date from frontmatter, fallback to filename
    const dateMatch = raw.match(/^date:\s*(.+)$/m);
    const dateStr = dateMatch ? dateMatch[1].trim().replace(/^["']|["']$/g, "") : getDateFromFilename(f);
    if (!isNaN(new Date(dateStr).getTime())) {
      dates.push(dateStr);
    }
  }

  dates.sort().reverse();
  const lastDate = dates[0] || "unknown";

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);

  const thisWeekCount = dates.filter((d) => new Date(d) >= weekAgo).length;
  const thisMonthCount = dates.filter((d) => new Date(d) >= monthAgo).length;

  const daysSinceLaunch = Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / 86400000);

  // daily activity: last 30 days, each = { date, count }
  const dailyActivity: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now.getTime() - i * 86400000);
    const dayStr = day.toISOString().slice(0, 10);
    const count = dates.filter((d) => d === dayStr).length;
    dailyActivity.push({ date: dayStr, count });
  }

  // count cached OG URLs
  const cacheDir = path.join(process.cwd(), ".cache", "og");
  let cachedUrls = 0;
  if (fs.existsSync(cacheDir)) {
    cachedUrls = fs.readdirSync(cacheDir).filter((f) => f.endsWith(".json")).length;
  }

  return {
    diaryCount: diaryFiles.length,
    weeklyCount: weeklyFiles.length,
    dailyCount: dailyFiles.length,
    totalEntries: allFiles.length,
    totalWords: Math.round(totalWords / 100) * 100,
    daysSinceLaunch,
    lastEntryDate: lastDate,
    lastEntryAge: relativeTime(lastDate),
    thisWeekCount,
    thisMonthCount,
    dailyActivity,
    cachedUrls,
  };
}

export function getDiaryFragments(): string[] {
  const dir = path.join(CONTENT_DIR, "diary");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const fragments: string[] = [];

  for (const f of files) {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const body = raw.replace(/^---[\s\S]*?---\n/, "");
    const lines = body
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 4 && !l.startsWith("#") && !l.startsWith("---"));
    for (const line of lines) {
      // break long lines into chunks of ~20-40 chars
      for (let i = 0; i < line.length; i += 25) {
        const chunk = line.slice(i, i + 25);
        if (chunk.length > 3) fragments.push(chunk);
      }
    }
  }

  // shuffle and take ~200 fragments
  for (let i = fragments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fragments[i], fragments[j]] = [fragments[j], fragments[i]];
  }
  return fragments.slice(0, 200);
}
