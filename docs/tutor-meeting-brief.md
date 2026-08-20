# Tutor Meeting Brief — Outlier Autowerke

Prepared 20 August 2026. Repo: https://github.com/Shrey120/NMG-2

---

## 1. Opening (60 seconds)

> "Outlier Autowerke is a sole-trader European car workshop with no web presence.
> They need a marketing site — services, portfolio, testimonials — plus a parts
> marketplace with Wanted and Exchange sections, a contact/enquiry system, and an
> admin panel so the owner can manage all of it without a developer.
>
> We submitted our Round 1 questions on Monday. Rather than wait on answers, we
> built a working prototype on documented assumptions, so we could start and so
> the client has something concrete to react to. It runs end to end today — React
> front end, Express API, sample data throughout."

## 2. Demo path (5 minutes)

Have both servers running before the meeting: `npm run dev`

| Step | Page | Point to make |
|---|---|---|
| 1 | `/` | Responsive, dark brand-led design. Note the amber "Prototype — sample data" banner: nothing here is fabricated as real. |
| 2 | `/services` | Six services, structured content driven by the API, not hardcoded HTML. |
| 3 | `/portfolio` → any project | Category filter working; detail page shows brief / work carried out / measurable result. Covers "success stories". |
| 4 | `/marketplace` | **The strongest technical demo.** Text search, four filters, three sort orders — all server-side. Change a filter and note results update. |
| 5 | `/marketplace/:id` | Enquiry form tied to a specific listing. |
| 6 | `/parts-exchange` | Has ⇄ Wants noticeboard model. Say explicitly this is one of three possible designs and is our assumption pending client answer. |
| 7 | `/admin` (fill credentials button) | Dashboard stats, then **create a listing** live and show it appear on the public marketplace. Then Enquiries — open the one submitted in step 5. |

Resetting: admin dashboard has a **Restore sample data** button.

## 3. Tech stack and the reason for each choice

| Layer | Choice | Why (say this) |
|---|---|---|
| Frontend | **React 18** | Component reuse — one listing card renders on home, marketplace and search results. Client-side routing gives an app-like feel for the marketplace. |
| Build | **Vite** | Fast dev server with hot reload; production build is 70KB gzipped. |
| Styling | **Tailwind CSS v4** | Design tokens defined once in `index.css`, so brand colours change in one place when the client supplies real branding. Responsive breakpoints are built in — directly serves the "responsive" requirement. |
| Routing | **React Router v6** | 21 routes including nested, protected admin routes. |
| Backend | **Node.js + Express** | One language across the whole stack. REST API keeps presentation and data separate, so a mobile app or a redesign could reuse the same endpoints. 25 endpoints so far. |
| Database | **PostgreSQL via Supabase** *(planned)* | See below. |
| ORM | **Prisma** *(planned)* | Type-safe queries; `schema.prisma` doubles as data-model documentation for the report; migrations are versioned in git as evidence of process. |
| Auth | **Supabase Auth** *(planned)* | Currently a hardcoded prototype credential — flagged in code as must-replace. |
| Images | **Supabase Storage** *(planned)* | Currently locally-generated placeholders. |
| Hosting | Vercel (client) + Render (API) + Supabase (DB) | All free tiers. |

### Why Postgres and not MongoDB

The data is genuinely relational:

- a listing belongs to a seller, a category and a vehicle fitment
- an exchange links **two** listings and **two** users — a many-to-many join
- an enquiry optionally references a listing and optionally a user

Plus "Search & Browse for Parts" is an explicit client requirement, and Postgres
gives full-text search and composite indexes natively. MongoDB would mean
denormalising and `$lookup` on nearly every query.

### Why Supabase specifically

Postgres, auth, and file storage in one free service — file storage matters
because the portfolio is photo-heavy. Express still sits in front of it so the
Node API layer is real work, not a thin wrapper. Row Level Security will be on.

## 4. Where the project stands

Built and working:

- 22 React components/pages, 25 API endpoints, ~3,600 lines (incl. 750 lines of sample data)
- Public: home, services, portfolio + detail, marketplace + detail with search/filter/sort, parts wanted, parts exchange, collaborate, contact, 404
- Admin: login, dashboard, listings CRUD, enquiry inbox with status workflow, post moderation, testimonial approval queue
- Verified: production build clean, API smoke-tested, screenshotted at desktop and mobile widths

Not started: database, real auth, tests, image upload, email delivery, user documentation.

## 5. Assumptions we made to unblock the build

Each maps to a Round 1 question and each is cheap to reverse:

| Assumption | Question |
|---|---|
| No online payments — listing and enquiry only | A1 |
| Staff-only listings; customers browse and enquire | A3 |
| Exchange is a noticeboard, not an in-site offer/accept flow | B2 |
| No customer accounts; only staff log in | C1 |
| Enquiries stored in DB, not emailed | D2 |

## 6. Questions to ask the tutor

1. **Have any Round 1 client answers come back yet?** Payments (A1) and who can post listings (A3) change the data model, so we want them before writing the Prisma schema.
2. **Is Supabase acceptable, or is a self-hosted Postgres expected?** Some units require the DB to be locally reproducible for marking.
3. **SEO** — we built a client-rendered SPA. For a business marketing site, search visibility matters and an SPA is weaker there. Should we prerender the marketing pages, or is it out of scope for assessment?
4. **Testing expectations** — what depth is required? We plan Vitest + React Testing Library for components and Supertest for API routes.
5. **Deployment** — does it need to be publicly hosted for marking, or is a local demo enough?
6. **Sample vs real data** — if the client never supplies photos or testimonials, is clearly-labelled sample content acceptable in the final submission?

## 7. If asked "what are the risks?"

- **Client availability.** The brief already warns they may not be reachable. Mitigation: documented assumptions, built to be changed.
- **Content dependency.** No photos, no service list, no parts data yet. Mitigation: everything is API-driven, so real content drops in without touching layout.
- **Scope.** A full payment marketplace would not fit the timeframe. Mitigation: we asked the client to rank their top three priorities (question L1).
