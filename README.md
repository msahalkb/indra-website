# Indra club website

A plain static site (no build step, no database). Files:

- `index.html`: page structure
- `style.css`: look and feel
- `script.js`: renders events, gallery, membership and the hero arm
- `config.js`: **the only file you edit day to day**
- `images/gallery/`: put your photos here
- `assets/logo.png`: the club logo shown in the header (replace this file to change it, keep the same name)

## Everyday updates (all in config.js)

**Add an event:** copy one block in `events`, change the details. It moves from Upcoming to Past by itself after its date.

**Add gallery photos:** drop the file in `images/gallery/`, then add a line in `gallery`.

**Open membership for a limited period:**
1. Create a Google Form (forms.google.com), click Send, then the link icon, and copy the link.
2. In `membership` set `open: true`, paste the link in `formUrl`, and set `closesOn` to the last day.
3. Upload the changed `config.js`. The Join section and the nav button appear, and disappear automatically after the deadline.

To close early, set `open: false`.

**Announce anything new:** add an item to `announcements` with `from` and `until` dates. It shows as a yellow banner on top of every page load during that window.

## Publishing on your own domain

Any static host works. Easy free options: Cloudflare Pages, Netlify or GitHub Pages. Upload this folder, then in the host's settings add your custom domain and set the DNS records they show you at your domain registrar. HTTPS is added automatically.

## Before you publish

- The two events and six gallery entries in `config.js` are samples. Replace them.
- Add `email` under `social` if you want a contact button.

## Contact form

Messages go to the address in `contact.email` in `config.js`, using the free FormSubmit service (no account needed).
**One-time step:** after the site is live, send yourself a test message from the form. FormSubmit emails that inbox an activation link the first time. Click it once, and every message after that arrives normally. Check the spam folder if it does not show up.
If the form ever fails, the page shows the email address so people can write directly.

## Adding new sections (Projects, Competitions, Achievements...)

Open `config.js`, find `sections`, and copy the commented example. Remove the `//` at the start of each line and fill it in. Each block becomes a new section on the page and a new link in the top menu. Delete the block to remove the section.
Photos for cards go in the `images` folder (for example `images/projects/rover.jpg`). Create the folder on GitHub the same way as `images/gallery`.

## Hero robot, colours and loading screen

- **Hero (pick and place, driven by the visitor):** in `script.js`, find `Hero: pick and place robot` and edit the "Easy settings" at the top of that block. `LETTERS` is what visitors build, `TILT_MIN`/`TILT_MAX` is how tilted the blocks are, `SPEED_*` is how fast the robot moves, `TOL_*` is how precise a visitor must be (larger numbers are easier). The buttons are in `index.html` inside `<div class="rig">`.
- **Colours:** all colours live in the `:root` block at the top of `style.css` (Jet Black, Cerulean Blue, Neon Rose). Change those few values to re-theme the whole site, including the robot.
- **Loading screen:** the picture `assets/loading.jpg` with a live `STATUS: NN%` line drawn on top (real progress: fonts, images, page load). To change the picture, replace `assets/loading.jpg` (keep 1267x768, or update `--sw`/`--u` and the `.hud-line` position in `style.css`). `MIN_MS` / `MAX_MS` in `loader.js` set the shortest and longest it shows. Remove the `loader` block and the `loader.js` line from `index.html` to turn it off.
- **Logo:** `assets/logo.png` is transparent, so it works on any background colour.
