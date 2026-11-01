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

## Hero animation and loading screen

- **Hero (pick and place):** in `script.js`, find `Hero: gantry robot` and edit the "Easy settings" at the top of that block. `LETTERS` is what the robot builds, `TILT` is the angle each block lies at (the gripper rotates to match), `SEG` is the timing of each step.
- **Loading screen:** `loader.js` plus the `loader` block at the top of `index.html`. It shows real progress (fonts, images, page load). `MIN_MS` is the shortest it will show, `MAX_MS` is the longest it can block the page. Remove the `loader` block and the `loader.js` line from `index.html` to turn it off.
- Upload `loader.js` to the main folder along with `index.html`, `style.css` and `script.js`.
