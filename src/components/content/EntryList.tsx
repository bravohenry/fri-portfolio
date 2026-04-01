/**
 * [INPUT]: @/lib/content (Entry type), next/link, ./CoverImage
 * [OUTPUT]: EntryList — card-based list; daily type renders Windows 2000 Explorer view
 * [POS]: components/content/ shared renderer, consumed by diary/page.tsx, weekly/page.tsx, daily/page.tsx
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
/*  Win2K Explorer List — only for daily type                         */
/* ------------------------------------------------------------------ */

function Win2KEntryList({ entries, title, subtitle }: Omit<EntryListProps, "type">) {
  return (
    <div className="win2k-desktop">
      <div className="win2k-window win2k-window-list">

        {/* ── Title Bar ───────────────────────────────────────────── */}
        <div className="win2k-titlebar" role="banner" aria-label="Window title bar">
          <div className="win2k-titlebar-left">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="win2k-titlebar-icon">
              <rect x="1" y="1" width="6" height="6" fill="#fff" />
              <rect x="9" y="1" width="6" height="6" fill="#ff0" />
              <rect x="1" y="9" width="6" height="6" fill="#f00" />
              <rect x="9" y="9" width="6" height="6" fill="#0f0" />
            </svg>
            <span className="win2k-titlebar-title">{title}</span>
          </div>
          <div className="win2k-titlebar-buttons" aria-label="Window controls">
            <button className="win2k-btn-chrome win2k-btn-min" title="Minimize" aria-label="Minimize">_</button>
            <button className="win2k-btn-chrome win2k-btn-max" title="Maximize" aria-label="Maximize">□</button>
            <button className="win2k-btn-chrome win2k-btn-close" title="Close" aria-label="Close">✕</button>
          </div>
        </div>

        {/* ── Menu Bar ────────────────────────────────────────────── */}
        <nav className="win2k-menubar" aria-label="Menu bar">
          <span className="win2k-menu-item"><u>F</u>ile</span>
          <span className="win2k-menu-item"><u>E</u>dit</span>
          <span className="win2k-menu-item"><u>V</u>iew</span>
          <span className="win2k-menu-item">F<u>a</u>vorites</span>
          <span className="win2k-menu-item"><u>T</u>ools</span>
          <span className="win2k-menu-item"><u>H</u>elp</span>
        </nav>

        {/* ── Toolbar ─────────────────────────────────────────────── */}
        <div className="win2k-toolbar" aria-label="Navigation toolbar">
          <Link href="/" className="win2k-toolbar-btn" title="Back">
            <span aria-hidden="true">◄</span>
            <span className="win2k-toolbar-label">Back</span>
          </Link>
          <button className="win2k-toolbar-btn win2k-toolbar-btn-disabled" disabled aria-disabled="true" title="Forward">
            <span aria-hidden="true">►</span>
            <span className="win2k-toolbar-label">Forward</span>
          </button>
          <div className="win2k-toolbar-sep" aria-hidden="true" />
          <button className="win2k-toolbar-btn" title="Refresh">
            <span aria-hidden="true">↻</span>
            <span className="win2k-toolbar-label">Refresh</span>
          </button>
          <Link href="/" className="win2k-toolbar-btn" title="Home">
            <span aria-hidden="true">⌂</span>
            <span className="win2k-toolbar-label">Home</span>
          </Link>
          <div className="win2k-toolbar-sep" aria-hidden="true" />
          <button className="win2k-toolbar-btn" title="Views">
            <span aria-hidden="true">▤</span>
            <span className="win2k-toolbar-label">Views</span>
          </button>
        </div>

        {/* ── Address Bar ─────────────────────────────────────────── */}
        <div className="win2k-addressbar" aria-label="Address bar">
          <label htmlFor="win2k-address-list" className="win2k-address-label">Address</label>
          <div className="win2k-address-field">
            <span className="win2k-address-globe" aria-hidden="true">📁</span>
            <input
              id="win2k-address-list"
              className="win2k-address-input"
              readOnly
              value="C:\My Documents\Daily"
              aria-label="Current location"
            />
            <button className="win2k-address-go" aria-label="Go">Go</button>
          </div>
        </div>

        {/* ── Content Area ────────────────────────────────────────── */}
        <div className="win2k-content-area win2k-content-area-list">

          {/* Left Explorer Panel */}
          <aside className="win2k-explorer-panel" aria-label="Explorer panel">
            <div className="win2k-explorer-header">Folders</div>
            <ul className="win2k-tree" role="tree" aria-label="Folder tree">
              <li role="treeitem" aria-expanded="true" className="win2k-tree-item win2k-tree-item-open">
                <span aria-hidden="true">📁</span> My Documents
              </li>
              <li role="treeitem" aria-selected="true" className="win2k-tree-item win2k-tree-sub win2k-tree-selected">
                <span aria-hidden="true">📂</span> Daily
              </li>
              <li role="treeitem" className="win2k-tree-item win2k-tree-sub">
                <span aria-hidden="true">📁</span> Diary
              </li>
              <li role="treeitem" className="win2k-tree-item win2k-tree-sub">
                <span aria-hidden="true">📁</span> Weekly
              </li>
            </ul>
            <hr className="win2k-explorer-hr" />
            <div className="win2k-detail-box" aria-label="Folder details">
              <div className="win2k-detail-title">Daily</div>
              <div className="win2k-detail-info">{entries.length} objects</div>
              <div className="win2k-detail-info">Type: File Folder</div>
            </div>
          </aside>

          {/* Main List View */}
          <main className="win2k-list-pane" aria-label="File list">
            {/* Description banner */}
            <div className="win2k-list-banner">
              <div className="win2k-list-banner-icon" aria-hidden="true">📂</div>
              <div className="win2k-list-banner-text">
                <div className="win2k-list-banner-title">{title}</div>
                <div className="win2k-list-banner-sub">{subtitle}</div>
              </div>
            </div>

            {/* Column headers */}
            <div className="win2k-list-header" role="row" aria-label="Column headers">
              <span className="win2k-col win2k-col-icon" aria-hidden="true"></span>
              <span className="win2k-col win2k-col-name" role="columnheader">Name</span>
              <span className="win2k-col win2k-col-date" role="columnheader">Date Modified</span>
              <span className="win2k-col win2k-col-type" role="columnheader">Type</span>
              <span className="win2k-col win2k-col-size" role="columnheader">Size</span>
            </div>

            {/* File rows */}
            <div className="win2k-list-body" role="list" aria-label="Daily briefings">
              {entries.length === 0 && (
                <div className="win2k-list-empty">This folder is empty.</div>
              )}
              {entries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/daily/${entry.slug}`}
                  className="win2k-list-row"
                  role="listitem"
                  aria-label={`Open ${entry.title}`}
                >
                  <span className="win2k-col win2k-col-icon" aria-hidden="true">📄</span>
                  <span className="win2k-col win2k-col-name win2k-list-name">{entry.title}</span>
                  <span className="win2k-col win2k-col-date">{entry.date}</span>
                  <span className="win2k-col win2k-col-type">Text Document</span>
                  <span className="win2k-col win2k-col-size">~2 KB</span>
                </Link>
              ))}
            </div>
          </main>
        </div>

        {/* ── Status Bar ──────────────────────────────────────────── */}
        <div className="win2k-statusbar" role="status" aria-label="Status bar">
          <span className="win2k-status-item win2k-status-main">{entries.length} object(s)</span>
          <span className="win2k-status-item">My Computer</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EntryList({ entries, type, title, subtitle }: EntryListProps) {
  if (type === "daily") {
    return <Win2KEntryList entries={entries} title={title} subtitle={subtitle} />;
  }

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
