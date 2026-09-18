# Client answers and what they change

Answers received from Outlier Autowerke across two question rounds. Tutor
contact: **Isuru** (organising a meeting this week).

These answers replace the assumptions the prototype was built on. This file is
the record of what was asked, what was answered, and what we changed.

---

## Round 1 answers

| # | Question | Client answer | Effect on build |
|---|---|---|---|
| 1 | Marketplace model | **(a) Listings only, payment arranged offline** | No change - already built this way |
| 2 | Who can post listings | **Owner or staff only** | No change |
| 3 | How Parts Exchange works | **(a) User sees a listing and offers a specific swap through the site** | **Changed** - was a noticeboard, now an offer system |
| 4 | Where enquiries go | **Email address + dashboard** | **Changed** - added email sending alongside the dashboard |
| 5 | Customer accounts | **Prompt to create one, not mandatory** | **Added** - optional customer registration |
| 6 | Enquiry form fields | **Happy with our suggestions** (incl. optional photo) | **Added** - photo upload |
| 7 | Services | **Should be an option to manage these services** | **Added** - admin can create/edit/delete services |
| 8 | Portfolio photos | **Will provide later, follow up with prototype** | Placeholders stay |
| 9 | Testimonials | **Sample testimonials for now** | No change |
| 10 | Admin should manage | **Services, portfolio projects, parts listings, wanted/exchange, testimonials** | **Added** - services and projects admin screens |
| 11 | Branding | **Mainly black and white; logo after first demonstration** | No change - already black and white |
| 12 | Expected listing volume | **A few hundred** | **Added** - pagination |
| 13 | Public business details | **Trading name, ABN, suburb only, email** | **Changed** - phone number removed from public pages |
| 14 | Domain and hosting | **Yes, already owned** | Deployment target exists |
| 15 | Point of contact | **Isuru, meeting this week** | - |

## Round 2 answers

| # | Question | Client answer | Effect on build |
|---|---|---|---|
| 1 | Who can sell | **Outlier Autowerke only** | Confirms round 1 |
| 2 | Buyer/seller chat | **Open for suggestions, consider a prototype** | **Added** - message thread on each exchange offer |
| 3 | Parts Wanted | **Between Autowerke and other interested parties** | Customers may post; staff respond |
| 4 | Parts Exchange | **Mainly back and forth negotiations** | **Added** - offers carry a negotiation thread |
| 5 | Returns | **No return policy, open for suggestions** | **Added** - sample policy page saying no returns |
| 6 | User types | **Customer, Staff, Administrator** | **Changed** - three roles, was one |
| 7 | Permissions | Book services: everyone. List parts / manage orders: staff and admin. Submit enquiries: customers | **Added** - service booking, role checks |
| 8 | Who approves listings | **Staff and admin.** "There is no user generated content" | See open question 1 below |
| 9 | Admin levels | **Two levels** | **Changed** - STAFF and ADMIN |
| 10 | Services online | **Yes, include typical services** and allow booking | **Added** - online booking |
| 11 | Who shows projects | **Only Autowerke** | No change |
| 12 | Collaboration types | **Vehicle projects, rebuilds and restorations** | Collaborate page reworded |
| 13 | Personal data collected | **Up to you** | We collect the minimum needed to reply |
| 14 | Data access and retention | **Staff and admin. Consult data and privacy laws** | See open question 3 |
| 15 | Existing policies | **None, include samples** | **Added** - privacy, terms, marketplace terms |
| 16 | Consent | **Consult data and privacy laws** | **Added** - consent checkbox on every form that stores data |
| 17 | Enquiry types | **All of them** | No change - already four types |
| 18 | Who supplies content | **Outlier Autowerke staff** | - |
| 19 | Who updates after launch | **Outlier Autowerke** | **Added** - business details and opening hours are editable at `/admin/business`, so no developer is needed to change them |

---

## Open questions to raise with the client

**1. "There is no user generated content" contradicts the Parts Wanted and
Exchange answers.** Round 2 question 3 says Parts Wanted is "between Autowerke
and other interested parties", and round 1 question 3 has customers making swap
offers through the site. Both are user generated content.

Our reading, which we have built to: the answer refers to **user submitted
projects** (round 2 question 11 confirms only Autowerke showcases projects).
Customers can post wanted ads and swap offers, but **staff approve them before
they appear publicly**. That satisfies "staff and admin approve" either way.
Please confirm.

**2. Which email address should enquiries go to?** The answer says "email
address + dashboard" without naming one. The dashboard half is built and the
sending half is written, but it needs a real address and mail account before it
can send. Resolved: owner emails go to the address in Admin panel → Business
details, which the owner sets themselves.

**3. Data retention period.** "Consult data and privacy laws" is not something
we can decide for you. Under the Australian Privacy Act personal information
must be destroyed once it is no longer needed for the purpose collected. Our
sample privacy policy proposes **enquiries kept 24 months, customer accounts
until deletion is requested**. These numbers need the client to accept them, and
the policy needs a real review before launch. We are students, not lawyers - the
policy pages we generated are drafts to react to, not legal advice.

**4. Returns.** "No return policy, open for suggestions" - for a used parts
marketplace where payment happens offline, our suggestion is that the site
states parts are sold as inspected, with any dispute handled directly between
buyer and seller. That is what the sample page says. Confirm or amend.

**5. Logo and branding.** Promised after the first demonstration. The site is
black and white as requested and the logo is a placeholder monogram until then.
