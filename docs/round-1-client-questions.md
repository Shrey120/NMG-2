# Round 1 Client Questions — Outlier Autowerke

**Project:** Digital Presence and Marketplace Website for Outlier Autowerke
**Due:** Monday 17th, 9:00 AM
**Destination:** "Student Questions" sheet, `IndustryProject7.xlsx`

## How to use this list

The client is a sole trader and has been described as having limited
availability. Questions that can be answered by picking an option get answered;
open-ended questions get skipped or answered vaguely. Most questions below are
therefore written as multiple choice with a recommended default.

If only a handful come back answered, the ones that matter most are marked
**P1** — these block design decisions and cannot be assumed safely.

---

## A. Marketplace model and payments

> This is the single biggest fork in the project. A listing-and-enquiry
> marketplace is roughly a third of the work of a real checkout system, and the
> difference decides the whole data model.

| # | P | Question |
|---|---|---|
| A1 | **P1** | For the Parts Marketplace, which model do you want? (a) Listings only — buyers contact you and payment is arranged offline; (b) Full online checkout with card payment; (c) Listings for now, with online payment added later only if time allows. We recommend (a) or (c) for this timeframe. |
| A2 | **P1** | If you want online payments: do you already have a Stripe or PayPal business account, and would all money go to Outlier Autowerke, or would other sellers receive payment directly? |
| A3 | **P1** | Who is allowed to post a parts listing — only you and your staff, or can registered customers list their own parts too? |
| A4 | P2 | Do listings need delivery/postage options and costs, or is it local pickup only? |
| A5 | P2 | Should a listing show a fixed price, "offers over", or "price on application"? Do you want a "make an offer" option? |
| A6 | P3 | When something sells, should the listing disappear, or stay visible marked "Sold"? |
| A7 | P3 | Should listings expire automatically after a period (e.g. 60 days), or stay until you remove them? |

## B. Parts Wanted and Parts Exchange

| # | P | Question |
|---|---|---|
| B1 | **P1** | Is "Parts Wanted" for you posting parts you are searching for, for customers posting what they need, or both? |
| B2 | **P1** | How should a "Parts Exchange" trade work? (a) A user sees a listing and offers a specific swap through the site; (b) A noticeboard where people post what they have and what they want, and arrange it themselves; (c) Something else — please describe. |
| B3 | P2 | Should Wanted and Exchange posts be public, or visible only to logged-in users? |
| B4 | P2 | Do you want to review and approve Wanted/Exchange posts before they appear publicly? |

## C. Accounts, sign-in and user data

| # | P | Question |
|---|---|---|
| C1 | **P1** | Do customers need an account at all, or should they be able to browse and send enquiries without signing up? |
| C2 | **P1** | What information should we collect at sign-up? (name, email, phone, suburb/location, vehicle details?) Please mark which are essential — collecting less is better for privacy. |
| C3 | P2 | Besides yourself, how many staff or admin users will there be, and do they need different levels of access? |
| C4 | P3 | Would you like "Sign in with Google" as an option, or email and password only? |

## D. Contact and enquiries

| # | P | Question |
|---|---|---|
| D1 | **P1** | What must the enquiry form capture? Suggested: name, email, phone, vehicle make/model/year, part or service needed, message, optional photo upload. Which of these are mandatory, and is anything missing? |
| D2 | **P1** | Where should enquiries be sent — an email address (which one?), WhatsApp, or held in the admin panel for you to check? |
| D3 | P2 | Do you want separate forms for general enquiries, service bookings, collaboration/partnership, and parts enquiries — or one form with a dropdown? |
| D4 | P2 | Should customers be able to attach photos of their vehicle or the part they need? |
| D5 | P3 | Is there a response time you would like displayed (e.g. "we reply within 24 hours")? |

## E. Services

| # | P | Question |
|---|---|---|
| E1 | **P1** | Can you provide your list of services with a short description of each? |
| E2 | P2 | Should each service show pricing, a "from $X" figure, or no price at all? |
| E3 | P2 | Are there services you want given more prominence, or any you would rather not advertise publicly? |
| E4 | P3 | Do you serve a specific geographic area we should state on the site? |

## F. Portfolio and success stories

| # | P | Question |
|---|---|---|
| F1 | **P1** | Roughly how many completed projects can you supply for launch, and do you have photos (ideally before and after) plus a short write-up for each? |
| F2 | **P1** | Do you have existing customer reviews we can publish with the customer's name, or should new ones be collected? If neither is possible in time, are you comfortable with us using clearly-labelled sample testimonials for the demonstration? |
| F3 | P2 | Should the portfolio be filterable — by vehicle make, by service type, or not at all? |
| F4 | P2 | Are there any projects or customers that cannot be shown publicly for confidentiality reasons? |
| F5 | P3 | Should customers be able to submit a review through the website (subject to your approval before it appears), or will you add reviews yourself? |

## G. Admin panel

| # | P | Question |
|---|---|---|
| G1 | **P1** | Please confirm which of these you want to add and edit yourself without a developer: services, portfolio projects, parts listings, wanted/exchange posts, testimonials, enquiries, general page text and images. Anything not on your list, we can build as fixed content and save time. |
| G2 | P2 | Who should have admin access, and should any of them be restricted (e.g. able to manage listings but not edit page content)? |
| G3 | P3 | Would you like a simple dashboard showing recent enquiries and active listings when you log in? |

## H. Branding and content

| # | P | Question |
|---|---|---|
| H1 | **P1** | Do you have a logo, brand colours and fonts we should use, or do you need these designed? Please share any existing marketing material, business cards, or social media pages so the site matches. |
| H2 | **P1** | When can you provide photos, service descriptions and an initial parts list? Even an approximate date helps us plan our build order. |
| H3 | P2 | What tone should the site have — premium and performance-focused, or approachable local workshop? |
| H4 | P2 | Are there any automotive websites you like the look of, or any you strongly dislike? |
| H5 | P3 | Which social media accounts should we link to, and should an Instagram feed be embedded? |

## I. Scale and existing data

| # | P | Question |
|---|---|---|
| I1 | **P1** | Roughly how many parts listings do you expect at launch, and after a year — tens, hundreds, or thousands? |
| I2 | **P1** | Do you already track parts in a spreadsheet or system we could use as sample data, or should we build with invented sample data? |
| I3 | P2 | What details does a part listing need? Suggested: title, description, price, condition, quantity, compatible make/model/year, part number, photos. Anything to add or remove? |
| I4 | P2 | How would you like customers to search — free text, or filters by make, model, year, category and price? |

## J. Trust, privacy and legal

| # | P | Question |
|---|---|---|
| J1 | **P1** | What business details should appear publicly — trading name, ABN, full street address or suburb only, phone, email, opening hours? |
| J2 | P2 | What proof of legitimacy would you like shown — ABN, years in operation, qualifications, certifications, insurance, industry affiliations? |
| J3 | P2 | Do you have a privacy policy and terms of use? If not, are you comfortable with us drafting basic versions for you to review before publishing? |
| J4 | P2 | Customer enquiry and account data will be stored in a hosted database. Do you have a preference for it being hosted in Australia, and is there any data you would prefer we do not store? |

## K. Hosting, domain and launch

| # | P | Question |
|---|---|---|
| K1 | **P1** | Do you already own a domain name and hosting, or is this a prototype for now? |
| K2 | **P1** | Is the intention for this site to go live publicly at the end of the project, or is it a university deliverable only? This affects how we set up hosting and accounts. |
| K3 | P2 | If it goes live, who will maintain it afterwards, and would you like written handover documentation? |
| K4 | P3 | Do you want Google Analytics, and is appearing in Google search results a priority? |

## L. Process and priorities

| # | P | Question |
|---|---|---|
| L1 | **P1** | If we cannot complete everything in the available time, what are your top three priorities in order? |
| L2 | **P1** | Who is our main point of contact, what is the best email and phone number, and what is your preferred way to be contacted? |
| L3 | P2 | Would you be available for a short call (around 20 minutes) at the start, and a progress review partway through? |
| L4 | P2 | Are you happy to sign off on the confirmed requirements once we have documented them, so both sides have a clear record? |
| L5 | P3 | Is there anything you have seen on a competitor's site that you specifically want, or specifically want to avoid? |

---

## The twelve that matter most

If the client only answers a handful, push for these:

1. **A1** — marketplace model (payments or not)
2. **A3** — who can post listings
3. **B2** — how an exchange actually works
4. **C1** — are customer accounts required
5. **D1 / D2** — enquiry fields and where they go
6. **F2** — do real testimonials exist
7. **G1** — what must be admin-editable
8. **H2** — when does content arrive
9. **I1 / I2** — expected listing volume and existing data
10. **K2** — real launch or university deliverable
11. **L1** — top three priorities
12. **L2** — point of contact

## Assumptions to state if answers do not arrive

Include these in the submission so the absence of an answer does not block work:

- Marketplace is **listing and enquiry based**; no online payment in v1.
- Only **staff/admin** can create parts listings; customers browse and enquire.
- Customer accounts are **optional** — required only to post a Wanted/Exchange item.
- Enquiries are stored in the database **and** emailed to a single address.
- Sample/placeholder content is used where client content has not been supplied,
  clearly labelled as such.
- The site is deployed to a **free hosting tier** for demonstration, not to a
  client-owned domain.
