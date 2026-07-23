# Tony Lau — Personal Portfolio

## Project structure

```
portfolio/
├── index.html              ← Single self-contained site (OD web-prototype skill)
├── data.json               ← ALL dynamic content lives here — edit this to update the site
├── CLAUDE.md               ← You're reading this
├── 2026 Tony Lau Resume.pdf
└── assets/
    ├── photos/             ← Profile photos (headshot, etc.)
    ├── events/             ← Event photos (conferences, meetups, hackathons)
    ├── projects/           ← Project screenshots and thumbnails
    ├── videos/             ← Video thumbnails (actual videos are on YouTube)
    └── geo/
        └── land-mask.png   ← Equirectangular land mask (2048×1024, white=land/black=sea),
                              baked from Natural Earth 1:50M (world-atlas land-50m.json).
                              Public domain — no attribution required. Used by the globe.
```

## assets/geo/land-mask.png

Baked equirectangular land mask for the particle globe. 2048×1024, white = land,
black = sea. Source: Natural Earth 1:50M via the `world-atlas` package
(`land-50m.json` TopoJSON). The globe loads this PNG directly at runtime and
samples it to decide which Fibonacci-sphere points are on land.

To regenerate (Natural Earth is public domain, no attribution needed):

```bash
cd /tmp && mkdir gen-mask && cd gen-mask && npm init -y
npm install topojson-client sharp
# save the gen.js script (TopoJSON decode → scanline rasterize → sharp PNG encode)
node gen.js assets/geo/land-mask.png
```

The generation script is NOT committed — only the baked PNG. Re-run only if you
want a different resolution or a coarser/finer Natural Earth scale (e.g. 1:110M
for a lighter file, 1:10M for max detail).

## How to update the site

This portfolio uses a **data-driven architecture**. All content is defined in `data.json` and rendered by `index.html` at load time. To update content:

### Adding a new project
1. Add an entry to `projects.grid[]` in `data.json`:
   ```json
   {
     "name": "Project Name",
     "desc": "One-sentence description of what it does.",
     "tags": ["TypeScript", "AI"],
     "github": "https://github.com/Intrepidcanadian/repo-name",
     "image": "assets/projects/screenshot.png"
   }
   ```
2. Optionally drop a screenshot into `assets/projects/`

### Adding an event
1. Add an entry to `events[]` in `data.json`:
   ```json
   {
     "type": "hosted/speaking",
     "title": "Event Name",
     "location": "Toronto",
     "date": "2026",
     "desc": "What happened at this event.",
     "image": "assets/events/photo.jpg"
   }
   ```
   `type` must be one of: `hosted/speaking`, `attended` (these match the filter buttons and badge styles in `index.html`)
2. Drop the photo into `assets/events/`

### Adding a video
There are three video collections in `data.json`:
- `videos[]` — "AI-produced videos" grid (purely creative productions, e.g. StarCraft broadcasts)
- `videosSoftware[]` — "Software · Hackathons · Other" grid (hackathon demos, appearances)
- `tinkering[]` — "Tinkering" grid of locally-hosted mp4s (`video` + `poster` fields; keep mp4s ≤ ~10 MB, 720p)

1. Add an entry to the right array in `data.json`:
   ```json
   {
     "title": "Video Title",
     "desc": "Short description",
     "url": "https://youtu.be/VIDEO_ID",
     "thumbnail": "assets/videos/thumb.jpg"
   }
   ```
   Instead of a single `thumbnail`, an entry may use `"thumbnails": ["a.webp", "b.webp"]` —
   the card then shows the images side by side (used for video screenshots).
   If both are omitted, the YouTube thumbnail is used automatically.
2. Optionally drop thumbnails/screenshots into `assets/videos/`

### Updating profile photo
1. Drop the photo into `assets/photos/`
2. Set `profile.photo` in `data.json` to the relative path: `"assets/photos/headshot.jpg"`

### Updating experience
Edit the `experience[]` array in `data.json`. Each entry has: `date`, `title`, `desc`, `org`.

### Updating skills
Edit the `profile.skills[]` array in `data.json`.

## Design system

Built with Open Design's `web-prototype` skill. Key rules:
- **6 token variables**: `--bg`, `--surface`, `--fg`, `--muted`, `--border`, `--accent`
- **Type**: Serif display (Iowan Old Style/Charter/Georgia), sans body (Inter), mono for meta
- **Accent budget**: Max 2 uses per screen (eyebrow + CTA)
- **Cards**: `.card` class with `--surface` bg, 1px `--border`, `--radius-lg`
- **No external dependencies** — single HTML file, zero JS frameworks

## Deployment

Static HTML — deploy anywhere:
- **GitHub Pages**: push to `gh-pages` branch
- **Vercel**: `vercel --prod` from this directory
- **Netlify**: drag and drop the folder
