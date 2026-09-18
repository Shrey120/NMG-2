# Setting up email

The website sends these emails:

| When | To | Email |
|---|---|---|
| Someone requests a booking | owner | New booking request, with **Accept** and **Decline** links |
| Someone requests a booking | customer | Request received - **not yet confirmed** |
| Owner accepts | customer | Booking confirmed |
| Owner declines | customer | Booking declined |
| Someone sends an enquiry | owner, and the sender | The enquiry, and an acknowledgement |
| Someone signs up as staff | owner | New staff account |

All the settings live in **`server/.env`**. That file is never uploaded to
GitHub because it holds passwords. `server/.env.example` is the template.

There are three ways to set it up. **All three work on Windows, Mac and Linux.**

| | You need | Emails go to |
|---|---|---|
| **A - nothing** | nothing at all | the **Sent emails** screen in the admin panel |
| **B - Gmail** | a Gmail account | real inboxes |
| **C - test inbox** | the Mailpit program | a pretend inbox on your own computer |

**For development and the demonstration, Option A is enough.**

---

## Option A - nothing to set up

Leave every `MAIL_` line in `server/.env` blank:

```
MAIL_HOST=
MAIL_USER=
MAIL_PASSWORD=
```

The site still produces every email, it just does not send them. Read them at
**Admin panel → Sent emails**. Click one to open it.

The Accept and Decline links in the owner's booking email work from that
screen, so the whole booking flow can be demonstrated:

1. Book a service at http://localhost:5173/book.
2. Admin panel → **Sent emails** → open *New booking request*.
3. Click **ACCEPT BOOKING**.
4. Click **Refresh** - the customer's *Booking confirmed* email is there.

---

## Option B - real email through Gmail

Gmail will not accept your normal Gmail password from a program. You need an
**App Password**, which is a separate 16 letter password just for this.

**1. Turn on 2-Step Verification** for the Gmail account. App Passwords do not
exist without it: https://myaccount.google.com/security → *2-Step Verification*.

**2. Create an App Password:** https://myaccount.google.com/apppasswords →
type a name such as `Outlier Autowerke website` → *Create*. Google shows
something like `abcd efgh ijkl mnop`. Copy it now, it is only shown once.

> If that page says App Passwords are not available, the account is missing
> 2-Step Verification, or it is a work or university account where they have
> been switched off. Use a personal Gmail account.

**3. Fill in `server/.env`** with your own address and the App Password,
spaces removed:

```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=yourname@gmail.com
MAIL_PASSWORD=abcdefghijklmnop
MAIL_FROM=yourname@gmail.com
MAIL_TO=yourname@gmail.com
```

- `MAIL_PASSWORD` is the App Password, **not** your Gmail password.
- `MAIL_FROM` must be the same Gmail address. Gmail replaces any other sender.
- `MAIL_TO` is who receives the owner's emails. Your own address for testing,
  the workshop's later.

To open the file: Windows `notepad server\.env`, Mac `open -e server/.env`.

**4. Restart the site** - Ctrl+C in the window running it, then `npm run dev`.

**5. Test it:**

```
npm run mail:test
```

`Sent.` means it works. Check the `MAIL_TO` inbox, and the spam folder the
first time. If not, it tells you why:

| It says | Fix |
|---|---|
| *The password was refused* | You used your normal Gmail password, or copied the App Password wrongly. Make a new one. |
| *Could not reach the mail server* | Check `MAIL_HOST=smtp.gmail.com` and `MAIL_PORT=587`. University and office wifi sometimes blocks port 587 - try from home or a phone hotspot. |

Every email is also still listed under **Sent emails**, marked *Delivered* or
*Failed* with the reason.

---

## Option C - a test inbox on your own computer

Emails land in a pretend inbox that you open in the browser. Only worth it if
you want to see them the way an email program shows them; Option A covers
everything else.

**1. Start Mailpit.**

- **Windows:** download `mailpit-windows-amd64.zip` from
  https://github.com/axllent/mailpit/releases/latest, unzip it, and
  double-click `mailpit.exe`. If Windows says *"Windows protected your PC"*,
  click **More info → Run anyway**, and allow it through the firewall on
  private networks. Leave its window open while you work.
- **Mac or Linux with Docker:**
  `docker run -d --name oa-mail -p 1025:1025 -p 8025:8025 axllent/mailpit`

**2. Fill in `server/.env`:**

```
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USER=
MAIL_PASSWORD=
MAIL_FROM=bookings@outlierautowerke.example
MAIL_TO=owner@outlierautowerke.example
```

`MAIL_USER` and `MAIL_PASSWORD` stay empty; Mailpit has no login.

**3. Restart the site**, run `npm run mail:test`, then open
**http://localhost:8025**.

---

## When the client gives you their own mailbox

Their email provider gives four details. Same lines as Gmail:

```
MAIL_HOST=<SMTP server they give you>
MAIL_PORT=<usually 587, sometimes 465>
MAIL_USER=<the full mailbox address>
MAIL_PASSWORD=<that mailbox's password or app password>
MAIL_FROM=<the same mailbox address>
MAIL_TO=<where the owner's emails should go>
```

Ports 465 and 587 both work; the code sets encryption correctly for each. Run
`npm run mail:test` after changing them.

---

## The Accept and Decline links

They are built from `PUBLIC_URL` in `server/.env`.

- **While developing:** `PUBLIC_URL=http://localhost:5173`. The links only work
  on the computer running the site, not on your phone.
- **Once the site is live:** set it to the real address, for example
  `PUBLIC_URL=https://www.outlierautowerke.com.au`, so they work anywhere.

---

## If an email fails

A booking or enquiry is **never lost** because an email failed. It is saved
first and the email is tried afterwards. Every attempt is listed under
**Sent emails** as *Delivered*, *Not sent* (no mail account set) or *Failed*
with the reason.
