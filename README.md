# FinE Companion — Landing Page (Release Candidate)

A trusted educational companion that helps ordinary people understand their
financial lives. This Release Candidate delivers the **redesigned Landing Page**
and the surrounding V1 foundation (routing, bilingual layer, navigation, footer).

## Run

```bash
npm install
npm run dev
```

Then open the printed local URL. Production build: `npm run build` → `npm run preview`.

## What's in this RC

- **Redesigned Landing Page** built around the **"Horizon"** concept — a calm
  companion that walks beside you across financial time (today → this month →
  this year → your financial life).
- **Bilingual from day one** (English + 한국어) with a persistent language toggle.
  Preference is saved to `localStorage` only — no accounts, no backend, no analytics.
- **The public promise**, front and center: what FinE Companion will never do, and
  what it always does.
- **Real routes** for the modules — `/roadmap`, `/checkup`, `/learning` — as
  on-brand shells, ready to receive their module code without touching the Landing Page.

## Stack

- Vite + React 18
- react-router-dom 6
- Hand-built CSS design system (no UI framework)
- Inline SVG icons (zero icon dependencies)

## Structure

```
src/
  main.jsx                  app entry (router + language provider)
  App.jsx                   routes, scroll/hash manager, nav + footer
  index.css                 the full design system
  i18n/
    translations.js         all EN/KO copy
    LanguageContext.jsx     language state + persistence
  components/
    NavBar.jsx  Footer.jsx  LanguageToggle.jsx  ModuleShell.jsx  Icons.jsx
  pages/
    Landing.jsx             the redesigned landing page (this RC's focus)
    Roadmap.jsx  Checkup.jsx  Learning.jsx
```

## Design notes

- Palette: cool daylight paper, deep teal-green (trust/calm/growth), one wheat
  spark (the near sun on the horizon).
- Type: Newsreader / Nanum Myeongjo for the educator's "voice"; IBM Plex Sans /
  Plex Sans KR for the interface (one consistent voice across both scripts);
  IBM Plex Mono for evidence-style labels.
- Accessible by default: visible keyboard focus, reduced-motion respected,
  responsive to mobile.

The Final Product Test holds: even if FinE Lab never licensed a single technology,
this page exists to make the public platform clearly worth visiting.
