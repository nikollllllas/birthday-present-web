# Birthday Present Web

A birthday gift-list site: a public page where guests can browse and reserve
presents, and an admin panel for managing presents and categories. This repo
is the frontend only — it talks to a separate Express API
([birthday-present-api](../birthday-present-api)) over HTTP.

## Stack

- [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (file-based routing, SSR)
- React 19
- [Tailwind CSS v4](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query) for data fetching/caching
- [axios](https://axios-http.com/) as the HTTP client
- [Nitro](https://v3.nitro.build/) as the server build/deploy layer (via `nitro/vite`)

## How it talks to the API

All requests go through `src/lib/api/client.ts`, an axios instance pointed at
`VITE_API_URL`. The admin panel stores a bearer token in `localStorage` after
login and attaches it to requests; a 401 response clears the token and logs
the admin out.

## Local development

```bash
pnpm install
cp .env.example .env   # set VITE_API_URL to your local API, e.g. http://localhost:3000
pnpm dev
```

The app runs at `http://localhost:3000` (dev server) and expects the
birthday-present-api service to be running at the URL in `VITE_API_URL`.

Other scripts:

```bash
pnpm build     # production build
pnpm preview   # preview the production build locally
pnpm test      # run tests (vitest)
pnpm test:e2e  # run e2e tests (playwright)
pnpm lint      # eslint
pnpm format    # prettier --check
pnpm check     # prettier --write + eslint --fix
```

## Tests

- `pnpm test` — component/unit tests (Vitest + jsdom + React Testing Library).
  Mocks API calls, so no network/API needed.
- `pnpm test:e2e` — browser smoke tests (Playwright) against a real
  production build, with API responses stubbed via route interception. Run
  `pnpm exec playwright install` once first to download browser binaries.

## Deploy

This app deploys to [Vercel](https://vercel.com):

1. Push the repo to GitHub.
2. Import it in Vercel ([vercel.com/new](https://vercel.com/new)) — Vercel
   auto-detects TanStack Start + Nitro and configures the build.
3. Set the `VITE_API_URL` environment variable in the Vercel project settings
   to your deployed API URL (e.g. a Render-hosted birthday-present-api
   instance).
4. Deploy. The free Vercel Hobby tier is enough for this project.
