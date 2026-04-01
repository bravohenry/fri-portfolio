/**
 * [INPUT]: @/lib/content (Entry type), next/link
 * [OUTPUT]: EntryPage — full single-entry view; daily type renders Windows 2000 window chrome
 * [POS]: components/content/ shared renderer, consumed by diary/[slug], weekly/[slug] and daily/[slug]
 * [PROTOCOL]: update this header on change, then check CLAUDE.md
 */

import Link from "next/link";
import type { Entry } from "@/lib/content";
import { CoverImage } from "./CoverImage";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface EntryPageProps {
  entry: Entry;
  type: "diary" | "weekly" | "daily";
  backHref: string;
}

/* ------------------------------------------------------------------ */
/*  Win2K Window Chrome — only used for daily entries                 */
/* ------------------------------------------------------------------ */

function Win2KEntryPage({ entry, backHref }: { entry: Entry; backHref: string }) {
  return (
    <div className="win2k-desktop">
      {/* Desktop wallpaper teal background */}
      <div className="win2k-window">

        {/* ── Title Bar ───────────────────────────────────────────── */}
        <div className="win2k-titlebar" role="banner" aria-label="Window title bar">
          <div className="win2k-titlebar-left">
            {/* App icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="win2k-titlebar-icon">
              <rect x="1" y="1" width="6" height="6" fill="#fff" />
              <rect x="9" y="1" width="6" height="6" fill="#ff0" />
              <rect x="1" y="9" width="6" height="6" fill="#f00" />
              <rect x="9" y="9" width="6" height="6" fill="#0f0" />
            </svg>
            <span className="win2k-titlebar-title">{entry.title} — Daily Briefing</span>
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
          <Link href={backHref} className="win2k-toolbar-btn" title="Back">
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
          <button className="win2k-toolbar-btn" title="Home">
            <span aria-hidden="true">⌂</span>
            <span className="win2k-toolbar-label">Home</span>
          </button>
          <div className="win2k-toolbar-sep" aria-hidden="true" />
          <button className="win2k-toolbar-btn" title="Print">
            <span aria-hidden="true">🖨</span>
            <span className="win2k-toolbar-label">Print</span>
          </button>
        </div>

        {/* ── Address Bar ─────────────────────────────────────────── */}
        <div className="win2k-addressbar" aria-label="Address bar">
          <label htmlFor="win2k-address" className="win2k-address-label">Address</label>
          <div className="win2k-address-field">
            <span className="win2k-address-globe" aria-hidden="true">🌐</span>
            <input
              id="win2k-address"
              className="win2k-address-input"
              readOnly
              value={`C:\\My Documents\\Daily\\${entry.slug}.txt`}
              aria-label="Current location"
            />
            <button className="win2k-address-go" aria-label="Go">Go</button>
          </div>
        </div>

        {/* ── Content Area ────────────────────────────────────────── */}
        <div className="win2k-content-area">

          {/* Left Explorer Panel */}
          <aside className="win2k-explorer-panel" aria-label="Explorer panel">
            <div className="win2k-explorer-header">Folders</div>
            <ul className="win2k-tree" role="tree" aria-label="Folder tree">
              <li role="treeitem" aria-expanded="true" className="win2k-tree-item win2k-tree-item-open">
                <span aria-hidden="true">📁</span> My Documents
              </li>
              <li role="treeitem" aria-expanded="true" className="win2k-tree-item win2k-tree-sub">
                <span aria-hidden="true">📂</span> Daily
              </li>
              <li role="treeitem" aria-selected="true" className="win2k-tree-item win2k-tree-sub win2k-tree-selected">
                <span aria-hidden="true">📄</span> {entry.slug}.txt
              </li>
            </ul>
            <hr className="win2k-explorer-hr" />
            <div className="win2k-detail-box" aria-label="File details">
              <div className="win2k-detail-title">{entry.slug}.txt</div>
              <div className="win2k-detail-info">Date: {entry.date}</div>
              <div className="win2k-detail-info">Type: Text Document</div>
              <div className="win2k-detail-info">Size: ~2 KB</div>
            </div>
          </aside>

          {/* Main Document Pane */}
          <main className="win2k-doc-pane" aria-label="Document content">
            {/* Cover image */}
            {entry.cover && (
              <div className="win2k-cover">
                <CoverImage src={entry.cover} className="win2k-cover-img" />
              </div>
            )}

            {/* Header */}
            <header className="win2k-doc-header">
              <time className="win2k-doc-date" dateTime={entry.date}>{entry.date}</time>
              <h1 className="win2k-doc-title">{entry.title}</h1>
              <div className="win2k-doc-divider" aria-hidden="true" />
            </header>

            {/* Body */}
            <div
              className="diary-content win2k-diary-content"
              dangerouslySetInnerHTML={{ __html: entry.content }}
            />
          </main>
        </div>

        {/* ── Status Bar ──────────────────────────────────────────── */}
        <div className="win2k-statusbar" role="status" aria-label="Status bar">
          <span className="win2k-status-item win2k-status-main">Done</span>
          <span className="win2k-status-item">Local intranet</span>
          <span className="win2k-status-item">100%</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function EntryPage({ entry, type, backHref }: EntryPageProps) {
  if (type === "daily") {
    return <Win2KEntryPage entry={entry} backHref={backHref} />;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-body)' }}>
      <article className="mx-auto max-w-2xl px-6 py-16">
        {/* -- nav --------------------------------------------------- */}
        <Link
          href={backHref}
          className="mb-8 inline-block font-vt323 text-sm tracking-widest text-neon-pink opacity-60 hover:opacity-100 transition-opacity"
        >
          &larr; BACK TO {type === "diary" ? "DIARY" : "WEEKLY"}
        </Link>

        {/* -- cover ------------------------------------------------- */}
        {entry.cover && (
          <div className="mb-8 overflow-hidden border max-h-72" style={{ borderColor: 'var(--border-cover)' }}>
            <CoverImage src={entry.cover} className="w-full" />
          </div>
        )}

        {/* -- meta -------------------------------------------------- */}
        <header className="mb-8">
          <time className="font-vt323 text-xs tracking-widest text-neon-coral opacity-70">
            {entry.date}
          </time>
          <h1 className="mt-2 font-vt323 text-2xl tracking-widest" style={{ color: 'var(--text-primary)' }}>
            {entry.title}
          </h1>
        </header>

        {/* -- body -------------------------------------------------- */}
        <div
          className="diary-content"
          dangerouslySetInnerHTML={{ __html: entry.content }}
        />
      </article>
    </div>
  );
}
