// One place that talks to the server. Every page uses these functions
// instead of calling fetch directly.

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function send(path, method, body) {
  const response = await fetch(`/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const get = (path) => send(path, 'GET');
export const post = (path, body) => send(path, 'POST', body);
export const put = (path, body) => send(path, 'PUT', body);
export const patch = (path, body) => send(path, 'PATCH', body);
export const remove = (path) => send(path, 'DELETE');

// Used for the enquiry form, because it can carry a photo. Form data cannot
// be sent as JSON, and the browser sets its own Content-Type for it.
export async function postForm(path, fields, file) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.append(key, value ?? ''));
  if (file) form.append('photo', file);

  const response = await fetch(`/api${path}`, {
    method: 'POST',
    headers: authHeader(),
    body: form,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Uploads a single file, used for project and service pictures.
export async function postFile(path, field, file) {
  const form = new FormData();
  form.append(field, file);

  const response = await fetch(`/api${path}`, { method: 'POST', headers: authHeader(), body: form });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

// Turns 1450 into "$1,450".
export function money(amount) {
  return `$${Number(amount).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}
