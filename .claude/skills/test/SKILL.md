---
name: test
description: Run tests for the project. Accepts an argument to choose test type.
allowed-tools: Bash(npm run test:*)
---

Run the project tests based on the argument provided:

- If `$ARGUMENTS` is empty or `all`: run **both** unit and e2e tests sequentially
- If `$ARGUMENTS` is `unit`: run only unit tests
- If `$ARGUMENTS` is `e2e`: run only e2e tests

## Commands

All commands include `--coverage` to collect code coverage.

- **Unit tests**: `npm run test:unit -w apps/api -- --coverage`
- **E2E tests**: `npm run test:e2e -w apps/api -- --coverage`

## After running

Report a summary:
- Total tests passed / failed
- Code coverage summary (statements, branches, functions, lines percentages)
- If any test fails, show the failure details and suggest a fix
