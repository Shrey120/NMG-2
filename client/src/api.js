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

// Turns 1450 into "$1,450".
export function money(amount) {
  return `$${Number(amount).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}
