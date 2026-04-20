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
            <label htmlFor="login-email" className="block text-sm font-medium mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium mb-1">Senha</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
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
                      aria-label={`Editar ${p.name}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setModal({ type: 'delete-present', present: p })}
                      className="text-zinc-400 hover:text-red-600"
                      aria-label={`Excluir ${p.name}`}
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
                      aria-label={`Editar ${c.category}`}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setModal({ type: 'delete-category', category: c })}
                      className="text-zinc-400 hover:text-red-600"
                      aria-label={`Excluir ${c.category}`}
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
