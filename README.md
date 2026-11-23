# Shri Koderma Gaushala Samiti — website

Static HTML + PHP site for Shri Koderma Gaushala Samiti, Yadutand, Jhumri Telaiya (est. 1950).
Live: https://nice-blueviolet-swallow-52.hostingersite.com/

- 64 pages, English with a Hindi toggle (`lang-en` / `lang-hi`)
- `assets/css/site.css`, `assets/js/site.js` — styles and scripts
- `assets/img/bg/` — one unique gaushala background per page
- `assets/video/hero-banner-*.mp4` — full-screen home banner (1280 / 1920 / 2560 / 3840)
- `send.php` — enquiry and donation-intent forms; needs `config.php` on the server (not in this repo)

Deploy: push to `main`; the Hostinger site deploys from this repo automatically within about a minute. `config.php` stays on the server and is not in this repo.
