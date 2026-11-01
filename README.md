# Mr. Coconetto — WordPress website

Personalized-coconut brand website (hero slider, coconut customizer, services, plans, blog,
orders & enquiries) packaged as a **WordPress theme**. Everything runs on your own WordPress
— no Emergent, no separate backend, no outside service.

After logging in to WordPress, **everything on the website can be changed** — words,
pictures, videos, button links, colours, lists (slides, services, plans, FAQ, cities…) and
blog posts — so easily that a 10-year-old can do it.

```
frontend/            React app (the website) — CRA + Tailwind
wordpress-theme/     WordPress theme: PHP (storage, REST API, wp-admin pages, updates from GitHub)
build-wp-theme.sh    builds dist/mr-coconetto-wordpress-theme.zip
scripts/vps-install.sh   one-command install on an Ubuntu VPS
.github/workflows/   every push to main → new theme zip on the Releases page
```

## 1. Put it on your VPS (one command)

Point your domain's DNS **A record** to the VPS IP, log in to the VPS as root (Ubuntu 22.04 / 24.04), then:

```bash
curl -fsSL https://raw.githubusercontent.com/PyTech95/coconuts-website/main/scripts/vps-install.sh -o vps-install.sh
sudo DOMAIN=mrcoconetto.com ADMIN_EMAIL=you@example.com bash vps-install.sh
```

It installs Nginx, PHP, MariaDB, WordPress, the latest theme from GitHub and a free SSL
certificate, and prints the WordPress login. Run it again any time — it only updates what is needed.

**Already have WordPress (cPanel, Hostinger, any host)?** Download
`mr-coconetto-wordpress-theme.zip` from the
[Releases page](https://github.com/PyTech95/coconuts-website/releases/latest) →
WordPress → *Appearance → Themes → Add New → Upload Theme* → *Activate*. That's all
(pretty links and the sample blog posts are set up automatically).

## 2. Change the website

Log in at `yourdomain.com/wp-admin`. You land on **Mr. Coconetto → Start here**:

| Button | What it does |
|---|---|
| ✏️ **Edit the website** | Opens the site with an editing bar. Tap any **words** to type new ones, tap any **picture/video** to upload a new one, tap a **button** to change its words *and* where it goes. Press the green **Save**. |
| 🧩 **Change sections** | Every section as a simple form: add / remove / move slides, services, plans, FAQ, testimonials, cities, menu links, products, Instagram pictures… |
| 🖼️ **Change pictures** | Every picture and video of the website on one page, each with *Upload new photo* / *My pictures* / *Original*. |
| 🎨 **Change colours** | Brand green, pink and light-pink background. |
| 📝 **Blog** | Normal WordPress posts (*Posts → Add New*). Featured image = picture on the blog card. |
| 📦 **Orders** / 💬 **Enquiries** | Orders from "Customize Your Coconut" and messages from the contact form. Email alerts go to the addresses set on *Start here*. |
| ⏪ **Undo / old versions** | Every Save keeps the previous version (last 30). One click goes back — including to the original website. |

While editing there is also **Undo** (Ctrl+Z), **Save** (Ctrl+S), and a reminder if you try to leave without saving.
Uploaded files go to the normal WordPress **Media Library**.

The editor is also available at `yourdomain.com/admin` (same WordPress login).

## 3. Updates from GitHub

* Push to `main` → GitHub Actions builds the theme and publishes a new **Release**
  (`v2.0.<run number>`).
* Every WordPress site with the theme shows **Update available** under *Dashboard → Updates*
  (checked every 6 hours, or press *Check again*). One click updates it. Your words, pictures
  and posts are stored in WordPress, so updates never overwrite them.
* **Automatic install on your VPS (optional):** in GitHub → *Settings → Secrets and variables →
  Actions* add `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (and optionally `VPS_PORT`, `VPS_WP_PATH`,
  default `/var/www/mrcoconetto`). Each push then installs the new theme on the server by itself.
  The SSH user needs `sudo` rights for `wp`.

## Build the theme yourself

```bash
# needs Node 18+ and Yarn 1  (npm i -g yarn)
bash build-wp-theme.sh                       # → dist/mr-coconetto-wordpress-theme.zip
THEME_VERSION=2.0.50 bash build-wp-theme.sh  # set the version number
```

Development: `cd frontend && yarn install && yarn start`. To talk to a local WordPress, set
`REACT_APP_API_URL=http://localhost:8080/wp-json/mc/v1` (editing needs the theme's login, so it is
easiest to test editing on the WordPress site itself).

## How it works (for developers)

* All default words and pictures are in `frontend/src/data/mock.js`. Editable sections and their
  child-friendly names are listed in `frontend/src/data/cms.js` (`SECTIONS`). To make a new list
  editable, export it from `mock.js`, add it to `SECTIONS` and to `mc_section_names()` in
  `wordpress-theme/mr-coconetto/inc/content.php`.
* Saved changes live in one WordPress option (`mc_site_content`: `texts`, `images`, `links`,
  `theme`, `data`) and are printed into the page as `window.MC_CONFIG`, so the site shows them
  without an extra request. History: `mc_site_content_history`.
* REST API: `/wp-json/mc/v1/…` — public: `content`, `blog`, `blog/<slug>`, `orders`,
  `enquiries`, `upload-logo`; editors (WordPress cookie + nonce): `admin/content`,
  `admin/history`, `admin/upload`, `admin/media/<page>`, `admin/orders`, `admin/enquiries`,
  `admin/blog`, `admin/stats`.
* Who can edit: Administrators and Editors (`edit_others_pages`; change with the
  `mc_edit_capability` filter).
* Orders / enquiries are private post types `mc_order` / `mc_enquiry`; customer logos are stored in
  `wp-content/uploads/mc-logos/`.
