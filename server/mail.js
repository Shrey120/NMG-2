import nodemailer from 'nodemailer';
import './env.js';
import { pool } from './db.js';

// How email works:
//
//   FROM - the mailbox in server/.env (MAIL_USER). This is the account that
//          does the sending, for example a Gmail account with an App Password.
//   TO   - owner emails go to the address in Admin panel -> Business details.
//          Change it there and the next booking or enquiry goes to the new
//          address, no restart needed. Customer emails go to the customer.
//
// If MAIL_HOST is blank, emails are printed in the terminal instead of sent.

const canSend = Boolean(process.env.MAIL_HOST);
const port = Number(process.env.MAIL_PORT) || 587;
const password = process.env.MAIL_PASSWORD?.replace(/\s+/g, '');

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const htmlPage = (eyebrow, title, intro, content, footer = 'Outlier Autowerke') => `<!doctype html>
<html><body style="margin:0;background:#f2f2f2;color:#111;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:620px;margin:0 auto;padding:28px 14px;">
  <div style="background:#050505;color:#fff;padding:22px 26px;">
    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#aaa;">${escapeHtml(eyebrow)}</div>
    <div style="font-size:24px;font-weight:700;margin-top:8px;">OUTLIER AUTOWERKE</div>
  </div>
  <div style="background:#fff;padding:30px 26px;border:1px solid #ddd;border-top:0;">
    <h1 style="font-size:25px;line-height:1.2;margin:0 0 10px;">${escapeHtml(title)}</h1>
    <p style="font-size:15px;line-height:1.6;color:#555;margin:0 0 24px;">${escapeHtml(intro)}</p>
    ${content}
  </div>
  <div style="padding:18px 8px;text-align:center;color:#777;font-size:12px;">${escapeHtml(footer)}</div>
</div></body></html>`;

const htmlRow = (label, value) => `<tr><td style="padding:9px 0;color:#777;font-size:12px;width:34%;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:9px 0;font-size:14px;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`;
const htmlButton = (href, label, dark = true) => `<a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 18px;margin:0 8px 8px 0;background:${dark ? '#050505' : '#fff'};color:${dark ? '#fff' : '#111'};border:1px solid #050505;text-decoration:none;font-size:13px;font-weight:700;">${escapeHtml(label)}</a>`;
const replyButton = () => htmlButton(`mailto:${process.env.MAIL_USER}`, 'Reply to workshop', false);

export const transport = canSend
  ? nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port,
      // Port 465 is encrypted from the start; 587 upgrades itself.
      secure: port === 465,
      auth: process.env.MAIL_USER
        ? { user: process.env.MAIL_USER, pass: password }
        : undefined,
    })
  : null;

// The owner's address, read from Business details every time so a change in
// the admin panel takes effect immediately.
export async function ownerAddress() {
  const [[details]] = await pool.query('SELECT email FROM businessDetails WHERE id = 1');
  const configured = details?.email?.trim();
  return configured && !configured.endsWith('.example') ? configured : process.env.MAIL_USER;
}

async function send(to, subject, body, replyTo, html) {
  if (!canSend) {
    console.log(`\n--- email (MAIL_HOST is blank, so not sent) ---\nTo: ${to}\nSubject: ${subject}\n\n${body}\n---\n`);
    return;
  }

  // A failed email must never break the booking or enquiry that triggered
  // it - those are already saved by this point - so the error is only printed.
  try {
    await transport.sendMail({ from: process.env.MAIL_USER, to, replyTo, subject, text: body, html });
  } catch (err) {
    console.error(`[email failed] ${subject} -> ${to}: ${err.message}`);
  }
}

const when = (booking) => `${booking.bookingDate} at ${String(booking.slotTime).slice(0, 5)}`;

// --- Bookings --------------------------------------------------------------

// Goes to the owner. Carries the two links that let them decide without
// signing in.
export async function emailOwnerNewBooking(booking, serviceTitle, baseUrl) {
  const accept = `${baseUrl}/api/bookings/action?token=${booking.actionToken}&do=accept`;
  const decline = `${baseUrl}/api/bookings/action?token=${booking.actionToken}&do=decline`;

  return send(
    await ownerAddress(),
    `New booking request: ${serviceTitle} on ${when(booking)}`,
    [
      'A new booking request is waiting for you.',
      '',
      `Service:  ${serviceTitle}`,
      `When:     ${when(booking)}`,
      `Customer: ${booking.name}`,
      `Email:    ${booking.email}`,
      `Phone:    ${booking.phone || 'not given'}`,
      `Vehicle:  ${booking.vehicle}`,
      '',
      booking.notes ? `Notes: ${booking.notes}` : 'No notes given.',
      '',
      'Decide without signing in:',
      '',
      `  ACCEPT BOOKING   ${accept}`,
      `  DECLINE BOOKING  ${decline}`,
      '',
      'Each link works once. You can also decide in the admin panel.',
    ].join('\n'),
    booking.email,
    htmlPage(
      'Action required',
      `New booking request: ${serviceTitle}`,
      'A customer has requested a service appointment. Review the details below and choose an action.',
      `<div style="background:#f7f7f7;padding:16px 18px;margin-bottom:22px;"><table style="width:100%;border-collapse:collapse;">${htmlRow('Service', serviceTitle)}${htmlRow('When', when(booking))}${htmlRow('Customer', booking.name)}${htmlRow('Email', booking.email)}${htmlRow('Phone', booking.phone || 'Not given')}${htmlRow('Vehicle', booking.vehicle)}${htmlRow('Notes', booking.notes || 'No notes given')}</table></div>
      <div style="margin-bottom:10px;font-size:13px;font-weight:700;">Decide without signing in</div>
      <div>${htmlButton(accept, 'Accept booking')}${htmlButton(decline, 'Decline booking', false)}</div>
      <p style="font-size:12px;color:#777;line-height:1.5;margin-top:16px;">Each button works once. You can also manage this booking from the admin panel.</p>`,
      'Reply to this email to contact the customer directly.'
    )
  );
}

// Goes to the customer straight away. Must be clear that nothing is confirmed.
export function emailCustomerPending(booking, serviceTitle) {
  return send(
    booking.email,
    `We have your booking request - ${serviceTitle}`,
    [
      `Hello ${booking.name},`,
      '',
      'Thank you for your booking request. We have received it.',
      '',
      '*** THIS BOOKING IS NOT YET CONFIRMED ***',
      'It is pending approval by the workshop. We will email you again once it',
      'has been accepted or declined.',
      '',
      `Service:   ${serviceTitle}`,
      `Requested: ${when(booking)}`,
      `Vehicle:   ${booking.vehicle}`,
      '',
      'Outlier Autowerke',
    ].join('\n'),
    undefined,
    htmlPage(
      'Booking received',
      'Your booking request is in',
      `Thanks ${booking.name}. The workshop has received your request and will review it shortly.`,
      `<div style="border-left:4px solid #050505;padding:13px 16px;background:#f7f7f7;margin-bottom:22px;font-weight:700;">Pending approval: this appointment is not confirmed yet.</div>
      <table style="width:100%;border-collapse:collapse;">${htmlRow('Service', serviceTitle)}${htmlRow('Requested', when(booking))}${htmlRow('Vehicle', booking.vehicle)}</table>
      <div style="margin-top:22px;">${replyButton()}</div>
      <p style="font-size:13px;line-height:1.6;color:#555;margin-top:24px;">We will email you again once the workshop accepts or declines this request.</p>`
    )
  );
}

export function emailCustomerAccepted(booking, serviceTitle) {
  return send(
    booking.email,
    `Booking confirmed - ${serviceTitle} on ${when(booking)}`,
    [
      `Hello ${booking.name},`,
      '',
      'Good news. Your booking has been accepted and is now confirmed.',
      '',
      `Service: ${serviceTitle}`,
      `When:    ${when(booking)}`,
      `Vehicle: ${booking.vehicle}`,
      '',
      'The slot is reserved for you. If you need to change it, reply to this email.',
      '',
      'Outlier Autowerke',
    ].join('\n'),
    undefined,
    htmlPage(
      'Booking confirmed',
      'Your appointment is confirmed',
      `Good news, ${booking.name}. The workshop has accepted your booking.`,
      `<div style="background:#f7f7f7;padding:16px 18px;"><table style="width:100%;border-collapse:collapse;">${htmlRow('Service', serviceTitle)}${htmlRow('When', when(booking))}${htmlRow('Vehicle', booking.vehicle)}</table></div>
      <div style="margin-top:22px;">${replyButton()}</div>
      <p style="font-size:13px;line-height:1.6;color:#555;margin-top:22px;">The time is reserved for you. Reply to this email if you need to make a change.</p>`
    )
  );
}

export function emailCustomerDeclined(booking, serviceTitle) {
  return send(
    booking.email,
    `About your booking request - ${serviceTitle}`,
    [
      `Hello ${booking.name},`,
      '',
      'Unfortunately we are not able to take your booking for:',
      '',
      `Service: ${serviceTitle}`,
      `When:    ${when(booking)}`,
      '',
      'The time you asked for has not been held. You are very welcome to choose',
      'another time on the website, or reply to this email and we will find one',
      'that works.',
      '',
      'Outlier Autowerke',
    ].join('\n'),
    undefined,
    htmlPage(
      'Booking update',
      'Your booking could not be accepted',
      `Hi ${booking.name}, unfortunately the workshop was not able to take this request.`,
      `<div style="background:#f7f7f7;padding:16px 18px;"><table style="width:100%;border-collapse:collapse;">${htmlRow('Service', serviceTitle)}${htmlRow('Requested', when(booking))}</table></div>
      <div style="margin-top:22px;">${replyButton()}</div>
      <p style="font-size:13px;line-height:1.6;color:#555;margin-top:22px;">The time has not been held. Reply to this email or choose another time on the website.</p>`
    )
  );
}

// --- Enquiries -------------------------------------------------------------

export async function emailOwnerEnquiry(enquiry) {
  return send(
    await ownerAddress(),
    `Website enquiry: ${enquiry.subject}`,
    [
      `Type:    ${enquiry.type}`,
      `From:    ${enquiry.name} <${enquiry.email}>`,
      `Phone:   ${enquiry.phone || 'not given'}`,
      `Vehicle: ${enquiry.vehicle || 'not given'}`,
      '',
      enquiry.message,
    ].join('\n'),
    enquiry.email,
    htmlPage(
      'New website enquiry',
      enquiry.subject,
      'A new message has been submitted through the website.',
      `<div style="background:#f7f7f7;padding:16px 18px;margin-bottom:22px;"><table style="width:100%;border-collapse:collapse;">${htmlRow('Type', enquiry.type)}${htmlRow('From', `${enquiry.name} <${enquiry.email}>`)}${htmlRow('Phone', enquiry.phone || 'Not given')}${htmlRow('Vehicle', enquiry.vehicle || 'Not given')}</table></div>
      <div style="font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(enquiry.message)}</div>`
    )
  );
}

export function emailCustomerEnquiryAck(enquiry) {
  return send(
    enquiry.email,
    'We have your enquiry - Outlier Autowerke',
    [
      `Hello ${enquiry.name},`,
      '',
      'Thank you for getting in touch. Your enquiry has reached the workshop and',
      'someone will reply to you shortly.',
      '',
      'This is an automatic acknowledgement, not an answer to your question.',
      '',
      `Your message: ${enquiry.subject}`,
      '',
      'Outlier Autowerke',
    ].join('\n'),
    undefined,
    htmlPage(
      'Message received',
      'We have your enquiry',
      `Thanks ${enquiry.name}. Your message has reached the workshop and someone will reply shortly.`,
      `<div style="background:#f7f7f7;padding:16px 18px;"><table style="width:100%;border-collapse:collapse;">${htmlRow('Subject', enquiry.subject)}</table></div>
      <div style="margin-top:22px;">${replyButton()}</div>
      <p style="font-size:13px;line-height:1.6;color:#555;margin-top:22px;">This is an automatic acknowledgement, not an answer to your question. You can reply directly to this email if you need to add anything.</p>`
    )
  );
}

// --- Staff accounts -------------------------------------------------------

// A heads-up, not an approval. Staff accounts work as soon as they are made.
export async function emailOwnerNewStaff(user) {
  return send(
    await ownerAddress(),
    `New staff account: ${user.name}`,
    [
      'A new staff account has just been created on the website.',
      '',
      `Name:  ${user.name}`,
      `Email: ${user.email}`,
      '',
      'Staff can see bookings, enquiries and customer details.',
      'If you do not recognise this person, remove their access under',
      'Staff accounts in the admin panel.',
    ].join('\n')
  );
}
