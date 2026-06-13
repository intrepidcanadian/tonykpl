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
    └── videos/             ← Video thumbnails (actual videos are on YouTube)
```

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
1. Add an entry to `videos[]` in `data.json`:
   ```json
   {
     "title": "Video Title",
     "desc": "Short description",
     "url": "https://youtu.be/VIDEO_ID",
     "thumbnail": "assets/videos/thumb.jpg"
   }
   ```
2. Optionally drop a thumbnail into `assets/videos/`

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
