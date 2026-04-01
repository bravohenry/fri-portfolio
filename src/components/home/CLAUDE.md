# components/home/
> L2 | Parent: src/components/CLAUDE.md

Homepage client components — stateful UI with timers, animations, and live data.

## Members

SystemHeader.tsx: Top bar — dual-skin: XP titlebar+menubar OR sci-fi logo+gauges. Reads `useSkin()`. Props: `totalEntries`, `totalWords`, `daysSinceLaunch`
IdentityMatrix.tsx: Identity panel with FRI specs and cycling quote — dual-skin (XP list view / sci-fi glass). Props: `diaryCount`, `weeklyCount`, `lastEntryAge`
TypeWriter.tsx: Type/delete animation for quote strings, consumed by IdentityMatrix. Dual-skin (XP monospace / sci-fi VT323)
ArcReactor.tsx: Center-column core — dual-skin: XP Media Player chrome or sci-fi reactor rings. Circular video, crosshair, uptime counter
Diagnostics.tsx: Right-column panel — dual-skin (XP list/groupbox / sci-fi glass). Real stat boxes, bar chart, service status. Props from `getSiteStats()`
NetworkTraffic.tsx: DEPRECATED — no longer imported anywhere. Animated bar chart was replaced by static `dailyActivity` bars in Diagnostics
ActiveModules.tsx: Left-column bottom panel — dual-skin (XP detail view / sci-fi jittery bars). Used in scifi skin; WidgetPanel replaces it in xp skin
Terminal.tsx: Center-column bottom panel — dual-skin (XP CMD window / sci-fi glass panel). AI chat + slash commands. Props: `stats: SiteStats`
CoreDirectives.tsx: Right-column bottom panel — dual-skin (XP bordered cards / sci-fi glass directives). Social links footer. Client component
WidgetPanel.tsx: Left-column bottom panel — XP-only tabbed browser (Daily / Weekly / Stack). Used in xp skin; ActiveModules used in scifi skin
XPTaskbar.tsx: Windows XP taskbar — xp skin only (returns null in scifi skin). Start button + system tray
HomeGrid.tsx: Client skin-switcher that picks WidgetPanel vs ActiveModules for left column and renders XPTaskbar. Bridges server page.tsx to client layout

[PROTOCOL]: Update this file on any member change, then check parent CLAUDE.md
