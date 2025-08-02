# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Project Architecture

This is a React + TypeScript + Vite workout tracking application with Google authentication.

### Core Architecture

- **Single Page Application**: Uses custom page routing instead of React Router for navigation
- **Authentication Flow**: Google OAuth integration with Firebase, persists user session in localStorage
- **Page System**: Centralized page configuration in `src/config/pages.tsx` with PageIds enum
- **State Management**: React hooks with localStorage persistence for user sessions

### Key Directories

- `src/components/` - Reusable UI components
  - `Authentification/` - Auth-related components (login, register, user dashboard)
  - `PageNavigator/` - Bottom navigation component
- `src/contexts/` - React contexts (GoogleSignInContext for auth state)
- `src/pages/` - Page components (HomePage, ProgressPage, etc.)
- `src/routes/` - Routing logic (MainAppRouter)
- `src/services/` - Service layer (authService for Firebase authentication)
- `src/types/` - TypeScript type definitions
- `src/config/` - App configuration (page definitions)

### Important Technical Details

- **Path Aliases**: Uses `@/*` alias mapping to `src/*` (configured in vite.config.ts and tsconfig.json)
- **Authentication**: Uses Firebase for Google OAuth, stores user data in localStorage as JSON
- **Navigation**: Custom page navigation system using PageIds enum and window.history API
- **Styling**: Tailwind CSS v4 with Vite plugin integration
- **Charts**: Uses Recharts library for data visualization
- **Date Handling**: react-datepicker for date inputs, date-fns for date manipulation

### Type System

- `User` interface for authenticated user data (localId, idToken, email, displayName)
- `PageIds` enum and type for page navigation (home, dummy1, dummy2, profile constants)
- `ExerciseData` type for workout tracking data structure (date: string, exercises: {[exerciseName: string]: number})
- `AppPage` interface defining page configuration structure (id, label, icon, route, component)

### Component Patterns

- Uses React.FC type for function components
- Props interfaces defined locally in each component file
- Consistent use of React hooks (useState, useEffect, useContext)
- Error handling for localStorage parsing operations