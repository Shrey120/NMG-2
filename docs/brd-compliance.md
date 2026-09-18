# BRD compliance

Business Requirements Document: *Digital Presence and Marketplace Website for
Outlier Autowerke*. Every requirement below has been checked against the running
system, not against the plan.

## 7. Key functional requirements

| Requirement | Met | Where it lives |
|---|---|---|
| Availability Management | Yes | `/admin/availability` - weekly hours per day with a slot length. Administrator only, because these hours are also what the public site displays. |
| Slot Blocking | Yes | `/admin/availability` - block a whole date or a single slot with a reason. Staff and administrators. |
| Booking Request | Yes | `/book` - four steps: service, date, slot, details. Slots come from the database, not free text. |
| Enquiry | Yes | `/contact`, with an optional photo and a consent tick. |
| Pending Status | Yes | New bookings are saved as `Pending`. The page and the acknowledgement email both say it is not confirmed. |
| Owner Notification | Yes | Email on every new booking and every enquiry, sent to the address in Admin panel → Business details. |
| Client Notification | Yes | Acknowledgement on submission, then a confirmation or decline email once the owner decides. |
| Booking Approval | Yes | `/admin/bookings`, or the Accept link in the email. |
| Booking Rejection | Yes | Same two places. The slot stays open. |
| Email Approval | Yes | `GET /api/bookings/action?token=...` - a single use random token, no sign in needed. |
| Slot Confirmation | Yes | Accepting reserves the slot. It disappears from the booking form and a second booking for it is refused by the server. |
| Database (MySQL) | Yes | MySQL only, 16 tables. |
| Design | Yes | Black and white, checked by sampling the rendered pixels: zero coloured pixels. |

## Section by section

**2.1 Service booking and availability.** Customers see only free slots.
Blocked dates and slots are removed from the calendar before they are shown.
Accepting a booking takes its slot out of circulation. A pending request does
not hold a slot, which follows the wording "once a booking is confirmed".

**2.2 Projects and service descriptions.** An administrator can add, edit and
delete services and portfolio projects, and upload a picture for each. Until the
client sends photographs, pages fall back to a placeholder marked "Sample" so
nothing pretends to be a real photo.

**2.3 Enquiry and booking notifications.** Submitting either one emails the
owner and sends the person an acknowledgement. The booking acknowledgement
states in plain terms that the booking is not yet confirmed.

**2.4 Booking approval and rejection.** Accepting emails a confirmation and
reserves the slot. Declining emails the customer and leaves the slot open unless
it has been blocked separately.

**2.5 Email based approval.** The owner's email carries an Accept and a Decline
link. Each carries a random single use token; using one updates the booking,
emails the customer and then invalidates the link. Opening it a second time
gives a plain "link already used" page. No sign in is needed, which is the point
of it.

**3. Database.** MySQL only. Booking statuses are exactly the four named in the
document: Pending, Accepted, Declined, Cancelled.

**5. Admin requirements.** View requests, view details and customer
information, accept, decline, block and unblock, view confirmed bookings, manage
availability, and review enquiries - all present.

## Two things worth knowing

**Where emails go.** Owner emails are sent to the address in Business
details, so the owner changes it in the admin panel. Sending needs a mailbox in
`server/.env`; see docs/email-setup.md.

**"Where technically supported" in 2.5 is doing real work.** Gmail and Outlook
strip buttons and scripts out of email, so Accept and Decline are plain links
that open a small confirmation page. That is the only approach that works
across mail clients, and it satisfies the requirement.

## How to demonstrate the whole flow

1. `/book` - pick a service, note that closed and fully booked days cannot be
   selected, choose a slot, submit.
2. The page says the booking is pending and not confirmed.
3. Open the owner's inbox (the Business details email). The booking request is there.
4. Click Accept in that email. It confirms.
5. Go back to `/book`, same date - that slot is gone.
6. Open the link a second time - "link already used".
7. `/admin/bookings` - the booking now sits under Accepted.
