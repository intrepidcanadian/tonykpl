# Tony Lau — Personal Portfolio

## Project structure

```
portfolio/
├── index.html              ← Single self-contained site (OD web-prototype skill)
├── other/index.html        ← /other — "Beyond the resume" personal photos
├── posts/index.html        ← /posts — LinkedIn posts & highlights
├── data.json               ← ALL dynamic content lives here — edit this to update the site
├── CLAUDE.md               ← You're reading this
├── 2026 Tony Lau Resume.pdf
└── assets/
    ├── decks/              ← Slide decks (PDF) linked from project cards
    ├── photos/             ← Profile photos (headshot, etc.)
    ├── events/             ← Event photos (conferences, meetups, hackathons)
    ├── projects/           ← Project screenshots and thumbnails
    ├── videos/             ← Video thumbnails (actual videos are on YouTube)
    └── geo/
        └── land-mask.png   ← Equirectangular land mask (2048×1024, white=land/black=sea),
                              baked from Natural Earth 1:50M (world-atlas land-50m.json).
                              Public domain — no attribution required. Used by the globe.
```

## Running locally

There is no package.json and no build step — the site is a static folder. But you
can't just double-click `index.html`: the page `fetch()`es `data.json` at load time,
and browsers block that on `file://`, so all dynamic content (photos, videos, events)
stays empty. Serve the folder over HTTP instead:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173. Any static server works (`npx serve .`,
`npx http-server`); the port number is arbitrary.

## Media pipeline

All raster images on the site are webp. When adding a photo or screenshot,
convert it with ffmpeg — max 1200px wide, quality 80:

```bash
ffmpeg -i source.jpg -vf "scale='min(1200,iw)':-2" -quality 80 assets/events/Name.webp
```

Portrait photos: crop dead space (ceilings, empty walls) so faces land in the
card's cover-crop — e.g. `-vf "crop=iw:ih*0.6:0:ih*0.4,scale=..."`. Local
tinkering videos: h264 mp4, ≤ ~10 MB, 720p, `-movflags +faststart`.
Videos hosted on YouTube need no local file — cards fall back to the YouTube
thumbnail automatically.

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

### The workstation is the Projects section

There are no project/video/demo card grids any more — the keyboard IS the
section. Everything with a key mapping shows on the CRT monitor, and nothing
mapped to a key is duplicated as a card elsewhere on the page:

| Keys | Source | Shown as |
|---|---|---|
| A–Z letters | `projects.featured` + `projects.grid[]` (`key`) | screenshot + tags + repo/live links |
| — | `projects.featured` | loads on the monitor at page load, badged "Featured project" |
| A–Z letters | `tinkering[]` (`key`) | local mp4 playing as a "channel" |
| A–Z letters | `videosSoftware[]` (`key`) | YouTube embed, or a strip of `thumbnails` |
| F1–F12 | `videos[]`, in array order | YouTube embed |
| Numpad 1–9, 0 | any `events[]` / `videosSoftware[]` / `posts[]` entry with a `hack` number | YouTube embed if the entry has one, else a local mp4, else photo + description + link |

The keyboard is drawn full-size (Esc, F1–F12, number row, Tab/Caps/Shift and the
modifier row). The modifiers are chassis — nothing maps to them, and pressing
one glitches the CRT or kicks the dancing suit. Esc is the exception: it returns
the monitor to the idle screen. Hackathon digits appear twice, on the number row
and on the numpad, and both light up together because they are the same key.

**The letters are full.** Every A–Z key is mapped, so a new entry either takes a
free F-key (`videos[]` grows into F10–F12), joins an existing key as another
video in its `videos[]` series, or displaces something.

So: give an entry a `key` (or a `hack` slot) and it appears — pick a letter no
other entry uses. Events keep their own card grid as well; that duplication is
deliberate (the cards carry photos, filters and the timeline).

### Adding a new project
1. Add an entry to `projects.grid[]` in `data.json`:
   ```json
   {
     "name": "Project Name",
     "key": "X",
     "desc": "One-sentence description of what it does.",
     "tags": ["TypeScript", "AI"],
     "github": "https://github.com/Intrepidcanadian/repo-name",
     "image": "assets/projects/screenshot.png"
   }
   ```
   `key` is the keyboard letter that loads the project onto the workstation
   monitor — pick an unused A–Z key (check the other entries). Without a `key`
   the project is not reachable anywhere on the page.
   `url` (optional) renders an extra "Open" button next to "Source".
   `deck` (optional) — path to a PDF in `assets/decks/`, renders a "Deck (PDF)" button.
   `kind` (optional) — relabels an entry that isn't a software project. The
   title bar and the status-line path follow it (`"kind": "Venture"` →
   `~/ventures/beef-in-the-city`); the default is "Project" / `~/projects/`.
   `keyLabel` (optional) — the sublabel printed on the keycap. Defaults to the
   first word of the name; set it when that word is longer than ~10 characters
   or just unhelpful.
   `shots` (optional) — array of screenshots instead of a single `image`. The
   first is the hero; the rest sit under it as capped thumbs, and all of them
   browse together in the lightbox.

   To feature a project instead, put the same object in `projects.featured` —
   it is the one that loads on the monitor at page load. There is only one
   featured slot, so the outgoing project moves into `grid[]`.
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
   Optional fields: `video` (YouTube URL — renders a visible "Watch video" pill
   on the card), `url` (non-video link, e.g. a Luma page — turns the title into
   a link), `highlights[]` (`{image, caption}` thumbs that open in the lightbox)
2. Drop the photo into `assets/events/`

### Adding a video
There are three video collections in `data.json`, all of them keyboard-only:
- `videos[]` — video productions (AI-produced StarCraft broadcasts, personal
  edits like the HK trip). Mapped to F1, F2, … in array order, so keep the list
  ≤ 12. The title bar says "AI video" unless the entry sets `kind` (e.g.
  `"kind": "Travel video"`)
- `videosSoftware[]` — demos & appearances. Needs a `key` (letter) or a `hack` (numpad slot); without one it renders nowhere. `kind` relabels the title
  bar and the status line ("Hackathon", "Tutorial", "Prototype"); the default is
  "Demo". `keyLabel` overrides the keycap sublabel. A key can hold a **series**
  instead of one `url` — `videos: [{title, url, desc}]` renders a picker of
  pills under the player, and the meta line follows the selected clip (see
  Mining on X, Conflux tutorials on N)
- `tinkering[]` — locally-hosted mp4s (`video` + `poster`; keep mp4s ≤ ~10 MB, 720p). Needs a `key`; the "channel number" on the monitor comes from array order

1. Add an entry to the right array in `data.json`:
   ```json
   {
     "title": "Video Title",
     "key": "K",
     "desc": "Short description",
     "url": "https://youtu.be/VIDEO_ID"
   }
   ```
   A `videosSoftware` entry with no `url` shows its `thumbnails: ["a.webp", "b.webp"]`
   side by side on the monitor instead of an embed (used for app showcases).
2. Optionally drop thumbnails/screenshots into `assets/videos/`

### The /other and /posts pages
Two collections live off the landing page, each in its own standalone file
linked from the footer:

- `other/index.html` → `/other/` — personal photos, from `other[]`
- `posts/index.html` → `/posts/` — LinkedIn embeds, from `posts[]` (all of
  them, not just the recent 6 the landing page used to show)

Both carry their own copy of the tokens and chrome — there is no build step, so
keep them in visual sync by hand if the design system changes. Both read
`../data.json`, so asset paths in those arrays stay relative to the root.
A post only renders if its `url` contains an `activity-<id>` or `ugcPost-<id>`
segment — that id is what LinkedIn's embed endpoint needs.

### Updating profile photo
1. Drop the photo into `assets/photos/`
2. Set `profile.photo` in `data.json` to the relative path: `"assets/photos/headshot.jpg"`

### Updating experience
Edit the `experience[]` array in `data.json`. Each entry has: `date`, `title`, `desc`, `org`.

### Updating skills
Edit the `profile.skills[]` array in `data.json`.

### Updating education
Edit the `education[]` array in `data.json`. Each entry has: `school`, `items[]`
(credential names, set in the display serif). Optional fields: `tier: "degree"`
(renders in the large 2-up marquee row; everything else goes to the smaller
certifications row), `logo` (crest shown on a white corner tile; add
`logoBg: "dark"` for light-on-dark wordmarks), `meta` (mono
year line), `photos[]` (`{src, caption}` thumbs that open in the lightbox as a
group), `certificate` (image path, shown as a wide thumb that opens in the
lightbox).

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
