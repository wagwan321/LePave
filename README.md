# Le Pavé Residences

Marketing website for **Le Pavé Residences** — modern luxury furnished apartments and suites in Ain Aar, Mount Lebanon.

A static site (HTML / CSS / vanilla JS) — no build step. Open `index.html` directly, or serve it:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html     Single-page site (nav, hero, hotel, rooms, facilities, Amara, gallery, location, contact, footer)
styles.css     Luxury theme — espresso · champagne gold · ivory · sage
script.js      Sticky nav, mobile menu, scroll-reveal, booking form
images/        Photography
```

## Booking form

The reservation form emails the request to the hotel. Configure in `script.js`:

```js
var FORMSPREE_ENDPOINT = "";                          // paste a Formspree endpoint for hands-off email delivery
var RESERVATIONS_EMAIL = "info@lepaveresidences.com"; // the hotel's booking inbox (mailto fallback)
```

- With a **Formspree** endpoint set, submissions POST directly and arrive as email — no email app needed.
- Without it, the form opens the guest's email app with a pre-filled reservation addressed to `RESERVATIONS_EMAIL`.

## Deploy

Any static host works (Netlify, GitHub Pages, Vercel, Cloudflare Pages) — no configuration required.
