# Running the project on Windows

Step by step, starting from a Windows laptop with nothing installed.
You do **not** need Docker. It takes about 20 minutes, mostly downloads.

---

## 1. Install three programs

Install these first. Accept the default options unless a step says otherwise.

| Program | Where to get it | Notes |
|---|---|---|
| **Node.js** | https://nodejs.org | Choose the **LTS** version. |
| **Git** | https://git-scm.com/download/win | Or skip it and use *Download ZIP* in step 2. |
| **MySQL Community Server 8.4 LTS** | https://dev.mysql.com/downloads/mysql/ | See below. |

### Installing MySQL

1. On the download page, choose **Microsoft Windows**, then the **MSI Installer**.
   You can click *No thanks, just start my download* instead of logging in.
2. Run it and choose the **Typical** setup.
3. When it asks you to configure the server:
   - Leave the **port as 3306**.
   - Set a **root password** and **write it down**. You need it in step 4.
   - Leave it set to **run as a Windows Service** and **start at system startup**.
     MySQL is then always running in the background and you never need to start it yourself.

> **Do not use XAMPP or WAMP for this.** They install MariaDB, not MySQL, and
> the client's requirements say MySQL only.

When all three are installed, **close and reopen** any PowerShell windows so they
pick up the new programs.

---

## 2. Get the code

Open **PowerShell**. Press the Windows key, type `powershell`, press Enter.

```powershell
cd $HOME\Desktop
git clone https://github.com/Shrey120/NMG-2.git
cd NMG-2
```

No Git? Open https://github.com/Shrey120/NMG-2, click **Code → Download ZIP**,
unzip it to your Desktop, then in PowerShell `cd $HOME\Desktop\NMG-2-main`.

---

## 3. Install the project's packages

```powershell
npm run setup
```

If you see **"running scripts is disabled on this system"**, run this once,
type `Y`, and try again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## 4. Tell it your MySQL password

```powershell
Copy-Item server\.env.example server\.env
notepad server\.env
```

Notepad opens. Change **only** this line to the root password from step 1:

```
DB_PASSWORD=your-mysql-root-password
```

Leave everything else as it is, including all the `MAIL_` lines. Save and
close Notepad.

`server\.env` holds your password, so it is never uploaded to GitHub.

---

## 5. Create the database

```powershell
npm run db:setup
```

It ends with a list of sign-in accounts. Running this again at any time wipes
the data back to the clean sample data.

---

## 6. Start it

```powershell
npm run dev
```

Open **http://localhost:5173** in your browser. Keep the PowerShell window
open while you use the site; closing it, or pressing **Ctrl+C**, stops the site.

Sign in at `/signin`:

| Role | Email | Password |
|---|---|---|
| Administrator | admin@outlierautowerke.com | admin1234 |
| Staff | staff@outlierautowerke.com | staff1234 |
| Customer | daniel@example.com | customer1234 |

**Next time:** open PowerShell, then `cd $HOME\Desktop\NMG-2` and `npm run dev`.
MySQL is already running as a Windows Service.

---

## 7. Email: nothing to set up

With the `MAIL_` lines left blank, the site still produces every email but
does not send them anywhere. You read them in the admin panel:

**Sign in as the administrator → Sent emails.**

Every booking, confirmation, decline and enquiry email is listed there. Click
one to read it. The **Accept** and **Decline** links in the owner's booking email
work from there, so you can demonstrate the whole booking flow with no mail
account:

1. Book a service at http://localhost:5173/book.
2. Admin panel → **Sent emails**. Open *New booking request*.
3. Click the **ACCEPT BOOKING** link.
4. Back in **Sent emails**, click **Refresh**. The customer's *Booking confirmed*
   email is there.

That is all you need for development and for the demonstration.

### If you want emails to reach a real inbox

Use a Gmail account. It works the same on Windows as anywhere else, with
nothing to install. Follow **Option B** in [email-setup.md](email-setup.md):
turn on 2-Step Verification, create an App Password, and fill in the `MAIL_`
lines in `server\.env`. Then restart the site and run:

```powershell
npm run mail:test
```

---

## If something goes wrong

| You see | What it means | Fix |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:3306` | MySQL is not running. | Press Windows+R, type `services.msc`, find **MySQL84** (or similar), right-click → **Start**. |
| `Access denied for user 'root'` | Wrong password in `server\.env`. | `notepad server\.env` and fix `DB_PASSWORD`. |
| `running scripts is disabled` | PowerShell blocks npm. | See step 3. |
| `'npm' is not recognized` | Node.js is not installed, or PowerShell was open before you installed it. | Install Node.js LTS, then close and reopen PowerShell. |
| `EADDRINUSE ... 4100` or `5173` | The site is already running in another window. | Close the other PowerShell window, or press Ctrl+C in it. |
| The website says **Failed to fetch** | The site stopped. | Go back to PowerShell and run `npm run dev` again. |
