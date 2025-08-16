# RentRedi — Users CRUD (Monorepo)

A full-stack take-home style project with a clean monorepo that exposes User CRUD endpoints (Express + Firebase Realtime Database) and a React frontend (Vite) that consumes them. It auto-fetches latitude, longitude, and timezone from OpenWeather when creating/updating a user. Frontend uses Tailwind v4, Headless UI (delete confirmation modal), and SWR (cache + optimistic updates).

## ✨ Features

- API (Express)
    -CRUD for User with fields: id, name, zipCode, latitude, longitude, timezone
    - On create (and on zip change in update), fetches lat/lon/timezone from OpenWeather
    - Modular code: controllers, routes, services, repository, middlewares, config
    - Health endpoints: /health, /health/ready

- Database
    - Firebase Realtime Database (via firebase-admin)

- Frontend (React + Vite)
    - Tailwind v4 (via @tailwindcss/vite) — zero PostCSS config
    - Headless UI modal for destructive deletes
    - SWR hook (useUsers) for data fetching and optimistic mutations
    - Simple UX: search filter, create/edit form, table view, toast

- Testing
    - Jest + Supertest for API integration tests (mocks for OpenWeather/repo)
    - Ready-to-run test suite

## 🧱 Tech Stack

- Backend: Node.js, Express, Firebase Admin SDK, Axios, dotenv, CORS
- Frontend: React, Vite, Tailwind v4, Headless UI, Heroicons, SWR
- Tests (server): Jest, Supertest
- Monorepo: npm workspaces + concurrently

## 📁 Repository Structure

```bash
rentredi/
  package.json                 # npm workspaces + root scripts
  .gitignore
  README.md

  server/
    package.json
    .env                       # env vars for API (not committed)
    serviceAccountKey.json     # Firebase creds (DO NOT COMMIT)
    src/
      server.js                # HTTP entry
      app.js                   # Express app wiring
      routes/
        users.routes.js
        health.routes.js
      controllers/
        users.controller.js
      services/
        openweather.service.js
      repositories/
        users.repo.js
      middlewares/
        error.middleware.js
        notfound.middleware.js
      config/
        firebase.js
        env.js
      utils/
        time.js
    tests/
      setup.jest.js
      health.e2e.test.js
      users.e2e.test.js

  web/
    package.json
    vite.config.js             # includes @tailwindcss/vite plugin
    index.html
    src/
      index.css                # Tailwind v4 entry (@import "tailwindcss")
      main.jsx
      App.jsx
      services/
        api.js
      hooks/
        useUsers.js
      components/
        UserForm.jsx
        UserTable.jsx
        ConfirmDeleteModal.jsx
      utils/
        formatters.js
```

## 🚀 Getting Started
### Prerequisites

- Node.js 22
- A Firebase project with Realtime Database enabled

### 1) Install dependencies (root)

```bash
cd rentredi
npm install
```

### 2) Backend configuration (server/)

Create server/.env:

```ini
PORT=8080
FIREBASE_DB_URL=https://<YOUR_PROJECT_ID>.firebaseio.com
OPENWEATHER_API_KEY=7afa46f2e91768e7eeeb9001ce40de19
```

Place your Firebase service account at:

```bash
server/serviceAccountKey.json
```

### 3) Frontend configuration (web/)

For dev, no env required thanks to Vite proxy.

## ▶️ Run (dev)

From the repo root:

```bash
# starts API + Web concurrently
npm run dev
```

Individual:

```bash
npm run dev:api   # server on http://localhost:8080
npm run dev:web   # web    on http://localhost:5173
```

Dev proxy: `vite.config.js` proxies `/users` → `http://localhost:8080`, so the frontend can call relative `/users` paths without CORS pain.

## 🧪 Testing

### Monorepo test runner (root)

Use a single command to run all tests across workspaces:

```bash
# run all tests once (CI-friendly)
npm run test
```

### Notes

- Server tests: Jest (npm run test -w server)
- Web tests: Vitest (npm run test -w web)
- Coverage is generated separately per workspace; you can upload both reports to Codecov/Coveralls.

## 🔌 API Reference

Model

```ts
User {
  id: string
  name: string
  zipCode: string
  latitude: number
  longitude: number
  timezone: number
}
```

Endpoints

`GET /health`

```json
{ "status": "ok" }
```

`GET /health/ready`

```json
{ "ready": true }
```

`POST /users`

Create a user (fetch location fields from OpenWeather).

```json
// Request body
{ "name": "Jane Doe", "zipCode": "10001" }

// 201 Created
{
  "id": "abc123",
  "name": "Jane Doe",
  "zipCode": "10001",
  "latitude": 40.71,
  "longitude": -74.01,
  "timezone": -14400,
}
```

`GET /users`

List users.

```json
[
  { "id":"u1", "name":"A", "zipCode":"11111", "latitude":1, "longitude":2, "timezone":0 },
  ...
]
```
`GET /users/:id`

Retrieve one.

- `404` if not found.

`PUT /users/:id`

Update name and/or zip.

If `zipCode` changes, the API re-fetches `lat/lon/timezone`.

`DELETE /users/:id`

Delete a user.

- `200 { "message": "User deleted successfully" }`
- `404 if not found.`

### Quick cURL

```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","zipCode":"10001"}'

curl http://localhost:8080/users

curl -X PUT http://localhost:8080/users/<id> \
  -H "Content-Type: application/json" \
  -d '{"zipCode":"94105"}'

curl -X DELETE http://localhost:8080/users/<id>
```

## 🎨 Frontend Notes

- Tailwind v4
    - @tailwindcss/vite plugin is enabled in vite.config.js
    - CSS entry uses @import "tailwindcss" in src/index.css
    - You can customize tokens with @theme { ... } right in CSS

- Headless UI (Confirm Delete Modal)
    - Accessible, animated dialog component used before deleting a user

- SWR Hook (useUsers)
    - src/hooks/useUsers.js wraps list state + mutations
    - Optimistic updates (UI updates instantly on create/update/delete)
    - `App.jsx` is lean; it delegates data logic to the hook

## 🧰 Useful Scripts

Root (`rentredi/`):

```bash
{
  "workspaces": ["server", "web"],
  "scripts": {
    "dev:api": "npm --workspace server run dev",
    "dev:web": "npm --workspace web run dev",
    "dev": "concurrently -n API,WEB -c auto \"npm:dev:api\" \"npm:dev:web\"",
    "build": "npm -w web run build",
    "test": "npm -w server run test"
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```

## 🙌 Acknowledgments

- [Tailwind CSS v4](http://tailwindcss.com/)
- [Headless UI](https://headlessui.com/)
- [SWR](https://swr.vercel.app/pt-BR)
- [OpenWeather](https://openweathermap.org/current)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)