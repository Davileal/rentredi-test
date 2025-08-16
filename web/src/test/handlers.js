import { http, HttpResponse } from "msw";

let users = [
  { id: "u1", name: "Alice", zipCode: "11111", latitude: 1, longitude: 2, timezone: 0 },
  { id: "u2", name: "Bob",   zipCode: "22222", latitude: 3, longitude: 4, timezone: 3600 },
];

export const resetData = () => {
  users = [
    { id: "u1", name: "Alice", zipCode: "11111", latitude: 1, longitude: 2, timezone: 0 },
    { id: "u2", name: "Bob",   zipCode: "22222", latitude: 3, longitude: 4, timezone: 3600 },
  ];
};

export const handlers = [
  // List
  http.get("/users", () => {
    return HttpResponse.json(users, { status: 200 });
  }),

  // Create
  http.post("/users", async ({ request }) => {
    const body = await request.json();
    const { name, zipCode } = body || {};
    if (!name || !zipCode) {
      return HttpResponse.json({ error: "Name and zipCode are required" }, { status: 400 });
    }
    const created = {
      id: `u${users.length + 1}`,
      name,
      zipCode,
      latitude: 10,
      longitude: 20,
      timezone: 7200,
    };
    users.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  // Update
  http.put("/users/:id", async ({ params, request }) => {
    const { id } = params;
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }
    const patch = await request.json();
    users[idx] = { ...users[idx], ...patch };
    return HttpResponse.json(users[idx], { status: 200 });
  }),

  // Delete
  http.delete("/users/:id", ({ params }) => {
    const { id } = params;
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }
    users.splice(idx, 1);
    return HttpResponse.json({ message: "User deleted successfully" }, { status: 200 });
  }),
];
