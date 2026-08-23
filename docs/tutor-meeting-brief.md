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
| Frontend | **React 18** | Component reuse - the same card markup renders on home, portfolio and marketplace. Client side routing gives an app-like feel for the marketplace. |
| Build | **Vite** | Fast dev server with hot reload; production build is around 65KB gzipped. |
| Styling | **Plain CSS** | One stylesheet with CSS variables at the top. No framework, so every rule on screen can be traced to the line that wrote it. Colours change in one place. |
| Routing | **React Router v6** | Public routes plus protected admin routes. |
| Backend | **Node.js + Express** | One language across the whole stack. A REST API keeps presentation separate from data, so a mobile app or a redesign could reuse the same endpoints. |
| Database | **MySQL 8** | See below. |
| Database access | **mysql2 driver, hand written SQL** | No ORM. The SQL is visible in the route that runs it, which makes it explainable and keeps the query count obvious. |
| Passwords | **bcryptjs** | Stored as a hash, never as text. |
| Sessions | **jsonwebtoken** | Signing in returns a token that is sent with each admin request. |

### Why MySQL

The data is relational, and the schema shows it:

- a listing belongs to a category and a marque, and an enquiry can point at a listing
- a project has many work items, which is a real one-to-many with a foreign key
- an exchange records what someone has and what they want

Nine tables with foreign keys and indexes. Joins, `COUNT`, `SUM` and `DISTINCT`
are all done by the database rather than in JavaScript.

### If asked why no ORM

Deliberate. Writing the SQL by hand means there is no generated layer to explain,
the number of queries per request is obvious, and it demonstrates the SQL the unit
is assessing. The trade off is more typing and no compile time checking of column
names, which an ORM would give.

### If asked about the camelCase column names

Also deliberate, and the one convention we broke. MySQL columns are normally
snake_case. Using camelCase means a row from MySQL is already in the shape React
expects, so there is no renaming step between the database and the browser. The
cost is that it looks unusual to a DBA.

### Security points worth raising unprompted

- Every value from the browser goes in as a `?` placeholder, never joined into
  the SQL string. Demonstrate it: search the marketplace for `'; DROP TABLE
  listings; --` and show that it returns nothing and breaks nothing.
- Sort order cannot be a placeholder, so it is looked up in a fixed list rather
  than taken from the URL.
- Database credentials live in `server/.env`, which is gitignored.
  `server/.env.example` is committed as a template.

## 4. Where the project stands

Built and working:

- 26 React files, 21 API endpoints, 9 MySQL tables
- Public: home, services, portfolio + project detail, marketplace with search,
  filters and sorting, listing detail, parts wanted, parts exchange, collaborate,
  contact, 404
- Admin: login, dashboard, listings create/edit/delete, enquiry inbox with a
  status workflow, post moderation, testimonial approval
- Verified: schema and seed load into MySQL 8, all endpoints tested including
  auth rejection and an injection attempt, production build clean, screenshots
  checked at desktop and mobile widths

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

1. **Have any Round 1 client answers come back yet?** Payments (A1) and who can post listings (A3) change the data model, so we want them before we finalise the MySQL schema.
2. **Is a Docker MySQL acceptable for marking, or does it need a local install?** We develop against MySQL 8 in Docker so the setup is reproducible.
3. **SEO** — we built a client-rendered SPA. For a business marketing site, search visibility matters and an SPA is weaker there. Should we prerender the marketing pages, or is it out of scope for assessment?
4. **Testing expectations** — what depth is required? We plan Vitest + React Testing Library for components and Supertest for API routes.
5. **Deployment** — does it need to be publicly hosted for marking, or is a local demo enough?
6. **Sample vs real data** — if the client never supplies photos or testimonials, is clearly-labelled sample content acceptable in the final submission?

## 7. If asked "what are the risks?"

- **Client availability.** The brief already warns they may not be reachable. Mitigation: documented assumptions, built to be changed.
- **Content dependency.** No photos, no service list, no parts data yet. Mitigation: everything is API-driven, so real content drops in without touching layout.
- **Scope.** A full payment marketplace would not fit the timeframe. Mitigation: we asked the client to rank their top three priorities (question L1).
