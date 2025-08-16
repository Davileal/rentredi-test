// Centralized API layer. Switch base URL by env var.
// If empty, dev proxy will handle relative paths.
const BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data?.error || message;
    } catch (_) {}
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

export const UsersAPI = {
  list: () => request("/users"),
  get: (id) => request(`/users/${id}`),
  create: (payload) =>
    request("/users", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/users/${id}`, { method: "DELETE" }),
};
