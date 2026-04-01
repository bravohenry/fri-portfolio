/**
 * [INPUT]: @/lib/content (Entry type), next/link, ./CoverImage
 * [OUTPUT]: EntryList — card-based list with cover images and glass panels
 * [POS]: components/content/ shared renderer, consumed by diary/page.tsx and weekly/page.tsx
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

import Link from "next/link";
import type { Entry } from "@/lib/content";
import { CoverImage } from "./CoverImage";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface EntryListProps {
  entries: Entry[];
  type: "diary" | "weekly" | "daily";
  title: string;
  subtitle: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EntryList({ entries, type, title, subtitle }: EntryListProps) {
  const latest = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-body)' }}>
      <div className="scanline-overlay" />

      <div className="mx-auto max-w-4xl px-5 py-12">
        {/* -- header ------------------------------------------------ */}
        <header className="mb-10">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 font-vt323 text-xs tracking-widest text-neon-coral/70 hover:text-neon-coral transition-colors"
          >
            <img
              src="https://unpkg.com/pixelarticons@1.8.1/svg/arrow-left.svg"
              className="pa-icon w-3 h-3"
              alt=""
              aria-hidden="true"
            />
            BACK TO FRI
          </Link>
          <h1
            className="font-vt323 text-3xl sm:text-4xl tracking-wider"
            style={{ color: 'var(--text-heading)' }}
          >
            {title}
          </h1>
          <p
            className="mt-2 text-sm max-w-prose leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {subtitle}
          </p>
          <div className="mt-4 h-px bg-neon-pink/25" />
        </header>

        {/* -- featured / latest ------------------------------------- */}
        {latest.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-vt323 text-xs tracking-widest text-neon-pink/60">
                LATEST
              </span>
              <div className="flex-1 h-px bg-neon-pink/15" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latest.map((entry, i) => (
                <Link
                  key={entry.slug}
                  href={`/${type}/${entry.slug}`}
                  className="group glass-panel flex flex-col overflow-hidden hover:border-neon-pink/50 transition-all"
                >
                  {entry.cover && (
                    <div
                      className="h-36 overflow-hidden border-b"
                      style={{ borderColor: 'var(--border-cover)' }}
                    >
                      <CoverImage src={entry.cover} className="group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <time className="font-vt323 text-[11px] tracking-widest text-neon-coral/80">
                        {entry.date}
                      </time>
                      <h2
                        className="mt-1.5 font-vt323 text-lg tracking-wide transition-colors leading-tight"
                        style={{ color: 'var(--text-card-title)' }}
                      >
                        {entry.title}
                      </h2>
                      {entry.summary && (
                        <p
                          className="mt-1.5 text-xs line-clamp-2 leading-relaxed"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {entry.summary}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-tech text-neon-pink/40 group-hover:text-neon-pink/70 transition-colors">
                        {i === 0 ? "NEW" : `#${entries.length - i}`}
                      </span>
                      <img
                        src="https://unpkg.com/pixelarticons@1.8.1/svg/arrow-right.svg"
                        className="pa-icon w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* -- archive list ------------------------------------------ */}
        {rest.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-vt323 text-xs tracking-widest text-neon-pink/60">
                ARCHIVE
              </span>
              <div className="flex-1 h-px bg-neon-pink/15" />
              <span
                className="font-tech text-[10px]"
                style={{ color: 'var(--text-dim)' }}
              >
                {entries.length} entries
              </span>
            </div>

            <div className="space-y-1">
              {rest.map((entry, i) => (
                <Link
                  key={entry.slug}
                  href={`/${type}/${entry.slug}`}
                  className="group flex items-center gap-4 py-2.5 px-3 border border-transparent transition-all"
                >
                  {entry.cover ? (
                    <div
                      className="w-14 h-10 shrink-0 overflow-hidden border"
                      style={{ borderColor: 'var(--border-cover)' }}
                    >
                      <CoverImage src={entry.cover} />
                    </div>
                  ) : (
                    <div
                      className="w-14 h-10 shrink-0 border"
                      style={{ background: 'var(--bg-placeholder)', borderColor: 'var(--border-subtle)' }}
                    />
                  )}
                  <time className="font-vt323 text-[11px] tracking-widest text-neon-coral/50 shrink-0 w-20">
                    {entry.date}
                  </time>
                  <h3
                    className="font-vt323 text-sm tracking-wide transition-colors flex-1 truncate"
                    style={{ color: 'var(--text-card-title)' }}
                  >
                    {entry.title}
                  </h3>
                  <span
                    className="font-tech text-[9px] shrink-0"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    #{entries.length - 3 - i}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {entries.length === 0 && (
          <div className="glass-panel p-10 text-center">
            <p
              className="font-vt323 text-sm tracking-widest"
              style={{ color: 'var(--text-dim)' }}
            >
              NO ENTRIES YET — AWAITING FIRST DISPATCH.
            </p>
          </div>
        )}

        <footer className="mt-12 pt-6 border-t border-neon-pink/10">
          <p
            className="text-[10px] font-tech"
            style={{ color: 'var(--text-dim)' }}
          >
            {entries.length} entries · powered by FRI
          </p>
        </footer>
      </div>
    </div>
  );
}
