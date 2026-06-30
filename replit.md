# MedScope AI

## Overview

MedScope AI is a medical health assistant web application that provides AI-powered symptom analysis and medical image analysis. Users can describe their symptoms for text-based analysis or upload images of visible symptoms for visual analysis using AI. The app generates follow-up questions, analyzes responses, and stores inquiry results in a PostgreSQL database. It is built by the "Champions Crew" team associated with Al Ittihad Schools.

Key features:
- **Symptom Checker**: Multi-step flow where users describe symptoms, answer AI-generated follow-up questions, then receive an analysis
- **Vision AI**: Upload medical images for AI-powered visual analysis
- **Health Profile**: Optional user health profile (gender, weight, height, goals)
- **Result Pages**: Persistent analysis results stored in the database and viewable by ID
- **Dark/Light Theme**: Theme toggle with system preference support
- **PWA Support**: Service worker and manifest for installability

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, custom medical blue color scheme
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **File Upload**: react-dropzone for drag-and-drop image uploads
- **Build Tool**: Vite with React plugin
- **Path Aliases**: `@/*` maps to `client/src/*`, `@shared/*` maps to `shared/*`

### Backend Architecture
- **Framework**: Express 5 on Node.js with TypeScript
- **Runtime**: tsx for development, esbuild for production bundling
- **API Design**: REST endpoints defined in `shared/routes.ts` with Zod schemas for input validation and response types
- **AI Integration**: OpenAI SDK configured via Replit AI Integrations (environment variables `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`)
- **Key Endpoints**:
  - `POST /api/follow-up` - Generate follow-up questions based on symptoms
  - `POST /api/analyze` - Analyze symptoms with follow-up answers
  - `POST /api/vision` - Analyze uploaded medical images
  - `GET /api/inquiries/:id` - Retrieve stored analysis results
- **Replit Integrations**: Pre-built modules in `server/replit_integrations/` for audio (voice chat), chat (conversations), image generation, and batch processing

### Data Storage
- **Database**: PostgreSQL via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (main app schema), `shared/models/chat.ts` (chat/conversation schema)
- **Migrations**: Drizzle Kit with `drizzle-kit push` command (`npm run db:push`)
- **Main Tables**:
  - `inquiries` - Stores symptom analysis results (symptoms, response, type, imageUrl, isSevere, createdAt)
  - `conversations` - Chat conversation sessions
  - `messages` - Individual messages within conversations

### Shared Code
- `shared/schema.ts` - Database table definitions and Zod insert schemas
- `shared/routes.ts` - API route definitions with Zod input/output schemas, used by both client and server for type safety
- `shared/models/chat.ts` - Chat-related database models

### Build & Development
- **Dev**: `npm run dev` runs tsx with Vite dev server middleware for HMR
- **Build**: `npm run build` runs a custom script that builds the client with Vite and the server with esbuild
- **Production**: `npm start` runs the compiled server from `dist/index.cjs`
- **Type Check**: `npm run check` runs TypeScript compiler
- **Database**: `npm run db:push` pushes schema changes to PostgreSQL

### Key Design Patterns
- Shared Zod schemas between client and server for end-to-end type safety
- Storage pattern: `IStorage` interface in `server/storage.ts` with `DatabaseStorage` implementation
- Query client configured with infinite stale time and no auto-refetch for explicit data management
- CSS variables-based theming system supporting light/dark modes

## External Dependencies

### Required Services
- **PostgreSQL Database**: Connected via `DATABASE_URL` environment variable. Required for all data persistence.
- **OpenAI API (via Replit AI Integrations)**: Connected via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`. Used for symptom analysis, follow-up question generation, and vision analysis. Uses models like `gpt-5.2`.

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit` / `drizzle-zod` - Database ORM and schema management
- `express` v5 - HTTP server
- `openai` - OpenAI API client
- `@tanstack/react-query` - Server state management
- `react-hook-form` + `zod` - Form handling and validation
- `framer-motion` - Animations
- `react-dropzone` - File upload
- `wouter` - Client-side routing
- `react-markdown` - Rendering AI analysis results
- `react-icons` - Social media icons
- `vaul` - Drawer component
- `recharts` - Charts (available but usage unclear from visible code)
- `react-day-picker` - Calendar component

### Fonts
- Google Fonts: Inter (body), Outfit (display), DM Sans, Fira Code, Geist Mono, Architects Daughter