# AI Cycling Trainer

AI-powered cycling coach that generates personalized workouts based on training history, long-term goals, and weekly availability, syncing directly with Intervals.icu.

## Architecture

This project uses a monorepo architecture with:

- **NestJS** for the backend API with Clean Architecture (Layered)
- **React + Vite** for the web frontend
- **TypeScript** everywhere
- **Docker Compose** for local orchestration
- **npm workspaces** for monorepo management

### Project structure

```
ai-cycling-trainer/
├── apps/
│   ├── api/          # NestJS backend with Clean Architecture
│   └── web/          # React + Vite frontend (served by nginx)
├── packages/
│   ├── shared-types/ # Shared TypeScript types
│   └── shared-utils/ # Shared utilities
├── docker-compose.yml
└── .claude/          # Claude Code configuration & skills
```

## Quick start

### Prerequisites

- Docker & Docker Compose

### Running the application

```bash
# Build Docker images
docker compose build

# Start all services
docker compose up -d

# Stop services
docker compose down
```

### Available services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3001 | React application |
| API | http://localhost:3000/api/v1 | NestJS API |
| Swagger | http://localhost:3000/api/docs | API documentation |
| Prisma Studio | http://localhost:5555 | Database inspection UI |

### Configuration

Environment variables are defined in `docker-compose.yml`. For a test environment, the default values are sufficient. For production, make sure to update `JWT_SECRET`.

## Documentation

- [API documentation](apps/api/README.md) — Clean Architecture, layer structure
- [Frontend documentation](apps/web/README.md) — Tech stack, structure
- [Shared types](packages/shared-types/README.md) — TypeScript types
- [Shared utilities](packages/shared-utils/README.md) — Utility functions

## Integrations

- **Intervals.icu**: Workout and training plan synchronization

## License

MIT
