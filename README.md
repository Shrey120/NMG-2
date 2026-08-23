# Outlier Autowerke

Website and parts marketplace for Outlier Autowerke, built for the industry
project *Digital Presence and Marketplace Website*.

> **Prototype.** All services, projects, parts, reviews and enquiries in the
> database are invented sample data. A banner on every page says so.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 18, React Router, Vite |
| Styling | Plain CSS (`client/src/styles.css`), black and white only |
| Backend | Node.js with Express |
| Database | **MySQL 8** |
| Database access | `mysql2` driver with hand written SQL |
| Passwords | `bcryptjs` (hashed, never stored as text) |
| Login sessions | `jsonwebtoken` |

There is no ORM and no CSS framework. Every query and every style rule is
written out, so anything on screen can be traced to the line that produced it.

## Getting it running

**1. You need a MySQL server.** Either install MySQL locally, or run one in
Docker:

```bash
docker run --name oa-mysql -e MYSQL_ROOT_PASSWORD=rootpass -p 3307:3306 -d mysql:8
```

**2. Install dependencies**

```bash
npm run setup
```

**3. Add your database details**

```bash
cp server/.env.example server/.env
```

Then edit `server/.env`. For the Docker command above, set `DB_PORT=3307`,
`DB_USER=root` and `DB_PASSWORD=rootpass`. For a normal local MySQL, port 3306
and your own root password.

**4. Create the tables and load the sample data**

```bash
npm run db:setup
```

This drops and recreates every table, so running it again is how you reset the
data to a clean state.

**5. Start it**

```bash
npm run dev
```

| | Address |
|---|---|
| Website | http://localhost:5173 |
| API | http://localhost:4100 |

Vite forwards anything starting with `/api` to the Express server, so the
browser only ever talks to one address.

Enquiries are emailed as well as shown on the dashboard. Until the client gives
us a mail account, `MAIL_HOST` is left blank in `server/.env` and the email is
printed to the terminal instead of sent.

### Admin panel

`npm run db:setup` creates one account per role. Sign in at `/signin`.

| Role | Sign in | Can do |
|---|---|---|
| Administrator | `admin@outlierautowerke.com` / `admin1234` | Everything, including editing services and portfolio projects |
| Staff | `staff@outlierautowerke.com` / `staff1234` | Listings, enquiries, bookings, swap offers, moderation |
| Customer | `daniel@example.com` / `customer1234` | Make swap offers, post wanted ads, book services |

Change the administrator details in `server/.env` before running the setup
script if you want different ones.

## Project layout

```
server/
  index.js          all API routes
  db.js             MySQL connection pool
  env.js            loads .env from the server folder
  sql/schema.sql    CREATE TABLE statements
  sql/seed.sql      sample data
  sql/setup.js      runs the two .sql files and creates the admin user

client/src/
  App.jsx           every route in one file
  api.js            get / post / put / patch / remove helpers
  useLoad.js        loads data when a page opens
  styles.css        the whole design system
  pages/            one file per page
  pages/admin/      the admin panel
  components/       header, footer, placeholder image, spinner
```

## Database tables

| Table | Holds |
|---|---|
| `users` | accounts, with a role of CUSTOMER, STAFF or ADMIN |
| `services` | the workshop service list, and whether each can be booked online |
| `projects` | portfolio builds |
| `projectWork` | bullet points belonging to a project (one to many) |
| `listings` | parts for sale |
| `wanted` | parts wanted posts, hidden until staff approve them |
| `exchanges` | parts the workshop will swap |
| `exchangeOffers` | a specific swap a customer has proposed |
| `offerMessages` | the back and forth negotiation on one offer |
| `testimonials` | customer reviews, hidden until approved |
| `enquiries` | contact form submissions, with an optional photo |
| `bookings` | service bookings, which guests can make without an account |

Column names are camelCase so a row from MySQL can be sent straight to React
as JSON without renaming anything in between.

## Notes on the code

- **SQL injection.** Every value from the browser is passed as a `?`
  placeholder, never joined into the SQL string. Sort order is picked from a
  fixed list (`SORT_OPTIONS` in `server/index.js`) for the same reason.
- **Passwords.** Stored as a bcrypt hash. Login hashes the attempt and compares.
- **Login sessions.** Signing in returns a JSON Web Token, kept in
  `localStorage` and sent as an `Authorization` header on admin requests.
- **Counting.** Dashboard totals are done with `COUNT` and `SUM` in MySQL
  rather than loading every row into Node.

## What this covers

| Client requirement | Where |
|---|---|
| Responsive business website | every page |
| Service pages | `/services` |
| Book a service online | `/book`, open to guests |
| Portfolio and success stories | `/portfolio` |
| Collaboration page | `/collaborate` |
| Parts marketplace, no online payment | `/marketplace` |
| Search and browse listings | `/marketplace` - search, two filters, three sorts, paged |
| Parts Wanted | `/wanted`, customer posts approved by staff |
| Parts Exchange with offers and negotiation | `/exchange`, `/exchange/:id`, `/account` |
| Contact and enquiry form with photo | `/contact` |
| Customer accounts, optional | `/register`, `/signin`, `/account` |
| Three roles, two admin levels | CUSTOMER, STAFF, ADMIN |
| Admin manages services and portfolio | `/admin/services`, `/admin/projects` (administrator only) |
| Admin manages listings, posts, reviews | `/admin/*` (staff and administrator) |
| Privacy, terms and marketplace policies | `/privacy`, `/terms`, `/marketplace-terms` |
| Consent before storing personal details | every form that saves data |

## Still to do

- Automated tests
- Real photographs (the client will supply them; placeholders until then)
- A mail account, so enquiry emails actually send rather than being logged
- Deployment to the client's domain
- User documentation

## Requirements

The client has now answered both rounds of questions. What they said, what we
changed because of it, and the five points still open are recorded in
[docs/client-answers.md](docs/client-answers.md).

Two things there are worth knowing before reading the code:

1. Customers can post wanted ads and swap offers, and staff approve them. This
   is our reading of an answer that also said "there is no user generated
   content", which we believe referred to portfolio projects. It is question 1
   in the open list.
2. The policy pages are **drafts written by students**, not legal advice. They
   need a real review before launch.
