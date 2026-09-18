# Setting up email

When a customer **books a service** or **uses the contact page**, an email is
sent to the address in **Admin panel → Business details → Email**.

To make that work, the website needs a mailbox to send *from*. That is the
only setup, and it is the same on Windows, Mac and Linux.

| | Set where | Example |
|---|---|---|
| Sends **to** | Admin panel → Business details → Email | the owner's address |
| Sends **from** | `server/.env` | a Gmail account |

---

## 1. Get a Gmail App Password

Gmail will not let a program use your normal password. You need an **App
Password**: a separate 16 letter password just for the website.

1. Use a personal Gmail account. Work or university accounts often block this.
2. Turn on **2-Step Verification**: https://myaccount.google.com/security
3. Go to https://myaccount.google.com/apppasswords, type a name such as
   `Outlier Autowerke website`, click **Create**.
4. Google shows something like `abcd efgh ijkl mnop`. Copy it. It is only
   shown once.

## 2. Put it in `server/.env`

Open the file. Windows: `notepad server\.env`. Mac: `open -e server/.env`.

Fill in these four lines, using your Gmail address and the App Password with
the spaces removed:

```
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=yourname@gmail.com
MAIL_PASSWORD=abcdefghijklmnop
```

Save, then restart the site: press **Ctrl+C** where it is running, then run
`npm run dev` again.

## 3. Set where emails go

Sign in as the administrator → **Business details** → **Email** → type the
address that should receive booking and contact emails → **Save changes**.

This takes effect straight away. No restart needed.

## 4. Test it

```
npm run mail:test
```

It sends one email to the Business details address. `Sent.` means everything
works. Check that inbox, and its spam folder the first time.

If it fails, it says why:

| It says | Fix |
|---|---|
| *The password was refused* | `MAIL_PASSWORD` must be the App Password, not your Gmail password. Make a new one if unsure. |
| *Could not reach the mail server* | Check `MAIL_HOST=smtp.gmail.com` and `MAIL_PORT=587`. University wifi sometimes blocks port 587; try at home or on a phone hotspot. |

---

## What gets sent

| When | Sent to |
|---|---|
| A customer requests a booking | **Business details email** - with Accept and Decline links |
| | the customer - "received, not yet confirmed" |
| Owner accepts or declines | the customer - confirmed, or declined |
| A customer sends a contact message | **Business details email** |
| | the customer - "we have your message" |
| Someone signs up as staff | **Business details email** |

The owner's email has its reply-to set to the customer, so pressing Reply
answers the customer directly.

## The Accept and Decline links

They use `PUBLIC_URL` in `server/.env`. While developing it is
`http://localhost:5173`, so the links only work on the computer running the
site. Once the site is live, set it to the real address.

## Using the client's own mailbox later

Their email provider gives the four `MAIL_` values instead of Gmail's. Port
465 and 587 both work. Run `npm run mail:test` after changing them.

## If an email fails

The booking or enquiry is still saved and still appears in the admin panel.
Only the email is lost, and the reason is printed in the window running
`npm run dev`.
