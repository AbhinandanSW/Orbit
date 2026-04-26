# Orbit Frontend

Vite + React + TypeScript SPA. Talks to the FastAPI backend via the `/api/*` proxy.

**Setup, dev workflow, Docker, and full project docs live in the [root README](../README.md).**

Local dev (assumes the backend is running on `:8000`):

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/, served by FastAPI in prod / Docker
npm run lint
```
