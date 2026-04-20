# Admin Panel Design

**Date:** 2026-04-20  
**Status:** Approved

## Overview

Single-route admin panel at `/admin` for managing presents and categories. Uses JWT auth (Bearer token), axios + TanStack Query, and TanStack Router search params for tab state. Not indexed by search engines.

---

## Architecture

### New files

```
src/routes/
  admin.tsx                  ← single route: login form + admin panel
  -components/
    present-modal.tsx         ← create / edit present
    category-modal.tsx        ← create / edit category
    delete-modal.tsx          ← generic delete confirmation
src/lib/
  api.ts                     ← axios instance with Bearer interceptor
  queries.ts                 ← all TanStack Query hooks
public/
  robots.txt                 ← Disallow: /admin
```

### Dependencies to install

- `axios`
- `@tanstack/react-query`

---

## Authentication

- JWT stored in `localStorage`.
- `admin.tsx` reads token on render: absent → login form, present → panel.
- `POST /login` body: `{ email, password }` → response: `{ token }` (expires 7d).
- On successful login: save token to `localStorage`, switch to panel view (no route change).
- Logout button: clear `localStorage`, switch back to login view.
- Axios request interceptor: injects `Authorization: Bearer <token>` on every request.
- Axios response interceptor: on 401 → clear token + dispatch `auth:logout` custom event → `admin.tsx` listener resets to login view.

---

## SEO Blocking

Two complementary mechanisms:

1. `public/robots.txt`:
   ```
   User-agent: *
   Disallow: /admin
   ```
2. `head()` on the admin route:
   ```ts
   { name: 'robots', content: 'noindex, nofollow' }
   ```

---

## Data Flow

### `src/lib/api.ts`

Axios instance with:
- `baseURL` from `VITE_API_URL` env var
- Request interceptor: attach Bearer token
- Response interceptor: 401 → clear token + dispatch `auth:logout`

### `src/lib/queries.ts`

Hooks by resource:

| Hook | Method | Endpoint | Auth |
|------|--------|----------|------|
| `usePresents()` | GET | `/present` | public |
| `useCategories()` | GET | `/category` | protected (added to API) |
| `useCreatePresent()` | POST | `/present` | protected |
| `useUpdatePresent()` | PUT | `/present/:id` | protected |
| `useDeletePresent()` | DELETE | `/present/:id` | protected |
| `useCreateCategory()` | POST | `/category` | protected |
| `useUpdateCategory()` | PUT | `/category/:id` | protected |
| `useDeleteCategory()` | DELETE | `/category/:id` | protected |

Every mutation invalidates its resource's query cache on `onSuccess`.

---

## Modal State

Single `useState<ModalState>` in `admin.tsx`:

```ts
type ModalState =
  | { type: 'none' }
  | { type: 'create-present' }
  | { type: 'edit-present'; present: Present }
  | { type: 'delete-present'; present: Present }
  | { type: 'create-category' }
  | { type: 'edit-category'; category: Category }
  | { type: 'delete-category'; category: Category }
```

### `present-modal.tsx`

Props: `present?: Present`, `onClose: () => void`

Fields:
- Nome (text, required)
- Lugar (text, required)
- Condição (select: `available` / `limited` / `sold_out` / `online`)
- Nota (text, optional)
- Categoria (select populated from `useCategories()`)

Behavior: if `present` is provided → PUT, otherwise → POST.

### `category-modal.tsx`

Props: `category?: Category`, `onClose: () => void`

Fields:
- Nome (text, required)

Behavior: if `category` is provided → PUT, otherwise → POST.

### `delete-modal.tsx`

Props: `label: string`, `onConfirm: () => void`, `onClose: () => void`

Generic — used for both presents and categories. Shows item name, requires explicit confirmation click.

---

## Admin Panel UI

### Search param

```ts
validateSearch: (s) => ({
  tab: s.tab === 'categories' ? 'categories' : 'presents',
})
```

Default tab: `presents`.

### Login view

- Email + password fields
- Submit → `POST /login`
- Inline error message on 401

### Panel view

- Header: title + "Sair" button
- Tab bar: **Presentes** | **Categorias** (updates `?tab=` search param)
- "Novo" button per tab
- Tables:
  - **Presentes:** nome · lugar · condição · nota · categoria · actions (edit / delete)
  - **Categorias:** nome · actions (edit / delete)
- Modals rendered as `fixed inset-0` overlay, controlled by `ModalState`

---

## API Contract (reference)

### Present

```ts
interface Present {
  id: number
  name: string
  place: string
  condition: { value: 'available' | 'limited' | 'sold_out' | 'online'; label: string }
  note?: string
  categoryId: number
}
```

### Category

```ts
interface Category {
  id: number
  category: string
}
```

### GET /present response

Array of groups: `{ category: string; presents: Present[] }[]`
