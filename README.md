# Habit Tracker Frontend

React SPA for the Habit Tracker backend API.

## Prerequisites

- Node.js 18+
- A running instance of the [Habit Tracker backend](../habit-tracker-backend) on `http://localhost:8000`

## Setup

```bash
npm install
```

## Running locally

```bash
npm run dev
```

Opens at **http://localhost:5173** (or the next available port).

The dev server proxies all `/api/*` requests to `http://localhost:8000`, so the backend must be running for login/register and habit operations to work.

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Serve it with any static file server, or preview it locally:

```bash
npm run preview
```

## Project structure

```
src/
├── api/           # Typed API functions (auth, habits) + Axios client
├── components/    # Reusable UI: Button, Input, Select, Modal, HabitCard, HabitForm
├── context/       # AuthContext — JWT token storage and login/logout/register actions
├── pages/         # LoginPage, RegisterPage, HabitsPage
└── App.tsx        # Route definitions with protected/guest guards
```

## Environment

By default the dev server proxies `/api` to `http://localhost:8000`. To point at a different backend, edit the `server.proxy` entry in `vite.config.ts`:

```ts
proxy: {
  "/api": {
    target: "http://your-backend-host:port",
    changeOrigin: true,
  },
},
```

For a production build, configure your reverse proxy (nginx, Caddy, etc.) to forward `/api` to the backend instead.
