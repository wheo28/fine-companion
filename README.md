# FinE Companion — a calmer way to understand your money

A calm, public companion that helps ordinary families understand their financial
lives — a patient guide sitting beside you, not financial software. It teaches,
never sells, and nothing you do here ever leaves your device.

This is the **Reimagination** build: the architecture, philosophy, and mission are
unchanged, and the entire experience — visual identity, layout, hierarchy, and
interaction — has been rebuilt.

## Run

```bash
npm install
npm run dev        # local dev
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

## The identity — "a public guide across horizons"

The design is drawn from the world of trusted public institutions (libraries,
national-park wayfinding, government digital services) and from the product's own
language of *horizons, paths, seasons, and returning*.

- **Structure is deep spruce green**, not near-black — the calm of an institution.
- **Interaction is a lake blue**; **warmth is amber lamplight**, used as the sun
  and for gentle emphasis, never as decoration.
- **Type**: *Newsreader* carries the companion's reading-room voice; *Public Sans*
  (the U.S. government design-system face) runs the interface; letterspaced caps
  do the wayfinding. Korean speaks the same voice in Nanum Myeongjo / Noto Sans KR.
- **Signature — the Horizon**: a low sun that rises on arrival and returns as the
  *trail* you walk in your roadmap. You never have to see the whole staircase.

## How it's organized

Around **human situations**, not financial categories — "My money disappears every
month," "Am I still properly protected?", "Am I doing enough for the future?" —
grouped into galleries by how money *feels*.

The whole product is one gentle loop:

> **Arrive** (a calm entrance) → **Understand** (a short, honest checkup) →
> **See yourself clearly** (strengths first, one small step, how it connects) →
> **Walk** (a roadmap trail across horizons) → **Return** (a monthly check-in) →
> and only then, **Deepen** (topics & the reading room).

Every screen offers a way back into the loop. Nothing is ever "finished."

## Stack & privacy

- **Vite + React 18 + React Router.**
- **Bilingual (English / 한국어)** from the first screen; preference saved to
  `localStorage` only.
- **Private by design**: no accounts, no backend, no analytics, no tracking. Every
  answer, every explored topic, and your roadmap stay in your browser.
- **Educational only**: no financial, investment, insurance, tax, or legal advice,
  and no products are ever sold or recommended.

## Deploy (Vercel)

`vercel.json` is preconfigured (framework `vite`, output `dist`, SPA rewrites to
`index.html`). Import the repo into Vercel, or run `vercel` from this directory.
