# AI Cycling Trainer - API

NestJS backend with Clean Architecture (Layered)

> For running the application and available services, see the root [README.md](../../README.md).

## Architecture

This project follows Clean Architecture principles with a separation into 4 layers:

### Folder structure

```
src/
├── domain/              # Business core (zero external dependencies)
│   ├── entities/        # Business entities with logic
│   ├── value-objects/   # Immutable objects
│   └── repositories/    # Repository interfaces
│
├── application/         # Orchestration and use cases
│   ├── use-cases/       # One file per use case
│   └── services/        # Application services
│
├── infrastructure/      # Technical implementations
│   ├── database/        # ORM, migrations, repositories
│   ├── http/            # External HTTP clients
│   └── config/          # Configuration modules
│
├── presentation/        # API interface
│   ├── controllers/     # REST endpoints
│   ├── dtos/            # Data Transfer Objects
│   └── guards/          # Auth, validation
│
└── shared/              # Internal shared API code
    ├── decorators/
    ├── interceptors/
    └── filters/
```

### Dependency flow

```
Presentation → Application → Domain
Infrastructure → Application → Domain
```

**Golden rule**: Everything depends on the Domain, never the other way around.

### Layer responsibilities

**Domain Layer**

- Pure TypeScript, zero external dependencies
- Contains critical business logic
- Defines contracts (interfaces) without implementation

**Application Layer**

- Orchestrates use cases
- Coordinates domain and infrastructure
- Depends only on the domain

**Infrastructure Layer**

- Implements technical details
- Database, external APIs, etc.
- May depend on domain and application

**Presentation Layer**

- API entry points (controllers)
- Input validation (DTOs)
- Response transformation

## Testing

```bash
# Unit tests (from root)
npm run test -w apps/api

# E2E tests (from root)
npm run test:e2e
```
