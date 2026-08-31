import { pool } from './db.js';

// Works out which slots can be booked on a given date.
//
// A slot is offered only if all of these are true:
//   1. the workshop is open that weekday
//   2. the slot has not been blocked by the owner
//   3. no accepted booking already holds it
//   4. it has not already passed
//
// Point 3 follows the requirement that a slot becomes unavailable once a
// booking is confirmed. A pending request does not hold a slot.

const pad = (n) => String(n).padStart(2, '0');

// "08:00:00" -> 480 minutes past midnight, and back again.
const toMinutes = (time) => {
  const [hours, minutes] = String(time).split(':').map(Number);
  return hours * 60 + minutes;
};
const toTime = (minutes) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:00`;

export async function slotsForDate(dateText) {
  const date = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(date.getTime())) return { open: false, reason: 'Not a valid date', slots: [] };

  // MySQL DAYOFWEEK counts Sunday as 1, and so does JavaScript getDay() + 1.
  const weekday = date.getDay() + 1;

  const [[day]] = await pool.query('SELECT * FROM availability WHERE weekday = ?', [weekday]);
  if (!day || day.isOpen === 0) {
    return { open: false, reason: 'The workshop is closed on this day', slots: [] };
  }

  // A block with no slot time closes the whole day.
  const [blocks] = await pool.query('SELECT * FROM blockedSlots WHERE blockDate = ?', [dateText]);
  const wholeDay = blocks.find((block) => block.slotTime === null);
  if (wholeDay) {
    return { open: false, reason: wholeDay.reason || 'Closed on this date', slots: [] };
  }
  const blockedTimes = blocks.map((block) => String(block.slotTime));

  // Only accepted bookings hold a slot.
  const [taken] = await pool.query(
    "SELECT slotTime FROM bookings WHERE bookingDate = ? AND status = 'Accepted'",
    [dateText]
  );
  const takenTimes = taken.map((booking) => String(booking.slotTime));

  // Slots in the past cannot be booked. Compared in local time.
  const now = new Date();
  const isToday = dateText === `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const minutesNow = now.getHours() * 60 + now.getMinutes();

  const slots = [];
  const closes = toMinutes(day.closeTime);

  for (let start = toMinutes(day.openTime); start + day.slotMinutes <= closes; start += day.slotMinutes) {
    const time = toTime(start);
    const reasons = [];

    if (blockedTimes.includes(time)) reasons.push('blocked');
    if (takenTimes.includes(time)) reasons.push('booked');
    if (isToday && start <= minutesNow) reasons.push('past');

    slots.push({ time, label: time.slice(0, 5), available: reasons.length === 0, reason: reasons[0] || null });
  }

  return { open: true, reason: null, slots };
}

// Used by the booking form and again on the server before saving, so a slot
// cannot be taken by editing the request.
export async function isSlotBookable(dateText, slotTime) {
  const { open, slots } = await slotsForDate(dateText);
  if (!open) return false;
  return slots.some((slot) => slot.time === String(slotTime) && slot.available);
}
