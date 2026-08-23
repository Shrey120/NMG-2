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

### Admin panel

Go to `/admin` and sign in with the account created by `npm run db:setup`:

```
admin@outlierautowerke.com
admin1234
```

Change these in `server/.env` before running the setup script if you want
different details.

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
| `users` | staff logins for the admin panel |
| `services` | the workshop service list |
| `projects` | portfolio builds |
| `projectWork` | bullet points belonging to a project (one to many) |
| `listings` | parts for sale |
| `wanted` | parts wanted posts |
| `exchanges` | parts swap posts |
| `testimonials` | customer reviews, hidden until approved |
| `enquiries` | contact form submissions, linked to a listing when relevant |

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
| Portfolio and success stories | `/portfolio` |
| Collaboration page | `/collaborate` |
| Parts marketplace | `/marketplace` |
| Search and browse listings | `/marketplace` - search, two filters, three sorts |
| Parts Wanted | `/wanted` |
| Parts Exchange | `/exchange` |
| Contact and enquiry form | `/contact` |
| Admin panel | `/admin` |
| Sign in | `/admin` - staff accounts |

## Still to do

- Automated tests
- Image upload (photos are placeholders generated from the item name)
- Sending enquiry emails (they are stored in the database only)
- User documentation
- Deployment

## Assumptions

Made so the build could start before the client answered our Round 1
questions. Each is small to change. See
[docs/round-1-client-questions.md](docs/round-1-client-questions.md).

- No online payments; the marketplace is listing and enquiry only (A1)
- Only staff create listings; customers browse and enquire (A3)
- Exchange is a noticeboard rather than an in-site offer system (B2)
- No customer accounts; only staff sign in (C1)
- Enquiries are stored in the database, not emailed (D2)
