# TrueNorth Stack Overview

A Next.js application for tracking personal repos/projects and their status.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- ShadCN UI
- Prisma ORM
- SQLite (local dev)
- Firebase Auth
- Zustand (state management)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Firebase configuration:
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /dashboard          # Main dashboard page
  /projects/[id]      # Project detail pages
  /login              # Login page
  /api/projects       # API routes
/components/ui        # ShadCN UI components
/lib                  # Utilities (Prisma, Firebase, utils)
/stores               # Zustand stores
/prisma               # Prisma schema
```

## Features

- Dashboard with project grid
- Project detail pages with tabs
- CRUD operations for projects
- Firebase authentication
- Filter and search projects
- Track project status, bugs, milestones, and build history

