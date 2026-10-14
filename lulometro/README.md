# Lulômetro (UI clone)

Faithful visual recreation of the Lulômetro dashboard using Vite + React + TypeScript + Tailwind CSS + shadcn-style components.

## Run locally

```bash
cd lulometro
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

- `/login` — split-screen login
- `/lulometro` — dashboard (enter any email/password on the login form; credentials are not persisted)

## Build

```bash
npm run build
npm run preview
```

## Notes

- Demo data only — not connected to the live API.
- Do not commit secrets or production passwords.
