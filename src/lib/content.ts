/**
 * [INPUT]: fs, path (node builtins), ./markdown (renderMarkdown — async)
 * [OUTPUT]: Entry interface, getEntries(), getEntry(), getSlugs()
 * [POS]: lib/content — content pipeline, reads markdown from content/ dir,
 *        parses frontmatter, returns rendered HTML entries with link previews
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

import fs from "fs";
import path from "path";
import { renderMarkdown } from "./markdown";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Entry {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  cover?: string;
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CONTENT_DIR = path.join(process.cwd(), "content");

/* ------------------------------------------------------------------ */
/*  Frontmatter parser                                                 */
/* ------------------------------------------------------------------ */

function parseFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, content: raw };

  const data: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...vals] = line.split(":");
    if (key && vals.length) {
      data[key.trim()] = vals.join(":").trim().replace(/^["']|["']$/g, "");
    }
  });

  const content = raw.replace(/^---[\s\S]*?---\n/, "");
  return { data, content };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export async function getEntries(
  type: "diary" | "weekly" | "daily"
): Promise<Entry[]> {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  return Promise.all(
    files.map(async (f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, content } = parseFrontmatter(raw);
      const slug = f.replace(/\.md$/, "");
      return {
        slug,
        title: data.title || slug,
        date: data.date || slug,
        summary: data.summary,
        cover: data.cover,
        content: await renderMarkdown(content),
      };
    }),
  );
}

export async function getEntry(
  type: string,
  slug: string
): Promise<Entry | null> {
  const filePath = path.join(CONTENT_DIR, type, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date || slug,
    summary: data.summary,
    cover: data.cover,
    content: await renderMarkdown(content),
  };
}

export async function getSlugs(type: string): Promise<string[]> {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
