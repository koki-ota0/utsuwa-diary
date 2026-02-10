# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
npm run test         # Run all tests with Vitest
npx vitest run src/__tests__/ItemRegister.test.tsx  # Run a single test file
```

## Architecture

Utsuwa Diary is a React + TypeScript app for cataloging ceramics/tableware ("utsuwa"). Built with Vite.

### Structure

- **Pages** (`src/pages/`): Top-level views - `Home`, `ItemRegister` (add new items), `MyShelf` (view collection)
- **Components** (`src/components/`): Reusable UI organized by type (`layout/`, `forms/`, `common/`)
- **Storage** (`src/utils/storage.ts`): localStorage persistence layer for items and usage logs

### Data Model

Two localStorage-persisted collections:

- **Items** (`StoredItem`): Ceramics with id, name, category, thumbnailUrl, optional brandShop/notes
- **Usage Logs** (`UsageLog`): Tracks when items are used (itemId, itemName, category, usedAt)

Categories: `Plate | Cup | Vase | Bowl | Misc`

### Testing

Tests in `src/__tests__/` use Vitest + React Testing Library + jsdom. Setup file imports `@testing-library/jest-dom/vitest` for DOM matchers.
