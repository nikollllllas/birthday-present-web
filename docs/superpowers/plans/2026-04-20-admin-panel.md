# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a protected `/admin` route with JWT auth, TanStack Query + axios, and full CRUD (modals) for presents and categories.

**Architecture:** Single route `/admin` with two views (login form / panel) toggled by JWT presence in `localStorage`. Modals controlled by a discriminated union `ModalState` in `admin.tsx`. Tab state lives in `?tab=presents|categories` search param via TanStack Router. Axios interceptors handle Bearer injection and 401 auto-logout.

**Tech Stack:** React 19, TanStack Start, TanStack Router (file-based), `@tanstack/react-query`, `axios`, TypeScript, Tailwind v4, pnpm

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `public/robots.txt` | Create | Disallow /admin for crawlers |
| `src/lib/api.ts` | Create | Axios instance + Bearer + 401 interceptors |
| `src/lib/queries.ts` | Create | All types + TanStack Query hooks |
| `src/routes/__root.tsx` | Modify | Add `QueryClientProvider` |
| `src/routes/admin.tsx` | Create | Login form + panel + modal orchestration |
| `src/routes/-components/delete-modal.tsx` | Create | Generic delete confirmation modal |
| `src/routes/-components/category-modal.tsx` | Create | Create/edit category modal |
| `src/routes/-components/present-modal.tsx` | Create | Create/edit present modal |

---

## Task 1: Install dependencies and create robots.txt

**Files:**
- Modify: `package.json` (via pnpm)
- Create: `public/robots.txt`
- Create: `.env.local` (not committed — add to .gitignore if absent)

- [ ] **Step 1: Install axios and @tanstack/react-query**

```bash
cd /mnt/hd/birthday-present && pnpm add axios @tanstack/react-query
```

Expected output: packages added to `dependencies` in `package.json`.

- [ ] **Step 2: Create public/robots.txt**

```
User-agent: *
Disallow: /admin
```

Save to `public/robots.txt`.

- [ ] **Step 3: Create .env.local with API base URL**

```
VITE_API_URL=http://localhost:3000
```

Save to `.env.local`. Verify `.gitignore` already contains `.env.local` (TanStack Start scaffolds this by default; if not, add it).

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt package.json pnpm-lock.yaml
git commit -m "feat: install axios and react-query, add robots.txt"
```

---

## Task 2: API client

**Files:**
- Create: `src/lib/api.ts`

- [ ] **Step 1: Create `src/lib/api.ts`**

```ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    return Promise.reject(error)
  },
)
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/api.ts
git commit -m "feat: add axios api client with bearer and 401 interceptors"
```

---

## Task 3: Types and TanStack Query hooks

**Files:**
- Create: `src/lib/queries.ts`

- [ ] **Step 1: Create `src/lib/queries.ts`**

```ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './api'

export type ConditionValue = 'available' | 'limited' | 'sold_out' | 'online'

export interface Category {
  id: number
  category: string
}

export interface Present {
  id: number
  name: string
  place: string
  condition: { value: ConditionValue; label: string }
  note?: string | null
  categoryId: number
}

export interface PresentGroup {
  category: string
  presents: Present[]
}

export type CreatePresentInput = Omit<Present, 'id'>
export type UpdatePresentInput = Partial<CreatePresentInput> & { id: number }

// ── Queries ──────────────────────────────────────────────────────

export function usePresents() {
  return useQuery<PresentGroup[]>({
    queryKey: ['presents'],
    queryFn: async () => {
      const { data } = await api.get<PresentGroup[]>('/present')
      return data
    },
  })
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/category')
      return data
    },
  })
}

// ── Present mutations ─────────────────────────────────────────────

export function useCreatePresent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreatePresentInput) => api.post<Present>('/present', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['presents'] }),
  })
}

export function useUpdatePresent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdatePresentInput) =>
      api.put<Present>(`/present/${id}`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['presents'] }),
  })
}

export function useDeletePresent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/present/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['presents'] }),
  })
}

// ── Category mutations ────────────────────────────────────────────

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { category: string }) => api.post<Category>('/category', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, category }: Category) =>
      api.put<Category>(`/category/${id}`, { category }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/category/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/queries.ts
git commit -m "feat: add tanstack query hooks for presents and categories"
```

---

## Task 4: QueryClientProvider in root

**Files:**
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Add imports to `src/routes/__root.tsx`**

Add at the top of the file, after existing imports:

```ts
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
```

- [ ] **Step 2: Wrap body content with QueryClientProvider**

Inside `RootDocument`, create a `QueryClient` instance and wrap children:

```tsx
function RootDocument({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(128,0,32,0.15)]">
        <QueryClientProvider client={queryClient}>
          <Header />
          {children}
          <Footer />
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> }]}
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/__root.tsx
git commit -m "feat: add QueryClientProvider to root layout"
```

---

## Task 5: Delete modal

**Files:**
- Create: `src/routes/-components/delete-modal.tsx`

- [ ] **Step 1: Create `src/routes/-components/delete-modal.tsx`**

```tsx
interface DeleteModalProps {
  label: string
  isPending?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteModal({ label, isPending, onConfirm, onClose }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h2 className="text-lg font-semibold mb-2">Confirmar exclusão</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Tem certeza que deseja excluir <strong>{label}</strong>? Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/-components/delete-modal.tsx
git commit -m "feat: add delete confirmation modal component"
```

---

## Task 6: Category modal

**Files:**
- Create: `src/routes/-components/category-modal.tsx`

- [ ] **Step 1: Create `src/routes/-components/category-modal.tsx`**

```tsx
import { useEffect, useState } from 'react'
import type { Category } from '../../lib/queries'
import { useCreateCategory, useUpdateCategory } from '../../lib/queries'

interface CategoryModalProps {
  category?: Category
  onClose: () => void
}

export function CategoryModal({ category, onClose }: CategoryModalProps) {
  const [name, setName] = useState(category?.category ?? '')
  const create = useCreateCategory()
  const update = useUpdateCategory()
  const isPending = create.isPending || update.isPending

  useEffect(() => {
    setName(category?.category ?? '')
  }, [category])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (category) {
      update.mutate({ id: category.id, category: name }, { onSuccess: onClose })
    } else {
      create.mutate({ category: name }, { onSuccess: onClose })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          {category ? 'Editar categoria' : 'Nova categoria'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-lg text-sm bg-[rgb(128,0,32)] text-white hover:bg-[rgb(100,0,24)] disabled:opacity-50"
            >
              {isPending ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/-components/category-modal.tsx
git commit -m "feat: add category create/edit modal"
```

---

## Task 7: Present modal

**Files:**
- Create: `src/routes/-components/present-modal.tsx`

- [ ] **Step 1: Create `src/routes/-components/present-modal.tsx`**

```tsx
import { useEffect, useState } from 'react'
import type { ConditionValue, Present } from '../../lib/queries'
import { useCategories, useCreatePresent, useUpdatePresent } from '../../lib/queries'

const CONDITION_OPTIONS: { value: ConditionValue; label: string }[] = [
  { value: 'available', label: 'Disponível' },
  { value: 'limited', label: 'Estoque limitado' },
  { value: 'online', label: 'Somente online' },
  { value: 'sold_out', label: 'Esgotado' },
]

interface PresentModalProps {
  present?: Present
  onClose: () => void
}

export function PresentModal({ present, onClose }: PresentModalProps) {
  const { data: categories = [] } = useCategories()
  const create = useCreatePresent()
  const update = useUpdatePresent()
  const isPending = create.isPending || update.isPending

  const [name, setName] = useState(present?.name ?? '')
  const [place, setPlace] = useState(present?.place ?? '')
  const [conditionValue, setConditionValue] = useState<ConditionValue>(
    present?.condition.value ?? 'available',
  )
  const [note, setNote] = useState(present?.note ?? '')
  const [categoryId, setCategoryId] = useState<number>(present?.categoryId ?? 0)

  useEffect(() => {
    setName(present?.name ?? '')
    setPlace(present?.place ?? '')
    setConditionValue(present?.condition.value ?? 'available')
    setNote(present?.note ?? '')
    setCategoryId(present?.categoryId ?? 0)
  }, [present])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const conditionLabel = CONDITION_OPTIONS.find((o) => o.value === conditionValue)!.label
    const body = {
      name,
      place,
      condition: { value: conditionValue, label: conditionLabel },
      note: note || undefined,
      categoryId,
    }
    if (present) {
      update.mutate({ id: present.id, ...body }, { onSuccess: onClose })
    } else {
      create.mutate(body, { onSuccess: onClose })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-semibold mb-4">
          {present ? 'Editar presente' : 'Novo presente'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lugar</label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Condição</label>
            <select
              value={conditionValue}
              onChange={(e) => setConditionValue(e.target.value as ConditionValue)}
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900"
            >
              {CONDITION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-900"
            >
              <option value={0} disabled>
                Selecione uma categoria
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nota (opcional)</label>
            <input
              type="text"
              value={note ?? ''}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || categoryId === 0}
              className="px-4 py-2 rounded-lg text-sm bg-[rgb(128,0,32)] text-white hover:bg-[rgb(100,0,24)] disabled:opacity-50"
            >
              {isPending ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/-components/present-modal.tsx
git commit -m "feat: add present create/edit modal"
```

---

## Task 8: Admin route

**Files:**
- Create: `src/routes/admin.tsx`

- [ ] **Step 1: Create `src/routes/admin.tsx`**

```tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Category, Present } from '../lib/queries'
import {
  useCategories,
  useDeleteCategory,
  useDeletePresent,
  usePresents,
} from '../lib/queries'
import { CategoryModal } from './-components/category-modal'
import { DeleteModal } from './-components/delete-modal'
import { PresentModal } from './-components/present-modal'

type Tab = 'presents' | 'categories'

type ModalState =
  | { type: 'none' }
  | { type: 'create-present' }
  | { type: 'edit-present'; present: Present }
  | { type: 'delete-present'; present: Present }
  | { type: 'create-category' }
  | { type: 'edit-category'; category: Category }
  | { type: 'delete-category'; category: Category }

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (search.tab === 'categories' ? 'categories' : 'presents') as Tab,
  }),
  component: AdminPage,
})

// ── Root component ─────────────────────────────────────────────────

function AdminPage() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('admin_token'),
  )
  const [modal, setModal] = useState<ModalState>({ type: 'none' })
  const { tab } = Route.useSearch()
  const navigate = useNavigate({ from: '/admin' })

  useEffect(() => {
    function onLogout() {
      setToken(null)
    }
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  function handleLogout() {
    localStorage.removeItem('admin_token')
    setToken(null)
  }

  if (!token) {
    return <LoginForm onLogin={setToken} />
  }

  return (
    <>
      <AdminPanel
        tab={tab}
        modal={modal}
        setModal={setModal}
        onLogout={handleLogout}
        onTabChange={(t) => navigate({ search: { tab: t } })}
      />
      {modal.type === 'create-present' && (
        <PresentModal onClose={() => setModal({ type: 'none' })} />
      )}
      {modal.type === 'edit-present' && (
        <PresentModal
          present={modal.present}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'create-category' && (
        <CategoryModal onClose={() => setModal({ type: 'none' })} />
      )}
      {modal.type === 'edit-category' && (
        <CategoryModal
          category={modal.category}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'delete-present' && (
        <DeletePresentModal
          present={modal.present}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
      {modal.type === 'delete-category' && (
        <DeleteCategoryModal
          category={modal.category}
          onClose={() => setModal({ type: 'none' })}
        />
      )}
    </>
  )
}

// ── Login form ─────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post<{ token: string }>('/login', { email, password })
      localStorage.setItem('admin_token', data.token)
      onLogin(data.token)
    } catch {
      setError('Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg text-sm bg-[rgb(128,0,32)] text-white hover:bg-[rgb(100,0,24)] disabled:opacity-50"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}

// ── Admin panel ────────────────────────────────────────────────────

interface AdminPanelProps {
  tab: Tab
  modal: ModalState
  setModal: (m: ModalState) => void
  onLogout: () => void
  onTabChange: (t: Tab) => void
}

function AdminPanel({ tab, setModal, onLogout, onTabChange }: AdminPanelProps) {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Painel Admin</h1>
        <button
          onClick={onLogout}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Sair
        </button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-zinc-200 dark:border-zinc-700">
        {(['presents', 'categories'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-[rgb(128,0,32)] text-[rgb(128,0,32)]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {t === 'presents' ? 'Presentes' : 'Categorias'}
          </button>
        ))}
      </div>

      {tab === 'presents' ? (
        <PresentsTab setModal={setModal} />
      ) : (
        <CategoriesTab setModal={setModal} />
      )}
    </main>
  )
}

// ── Presents tab ───────────────────────────────────────────────────

function PresentsTab({ setModal }: { setModal: (m: ModalState) => void }) {
  const { data: groups = [], isLoading } = usePresents()
  const presents = groups.flatMap((g) =>
    g.presents.map((p) => ({ ...p, categoryName: g.category })),
  )

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModal({ type: 'create-present' })}
          className="px-4 py-2 rounded-lg text-sm bg-[rgb(128,0,32)] text-white hover:bg-[rgb(100,0,24)]"
        >
          + Novo presente
        </button>
      </div>
      {isLoading ? (
        <p className="text-sm text-zinc-500">Carregando…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-zinc-200 dark:border-zinc-700">
                <th className="pb-2 font-medium">Nome</th>
                <th className="pb-2 font-medium">Lugar</th>
                <th className="pb-2 font-medium">Condição</th>
                <th className="pb-2 font-medium">Categoria</th>
                <th className="pb-2 font-medium">Nota</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {presents.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="py-2 pr-3">{p.name}</td>
                  <td className="py-2 pr-3 text-zinc-500">{p.place}</td>
                  <td className="py-2 pr-3 text-zinc-500">{p.condition.label}</td>
                  <td className="py-2 pr-3 text-zinc-500">{p.categoryName}</td>
                  <td className="py-2 pr-3 text-zinc-500">{p.note ?? '—'}</td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <button
                      onClick={() => setModal({ type: 'edit-present', present: p })}
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mr-3"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setModal({ type: 'delete-present', present: p })}
                      className="text-zinc-400 hover:text-red-600"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Categories tab ─────────────────────────────────────────────────

function CategoriesTab({ setModal }: { setModal: (m: ModalState) => void }) {
  const { data: categories = [], isLoading } = useCategories()

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModal({ type: 'create-category' })}
          className="px-4 py-2 rounded-lg text-sm bg-[rgb(128,0,32)] text-white hover:bg-[rgb(100,0,24)]"
        >
          + Nova categoria
        </button>
      </div>
      {isLoading ? (
        <p className="text-sm text-zinc-500">Carregando…</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-zinc-200 dark:border-zinc-700">
                <th className="pb-2 font-medium">Nome</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <td className="py-2">{c.category}</td>
                  <td className="py-2 text-right whitespace-nowrap">
                    <button
                      onClick={() => setModal({ type: 'edit-category', category: c })}
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mr-3"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setModal({ type: 'delete-category', category: c })}
                      className="text-zinc-400 hover:text-red-600"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Delete wrappers (call hook here, not in DeleteModal) ───────────

function DeletePresentModal({ present, onClose }: { present: Present; onClose: () => void }) {
  const del = useDeletePresent()
  return (
    <DeleteModal
      label={present.name}
      isPending={del.isPending}
      onClose={onClose}
      onConfirm={() => del.mutate(present.id, { onSuccess: onClose })}
    />
  )
}

function DeleteCategoryModal({ category, onClose }: { category: Category; onClose: () => void }) {
  const del = useDeleteCategory()
  return (
    <DeleteModal
      label={category.category}
      isPending={del.isPending}
      onClose={onClose}
      onConfirm={() => del.mutate(category.id, { onSuccess: onClose })}
    />
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Start dev server and verify the route works**

```bash
pnpm dev
```

Open `http://localhost:3000/admin` — should show the login form.
Open `http://localhost:3000/admin?tab=categories` — after login, should land on the categories tab.
Verify `robots.txt` is served at `http://localhost:3000/robots.txt` and contains `Disallow: /admin`.

- [ ] **Step 4: Commit**

```bash
git add src/routes/admin.tsx
git commit -m "feat: add admin route with login form and crud panel"
```

- [ ] **Step 5: Push**

```bash
git push
```
