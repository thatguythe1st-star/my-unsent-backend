# The Unsent Project

## Overview

A modern web application inspired by "The Unsent Project" - a platform where users can anonymously share unsent messages to people they never told. Messages are displayed as colorful cards representing different emotions (angry, sad, peaceful, nostalgic, in love, empty). The app features a neon-themed dark aesthetic with smooth animations and a searchable message grid.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with custom neon-themed color palette and CSS variables
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for smooth card animations and page transitions
- **Build Tool**: Vite with path aliases (@/ for client/src, @shared for shared)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: REST endpoints defined in shared/routes.ts with Zod schemas for validation
- **Development**: tsx for TypeScript execution, Vite dev server with HMR

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: shared/schema.ts (shared between frontend and backend)
- **Migrations**: drizzle-kit with migrations stored in /migrations folder

### API Structure
All API routes are defined in `shared/routes.ts` with full type safety:
- `GET /api/messages` - List all messages with optional search filter
- `GET /api/messages/:id` - Get single message by ID
- `POST /api/messages` - Create new message with validation

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Page components
│       └── lib/          # Utilities
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared code (types, schemas, routes)
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod
└── migrations/       # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via DATABASE_URL environment variable
- **connect-pg-simple**: Session storage (available but not currently used)

### Core Libraries
- **drizzle-orm + drizzle-kit**: Database ORM and migration tooling
- **zod**: Runtime validation for API inputs/outputs
- **@tanstack/react-query**: Async state management

### UI/UX
- **Radix UI**: Accessible component primitives (via shadcn/ui)
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Frontend build tool with HMR
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Production build bundling (see script/build.ts)