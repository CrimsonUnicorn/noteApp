const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  auth: {
    requestOtp: (name: string, email: string, dob?: string) => request('/auth/request-otp', { method: 'POST', body: JSON.stringify({ name, email, dob }) }),
    verifyOtp: (email: string, otp: string, remember: boolean) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp, remember }) }),
    login: (email: string, remember: boolean) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, remember }) }),
    refresh: () => request('/auth/refresh', { method: 'POST' }),
    google: (idToken: string, remember: boolean) => request('/auth/google', { method: 'POST', body: JSON.stringify({ idToken, remember }) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
  },
  notes: {
    list: (token: string) => request('/notes', { headers: { Authorization: `Bearer ${token}` } }),
    create: (token: string, title: string, content: string) => request('/notes', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ title, content }) }),
    remove: (token: string, id: string) => request(`/notes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),
  }
}
