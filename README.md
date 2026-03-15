# Atomity Frontend Challenge

A dashboard-style frontend built with Next.js App Router, TypeScript, Tailwind CSS, and React Query.

## Tech Stack

- Next.js (App Router)
- React 19
- TypeScript
- Tailwind CSS
- React Query (`@tanstack/react-query`)
- Framer Motion

## Project Structure

```text
.
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── ClusterDetail.tsx
│   │   ├── ClusterList.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ProviderGrid.tsx
│   │   ├── Providers.tsx
│   │   ├── QueryProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── BarChart.tsx
│   │       ├── Breadcrumb.tsx
│   │       ├── Gauge.tsx
│   │       └── Skeleton.tsx
│   ├── hooks/
│   │   └── useCloudData.ts
│   ├── lib/
│   │   └── transformData.ts
│   ├── tokens/
│   │   └── index.ts
│   └── types/
│       └── cloud.ts
├── .eslintrc.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Approach Taken

This project is organized around clear separation of responsibilities so it remains scalable and easy to maintain.

1. Feature-focused component composition
- Page composition happens in `src/components` through reusable building blocks.
- Domain components (such as provider or cluster views) are kept separate from generic UI components in `src/components/ui`.

2. Data fetching and caching with React Query
- Query setup is centralized with `QueryProvider` and app-level provider wiring in `src/app/providers.tsx`.
- Data access concerns are wrapped in `useCloudData`.

3. Data transformation isolated from rendering
- `src/lib/transformData.ts` handles data shaping before it reaches UI components.

4. Strong typing from the edge
- Shared domain interfaces live in `src/types/cloud.ts` and visual/semantic tokens in `src/tokens/index.ts`.

## Why This Architecture

The chosen architecture optimizes for:

- Readability: code is grouped by responsibility and intent.
- Reusability: shared UI primitives avoid duplication.
- Testability: transformation and fetching logic are separated from visual rendering.
- Scalability: adding new data views or provider types can be done without restructuring core app files.

## Scripts

- `npm run dev` starts the local development server.
- `npm run lint` runs Next.js linting.
- `npm run build` creates a production build.
- `npm run start` runs the built app.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Deployment Notes

This project is deployable on Vercel. Keep `next` and `eslint-config-next` on current patched versions to avoid deployment blocks from vulnerable framework versions.
