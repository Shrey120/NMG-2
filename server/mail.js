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

export const transport = canSend
  ? nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port,
      // Port 465 is encrypted from the start; 587 upgrades itself.
      secure: port === 465,
      auth: process.env.MAIL_USER
        ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD }
        : undefined,
    })
  : null;

// The owner's address, read from Business details every time so a change in
// the admin panel takes effect immediately.
export async function ownerAddress() {
  const [[details]] = await pool.query('SELECT email FROM businessDetails WHERE id = 1');
  return details?.email || process.env.MAIL_USER;
}

async function send(to, subject, body, replyTo) {
  if (!canSend) {
    console.log(`\n--- email (MAIL_HOST is blank, so not sent) ---\nTo: ${to}\nSubject: ${subject}\n\n${body}\n---\n`);
    return;
  }

  // A failed email must never break the booking or enquiry that triggered
  // it - those are already saved by this point - so the error is only printed.
  try {
    await transport.sendMail({ from: process.env.MAIL_USER, to, replyTo, subject, text: body });
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
    booking.email
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
    ].join('\n')
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
    ].join('\n')
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
    ].join('\n')
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
    enquiry.email
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
    ].join('\n')
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
