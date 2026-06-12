# Production Deployment

## Backend

Required environment variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
CORS_ORIGIN="https://your-frontend-domain.com"
JWT_SECRET="use-a-long-random-secret-at-least-32-characters"
JWT_EXPIRES_IN="7d"
```

Production commands:

```bash
npm install --prefix backend
npm run build --prefix backend
npm run db:deploy
npm run start:backend
```

Seed only when you intentionally want demo data:

```bash
npm run db:seed
```

## Frontend

If frontend and backend are served from the same domain:

```env
VITE_API_BASE_URL="/api"
```

If deployed separately:

```env
VITE_API_BASE_URL="https://your-backend-domain.com/api"
```

Build command:

```bash
npm install --prefix frontend
npm run build --prefix frontend
```

Deploy the generated `frontend/dist` folder.
