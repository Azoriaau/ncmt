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
| `Journey` | Pinned video (`PinnedVideo`) — plays once when scrolled into view, freezes on last frame; captions animate on scroll |
| `Coverage` | Background video loop at low opacity (`VideoLoop`) |
| `Contact` | Quote form (`ContactForm`) — POSTs to `/contact.php` |

## Media pipeline

Videos live in `public/videos/`, images in `public/images/`.

- **Hero** (`hero.mp4`): compress for web with
  `ffmpeg -i in.mp4 -crf 26 -preset slow -movflags +faststart -an hero.mp4`.
  Whenever it changes, regenerate the poster (first frame) and end still (last frame):
  `ffmpeg -i hero.mp4 -frames:v 1 -q:v 2 hero-poster.jpg` and
  `ffmpeg -sseof -0.05 -i hero.mp4 -frames:v 1 -q:v 2 -update 1 hero-still.jpg`
- **Journey** (`journey.mp4`): normal web compression:
  `ffmpeg -i in.mp4 -crf 22 -preset slow -movflags +faststart -an journey.mp4`

## Contact form

`public/contact.php` sends mail via PHP `mail()` on the host — no SMTP
credentials required. It validates input, strips header injection, has a
honeypot field and a 30s per-session throttle. Recipient and from address
are constants at the top of the file. It only works on the live host (or
any PHP server) — `next dev` serves it as a plain file.

## Build & deploy

```bash
npm run build   # static export to out/
```

Upload the **contents** of `out/` to `public_html` on the cPanel host
(`tar -czf site.tar.gz -C out . && upload && extract`).

Deployment notes:

- `robots.ts` / `sitemap.ts` carry `export const dynamic = "force-static"` —
  required for the export build.
- If every PHP request suddenly returns an empty 500: check `public_html/.user.ini`
  for a leftover Wordfence `auto_prepend_file` from the old WordPress install
  (this bit us once — LiteSpeed caches `.user.ini` for ~5 minutes after fixing).
