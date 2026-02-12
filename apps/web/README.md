# AI Cycling Trainer - Frontend Web

React frontend application with Vite

> For running the application, see the root [README.md](../../README.md).

## Tech stack

- **React 18**: UI library
- **Vite 5**: Build tool and dev server
- **TypeScript**: Type safety
- **TailwindCSS v4**: Styling
- **React Query**: Data fetching and state management
- **React Router**: Navigation
- **react-hook-form**: Form management
- **Axios**: HTTP client

## Structure

```
src/
├── app/         # Global configuration (routing, providers)
├── components/  # Reusable components
├── pages/       # Application pages/views
├── services/    # API services and business logic
└── lib/         # Utilities and helpers
```

## Configuration

The Vite proxy automatically redirects `/api/*` to the backend at `http://localhost:3000`.
