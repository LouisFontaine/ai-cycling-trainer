# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Description (WHY)

AI-powered cycling coach that generates personalized workouts based on training history, long-term goals, and weekly availability, syncing directly with Intervals.icu.

The app has two main concerns:

1. **Workout generation** — use AI to build structured cycling workouts tailored to a rider's fitness level (FTP, HR zones), goals, and weekly availability.
2. **Intervals.icu sync** — pull training history and push generated workout plans to the user's Intervals.icu calendar.

## Tech Stack (WHAT)

- **Language**: TypeScript (strict mode) across the entire codebase
- **Runtime**: Node.js 18 (see `.nvmrc`)
- **Package manager**: npm with npm workspaces (monorepo)
- **Backend**: NestJS 10 on Express, with Swagger/OpenAPI docs
- **Frontend**: React 18 + Vite 5, React Router DOM 6, TanStack React Query 5, Axios
- **Database**: SQLite (via Prisma ORM, easy switch to PostgreSQL)
- **Testing**: Jest with ts-jest
- **Linting**: ESLint with @typescript-eslint
- **Formatting**: Prettier (single quotes, trailing commas, 100 char width, 2-space indent)

## Monorepo Structure (WHAT)

```
ai-cycling-trainer/
├── apps/
│   ├── api/          # NestJS backend (port 3000)
│   └── web/          # React + Vite frontend
├── packages/
│   ├── shared-types/ # Centralized TypeScript types & interfaces
│   └── shared-utils/ # Reusable utilities (training load calcs, formatters, validators)
├── docker-compose.yml
├── tsconfig.base.json
└── package.json      # Root workspace config
```

### `apps/api` — NestJS Backend

Clean Architecture with 4 layers:

- `src/domain/` — Pure business logic: entities, repository interfaces, value objects
- `src/application/` — Orchestration: services and use cases, no httpException
- `src/infrastructure/` — Technical implementations: database, config, HTTP clients (Intervals.icu)
- `src/presentation/` — API surface: controllers, DTOs, guards
- `src/shared/` — Internal shared utilities

API prefix: `api/v1`. Swagger docs at `/api/docs`. CORS allows `http://localhost:3001`.

### `apps/web` — React Frontend

- `src/app/` — Global config (routing, providers)
- `src/components/` — Reusable components
- `src/pages/` — Page/view components
- `src/services/` — API services & business logic
- `src/lib/` — Utilities and helpers

In production (Docker), the frontend is served by nginx which proxies `/api` requests to the API service.

### `packages/shared-types` — Shared Types

Centralized types used by both apps. Key types include: `User`, `Workout`, `TrainingPlan`, `WorkoutInterval`, `PowerZones`, `HeartRateZones`, and enums like `WorkoutIntensity` (RECOVERY through ANAEROBIC) and `WorkoutType`.

### `packages/shared-utils` — Shared Utilities

Training load calculations (TSS, IF, CTL, ATL, TSB, normalized power), power/HR zone calculators, formatters, and validators. These are the core sports science functions the app relies on.

## Import Aliases

Use these path aliases for cross-package imports:

- `@ai-cycling-trainer/shared-types` → `packages/shared-types/src`
- `@ai-cycling-trainer/shared-utils` → `packages/shared-utils/src`
- `@` → `apps/web/src` (frontend only)

The API also has internal path aliases: `@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`.

## How to Work on This Project (HOW)

### Prerequisites

- Docker & Docker Compose

### Run the Application

```bash
docker compose build   # Build all Docker images
docker compose up -d   # Start all services
docker compose down    # Stop all services
```

### Services

| Service       | URL                            | Description               |
| ------------- | ------------------------------ | ------------------------- |
| Frontend      | http://localhost:3001          | React app served by nginx |
| API           | http://localhost:3000/api/v1   | NestJS backend            |
| Swagger       | http://localhost:3000/api/docs | API documentation         |
| Prisma Studio | http://localhost:5555          | Database inspection UI    |

### Environment Variables

All environment variables are defined in `docker-compose.yml`. Key variables:

- `DATABASE_URL` — SQLite file path (e.g., `file:./prisma/dev.db`)
- `JWT_SECRET` — Secret key for JWT token signing
- `JWT_EXPIRATION` — JWT token expiration (default `1d`)
- `CORS_ORIGIN` — Allowed origin (default `http://localhost:3001`)

After making changes, rebuild with `docker compose build` and restart with `docker compose up -d`.

## External Integration

- **Intervals.icu**: The app syncs with Intervals.icu for workout data. The API client lives in `apps/api/src/infrastructure/http/`. Refer to the Intervals.icu API documentation when implementing sync features.

## Conventions

- Follow Clean Architecture boundaries — domain layer has no dependencies on infrastructure or presentation.
- Use the shared packages for any types or utilities needed by both apps. Don't duplicate.
- NestJS code generation uses `@nestjs/schematics` (configured in `apps/api/nest-cli.json`).
- Prettier and ESLint configs are at the repo root.
- Always write code and any documentation in english
