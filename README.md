# NCMT — North Central Midlands Transport

Marketing site for NCMT, a family-owned freight company in Western Australia.

**Live at [ncmt.com.au](https://ncmt.com.au)**

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) with React 19 and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) — theme colours are CSS variables in `src/app/globals.css`
- [Motion](https://motion.dev) for reveal/scroll animations
- Static export (`output: "export"`) — no server runtime

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

> **Gotcha:** Turbopack's dev cache can serve stale CSS after editing
> `globals.css` — if a theme change doesn't show up, stop the server,
> `rm -rf .next`, and start it again.

## Site structure

Single page (`src/app/page.tsx`) composed of sections in `src/components/`:

| Section | Notes |
|---|---|
| `Hero` | Full-screen video (`HeroVideo`) that plays once, then fades to a still of its last frame |
| `Services` | Three image cards |
| `Journey` | Pinned section with a scroll-drawn SVG route (Depot → Highway → Door); captions and waypoints animate in sync |
| `Coverage` | Background video loop at low opacity (`VideoLoop`) |
| `Contact` | Quote form (`ContactForm`) — POSTs to `/contact.php` |

## Media pipeline

Videos live in `public/videos/`, images in `public/images/`.

- **Hero** (`hero.mp4`): compress for web with
  `ffmpeg -i in.mp4 -crf 26 -preset slow -movflags +faststart -an hero.mp4`.
  Whenever it changes, regenerate the poster (first frame) and end still (last frame):
  `ffmpeg -i hero.mp4 -frames:v 1 -q:v 2 hero-poster.jpg` and
  `ffmpeg -sseof -0.05 -i hero.mp4 -frames:v 1 -q:v 2 -update 1 hero-still.jpg`

## Contact form

Handled by **Netlify Forms** — the form in `ContactForm.tsx` carries
`data-netlify="true"` / `form-name: quote`, which Netlify detects in the
prerendered HTML at deploy time. Submissions appear under Forms in the
Netlify dashboard; configure an email notification there to get enquiries
forwarded. The honeypot field (`company`) makes Netlify silently discard
bot submissions. Submitting only works on the deployed site.

## Build & deploy

Deploys on Netlify from this repo (`netlify.toml`: build `npm run build`,
publish `out/`). Push to `main` → Netlify builds and deploys.

Deployment notes:

- `robots.ts` / `sitemap.ts` carry `export const dynamic = "force-static"` —
  required for the export build.
