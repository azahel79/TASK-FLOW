# Production Deployment

## Render Blueprint

This repo includes `render.yaml` with two services:

- `task-app-backend`: Node/Express API.
- `task-app-frontend`: Vite static site.

In Render, create a new Blueprint from your GitHub repo. Render will ask for the environment variables marked with `sync: false`.

## Backend Environment Variables

Set these on the backend service:

```env
NODE_ENV=production
DATABASE_URL=mysql://avnadmin:YOUR_PASSWORD@mysql-3aa1d9bf-azagd79-4e27.b.aivencloud.com:16435/defaultdb?ssl-mode=REQUIRED
JWT_SECRET=generate-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-on-render.onrender.com
```

Notes:

- `JWT_SECRET` must be at least 32 characters.
- Render can generate `JWT_SECRET` automatically from the Blueprint.
- Do not put secrets in GitHub.
- `CORS_ORIGIN` must match the final frontend URL. During the first deploy, you can temporarily use `*`, then replace it with the real frontend domain.

Backend commands configured in `render.yaml`:

```bash
npm install && npm run build && npm run prisma:deploy
npm run start
```

## Frontend Environment Variables

Set this on the frontend static site:

```env
VITE_API_BASE_URL=https://your-backend-on-render.onrender.com/api
```

After changing `VITE_API_BASE_URL`, redeploy the frontend because Vite bakes this value into the build.

Frontend commands configured in `render.yaml`:

```bash
npm install && npm run build
```

Static publish path:

```text
dist
```

## Manual Deploy Without Blueprint

Backend service:

- Root Directory: `backend`
- Build Command: `npm install && npm run build && npm run prisma:deploy`
- Start Command: `npm run start`
- Health Check Path: `/api/health`

Frontend static site:

- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Rewrite rule: `/*` -> `/index.html`

## Local Production Check

From repo root:

```bash
npm run build
```

Seed only when you intentionally want demo data:

```bash
npm run db:seed
```
