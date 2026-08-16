# Outlier Autowerke — Digital Presence & Marketplace Website

Prototype for the industry project *Digital Presence and Marketplace Website for
Outlier Autowerke*.

> **This is a prototype.** Every service, project, part, review and enquiry in
> the app is invented sample data. None of it came from the client. A dismissible
> banner says so on every page.

## Running it

```bash
npm run install:all   # installs root, server and client dependencies
npm run dev           # starts both, or use the two scripts separately
```

| | URL |
|---|---|
| Website | http://localhost:5173 |
| API | http://localhost:4100 |

Vite proxies `/api` to the Express server, so only the first URL is needed in a
browser. Port 4100 was chosen because 4000 was already in use during development
— override with `PORT=xxxx npm run dev:server` if it clashes.

### Admin panel

Sign in at `/admin`:

```
admin@outlierautowerke.example
prototype
```

Data lives in memory and resets when the server restarts. There is also a
**Restore sample data** button on the admin dashboard.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 18 + Vite + React Router | |
| Styling | Tailwind CSS v4 | Theme tokens in `client/src/index.css` |
| Backend | Node + Express | ES modules |
| Data | In-memory store | `server/store.js`, seeded from `server/data/seed.js` |

**Database is not wired up yet — deliberately.** The plan is Supabase (Postgres)
with Prisma. `server/store.js` is the single file that touches data, so swapping
in real queries should not require changes to the route handlers.

## What the prototype covers

| Requirement | Where | Status |
|---|---|---|
| Responsive business website | all pages | Done |
| Service pages | `/services` | Done |
| Portfolio / success stories | `/portfolio`, `/portfolio/:slug` | Done |
| Collaboration page | `/collaborate` | Done |
| Marketplace listings | `/marketplace`, `/marketplace/:id` | Listing + enquiry, no payments |
| Search & browse | `/marketplace` | Text search, 4 filters, 3 sorts |
| Parts Wanted | `/parts-wanted` | Public posting |
| Parts Exchange | `/parts-exchange` | Noticeboard model |
| Contact & enquiry form | `/contact` | 4 enquiry types |
| Admin panel | `/admin/*` | Listings CRUD, enquiries, posts, testimonials |
| Sign in / login | `/admin` | Staff only so far |
| Testing | — | Not started |
| User documentation | — | Not started |

## Assumptions baked into this prototype

These are guesses, made so the build could start before the client answers
Round 1. Each maps to a question in
[docs/round-1-client-questions.md](docs/round-1-client-questions.md), and each is
cheap to change:

- **No online payments.** Marketplace is listing-and-enquiry (question A1).
- **Staff-only listings.** Customers browse and enquire, they do not sell (A3).
- **Exchange is a noticeboard.** Post what you have and want, arrange it
  yourselves — no in-site offer/accept flow (B2).
- **No customer accounts.** Only staff log in; Wanted and Exchange posts are open
  to anyone (C1).
- **Enquiries are stored, not emailed.** No mail provider wired up (D2).
- **Placeholder images throughout.** Generated locally from the item name so the
  app needs no network and no image licences (H2).

## Known gaps

- Auth is a hardcoded credential returning a static token. Prototype only —
  see the comment block in `server/index.js`. Supabase Auth replaces it.
- No persistence: restarting the server discards changes.
- No tests, no image upload, no email delivery, no payments.
- Business details, ABN, hours and pricing are placeholders (J1).

## Layout

```
server/           Express API
  data/seed.js    all sample data — replace with client content
  store.js        in-memory store; the seam where Supabase plugs in
  index.js        routes
client/src/
  pages/          public pages
  pages/admin/    admin panel
  components/     Layout, shared UI
  api.js          typed-ish API client
docs/             Round 1 client questions
```
