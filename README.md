# Predictor Backend

Backend API for a sports prediction platform (F1-focused). Users authenticate, submit predictions on match questions, join public or private leagues, and compete on leaderboards. Admins manage teams, players, matches, questions, and point calculation.

Built with **Fastify**, **TypeScript**, **Prisma** (PostgreSQL, multi-schema), **Redis**, and **BullMQ** for background jobs.

## Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20+ |
| Framework | Fastify 5 |
| ORM | Prisma 7 (PostgreSQL) |
| Auth | JWT (`@fastify/jwt`), bcrypt |
| Queue | BullMQ + Redis |
| API docs | Swagger UI at `/docs` |

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- (Optional) Docker & Docker Compose

## Environment variables

Create a `.env` file in the project root:

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/predictor
JWT_SECRET=your-secret-at-least-10-chars
REDIS_URL=redis://localhost:6379
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Min. 10 characters for signing tokens |
| `REDIS_URL` | No | Defaults to `redis://localhost:6379` |
| `PORT` | No | Defaults to `3000` |
| `HOST` | No | Defaults to `0.0.0.0` |
| `NODE_ENV` | No | `development` \| `production` \| `test` |

## Local development

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Apply database schema (or use migrations — see below)
npx prisma db push

# Start dev server (hot reload)
npm run dev
```

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`

The dev server also starts the BullMQ worker (`src/jobs/worker.ts`) for background tasks.

## Database

Prisma uses multiple PostgreSQL schemas: `login`, `master`, `admin`, `gameplay`, `rank`, and `league`.

```bash
# Run migrations (preferred for team workflows)
npx prisma migrate dev

# Reset database (destructive)
npx prisma migrate reset
```

## Seeding

Populate F1 teams, players, and matches from bundled raw data:

```bash
npm run seed:f1
```

Seed league types:

```bash
npm run seed:league
```

Admin seed routes are also available under `/admin/api/seed` when the server is running.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with `tsx watch` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Push schema + run production build |
| `npm run seed:f1` | Seed F1 master data |
| `npm run seed:league` | Seed league types |

## API overview

| Prefix | Area |
|--------|------|
| `/api/auth` | Registration, login |
| `/api/predictions` | User predictions |
| `/api/leaderboard` | Match and season leaderboards |
| `/api/league` | Public and private leagues |
| `/admin/api/matches` | Match CRUD |
| `/admin/api/teams` | Teams |
| `/admin/api/players` | Players |
| `/admin/api/questions` | Prediction questions |
| `/admin/api/pointscalculation` | Points calculation |
| `/admin/api/matchstatusupdate` | Match status updates |
| `/admin/api/adminleague` | Admin league management |
| `/admin/api/adminleaguetype` | League types |
| `/admin/api/seed` | Data seeding endpoints |

Protected routes use JWT authentication via the `authenticate` hook.

## Docker

Start PostgreSQL, Redis, and the API together:

```bash
docker compose up --build
```

After containers are up, sync the database and seed (in a second terminal):

```bash
docker compose exec api npx prisma db push
docker compose exec api npm run seed:f1
```

The API is available at `http://localhost:3000`. See `docker.md` for a longer Docker walkthrough.

## Project structure

```
src/
  app.ts              # Fastify app setup
  server.ts           # Entry point
  router.ts           # Route registration
  auth/               # Authentication
  matches/            # Matches
  teams/              # Teams
  players/            # Players
  questions/          # Prediction questions
  predictions/        # User predictions
  pointscalculation/  # Scoring logic
  leaderboard/        # Leaderboards
  leagues/            # Leagues
  adminLeague/        # Admin league config
  jobs/               # BullMQ queue & worker
  scripts/            # Seed & transform scripts
prisma/
  schema.prisma       # Data model
  migrations/         # SQL migrations
```

## Related docs

- `notes.md` — setup notes and workflows
- `docker.md` — Docker concepts and compose usage 
- `src/backgroundservice.md` — background jobs with BullMQ 
