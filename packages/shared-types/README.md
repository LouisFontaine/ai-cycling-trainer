# @ai-cycling-trainer/shared-types

Shared TypeScript types between the API and the frontend.

## Structure

```
src/
├── common.ts            # Common types (Entity, global enums)
├── workout/             # Workout-related types
├── user/                # User-related types
├── training-plan/       # Training plan-related types
├── auth/                # Authentication-related types
└── index.ts             # Main export
```

## Usage

In the API or frontend:

```typescript
import { Workout, CreateWorkoutDto, User } from '@ai-cycling-trainer/shared-types';
```

## Conventions

- **Main interfaces**: Types for complete entities (e.g., `Workout`, `User`)
- **DTOs**: Types for data transfers (e.g., `CreateWorkoutDto`, `UpdateUserDto`)
- **Enums**: Types for enumerated values (e.g., `WorkoutType`, `WorkoutIntensity`)

## Build

```bash
npm run build
```

Types are compiled into `dist/` and can be imported by other packages in the monorepo.
