# @ai-cycling-trainer/shared-utils

Shared utilities between the API and the frontend.

## Structure

```
src/
├── validators/          # Validation functions
├── formatters/          # Data formatting
├── constants/           # Constants and zone calculations
├── calculations/        # Training load calculations
└── index.ts             # Main export
```

## Usage

```typescript
import {
  formatDuration,
  formatPower,
  calculatePowerZonesFromFTP,
  calculateTSS,
  isValidFTP,
} from '@ai-cycling-trainer/shared-utils';

// Formatting
const duration = formatDuration(3600); // "1h 0m"
const power = formatPower(250); // "250W"

// Zone calculation
const zones = calculatePowerZonesFromFTP(250);
// { z1: { min: 0, max: 137 }, z2: { min: 140, max: 187 }, ... }

// TSS calculation
const tss = calculateTSS(200, 3600, 250); // Training Stress Score

// Validation
const isValid = isValidFTP(250); // true
```

## Build

```bash
npm run build
```

## Tests

```bash
npm test
```
