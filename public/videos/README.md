# Seedance clips — drop zone

The site renders gradient placeholders until these files exist. Drop the
generated clips in with these exact names:

| File | Used in | Concept | Notes |
|---|---|---|---|
| `hero.mp4` | Hero (full-screen loop) | Dawn convoy on outback highway | Landscape 16:9, ~8s seamless loop. Keep upper-right uncluttered (headline sits lower-left). |
| `hero-poster.jpg` | Hero poster frame | First frame of hero.mp4 | `ffmpeg -i hero.mp4 -frames:v 1 hero-poster.jpg` |
| `journey.mp4` | Scroll-scrub section | One parcel's journey (pickup → highway → delivery) | Must be encoded for scrubbing: `ffmpeg -i in.mp4 -g 1 -crf 20 -movflags +faststart journey.mp4` |
| `coverage.mp4` | Coverage background | Map-to-highway transition | Rendered at 40% opacity behind text — high contrast is fine. |
| `service-general.mp4` | Services card 1 | Macro cargo (straps, pallet wrap) | 16:9, short loop. |
| `service-regional.mp4` | Services card 2 | Truck arriving in regional town | 16:9, short loop. |
| `service-dedicated.mp4` | Services card 3 | Depot at night, light trails | 16:9, short loop. |

General tips:
- Compress for web: `ffmpeg -i in.mp4 -vcodec libx264 -crf 28 -preset slow -movflags +faststart -an out.mp4` (target < 5 MB for loops).
- Strip audio (`-an`) — everything plays muted anyway.
- For seamless loops, generate with the same first and last frame in Seedance.
