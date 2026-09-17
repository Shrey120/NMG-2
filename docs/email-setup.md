# Setting up email

The website sends six kinds of email: new booking to the owner (with Accept and
Decline links), booking received / confirmed / declined to the customer, new
enquiry to the owner with an acknowledgement to the sender, and new staff
account to the owner.

All the settings live in **`server/.env`**. That file is never committed to
GitHub, because it holds passwords. `server/.env.example` is the template.

There are two ways to set it up. Use **Option A** while developing and for the
demonstration. Use **Option B** when you want real emails to reach real inboxes.

---

## Option A - a local test inbox (recommended for development and the demo)

Every email the site sends lands in an inbox on your own computer that you open
in the browser. Nothing reaches a real person, links in the emails can be
clicked, and no passwords are needed.

**1. Start the inbox** (once; it keeps running in Docker):

```bash
docker run -d --name oa-mail -p 1025:1025 -p 8025:8025 axllent/mailpit
```

After a restart of your computer: `docker start oa-mail`

**2. Put these lines in `server/.env`:**

```
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=bookings@outlierautowerke.example
MAIL_TO=owner@outlierautowerke.example
PUBLIC_URL=http://localhost:5173
```

`MAIL_USER` and `MAIL_PASSWORD` stay empty - the test inbox has no login.

**3. Restart the site** so it reads the new settings: stop `npm run dev` with
Ctrl+C and run it again.

**4. Check it works:**

```bash
npm run mail:test
```

You should see `Sent.` Then open **http://localhost:8025** - the test email is
there.

**5. Try the real flow.** Book a service at http://localhost:5173/book, then
open http://localhost:8025. The owner's email is there with Accept and Decline
links. Click Accept - the customer's confirmation email appears a second later.

---

## Option B - real email through a Gmail account

Gmail will not accept your normal Gmail password from a program. You need an
**App Password**, which is a separate 16 letter password just for this.

**1. Turn on 2-Step Verification** for the Gmail account (App Passwords do not
exist without it):
https://myaccount.google.com/security → *2-Step Verification* → turn on.

**2. Create an App Password:**
https://myaccount.google.com/apppasswords → type a name such as
`Outlier Autowerke website` → *Create*.
Google shows a 16 letter password like `abcd efgh ijkl mnop`. Copy it now - it
is only shown once.

> If that page says App Passwords are not available, the account is either
> missing 2-Step Verification, or it is a work/school account where an
> administrator has switched them off.

**3. Put these lines in `server/.env`** (use your own address, and the App
Password with the spaces removed):

```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=yourname@gmail.com
MAIL_PASSWORD=abcdefghijklmnop
MAIL_FROM=yourname@gmail.com
MAIL_TO=yourname@gmail.com
PUBLIC_URL=http://localhost:5173
```

- `MAIL_USER` - the Gmail address that sends the emails.
- `MAIL_PASSWORD` - the App Password, **not** your Gmail password.
- `MAIL_FROM` - must be the same Gmail address. Gmail replaces any other
  sender address with its own.
- `MAIL_TO` - who receives owner notifications (new bookings, enquiries, new
  staff). For testing, your own address. Later, the workshop's address.
- `PUBLIC_URL` - see "The Accept and Decline links" below.

**4. Restart the site** (Ctrl+C, then `npm run dev`).

**5. Check it:**

```bash
npm run mail:test
```

`Sent.` means it worked - look in the `MAIL_TO` inbox, and the spam folder the
first time. If it fails, the command says why:

| It says | Fix |
|---|---|
| *The password was refused* | You used your normal Gmail password, or copied the App Password wrongly. Make a new one. |
| *Could not reach the mail server* | Check `MAIL_HOST=smtp.gmail.com` and `MAIL_PORT=587`. Some university and office networks block port 587 - try from home or a phone hotspot. |

Gmail allows roughly 500 emails a day from a personal account. That is far
more than this site needs.

---

## When the client gives you their own mailbox

Their email provider (the company that hosts their domain email) will give
four details. They go in the same lines:

```
MAIL_HOST=<the SMTP server they give you>
MAIL_PORT=<usually 587, sometimes 465>
MAIL_USER=<the full mailbox address>
MAIL_PASSWORD=<that mailbox's password or app password>
MAIL_FROM=<the same mailbox address>
MAIL_TO=<where owner notifications should go>
```

Port 465 and 587 both work - the code switches encryption on correctly for
each. Run `npm run mail:test` after changing them.

---

## The Accept and Decline links

The owner's email contains links that accept or decline a booking. They are
built from `PUBLIC_URL`.

- **While developing:** `PUBLIC_URL=http://localhost:5173`. The links only work
  on the computer running the site - clicking them on your phone will not.
- **Once the site is live:** set it to the real address, for example
  `PUBLIC_URL=https://www.outlierautowerke.com.au`, so the links work from
  anywhere.

---

## If an email fails

A booking or enquiry is **never lost** because an email failed. It is saved
first; the email is attempted after. Every attempt, successful or not, is
recorded in the `emailLog` table with the reason:

```sql
SELECT createdAt, toAddress, subject, delivered, error
FROM emailLog ORDER BY id DESC LIMIT 20;
```

`delivered = 0` with an error such as `Invalid login` tells you exactly what to
fix.
