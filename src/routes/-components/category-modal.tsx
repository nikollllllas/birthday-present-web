import { useEffect, useState } from 'react'
import type { Category } from '../../lib/api/queries'
import { useCreateCategory, useUpdateCategory } from '../../lib/api/queries'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--burgundy-glow)] backdrop-blur-sm">
      <div
        className="bg-[var(--surface)] border border-[rgba(128,0,32,0.2)] rounded-xl p-6 max-w-sm w-full mx-4 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_28px_56px_rgba(128,0,32,0.07),0_8px_22px_rgba(0,0,0,0.05)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
      >
        <h2 id="category-modal-title" className="font-display italic text-[var(--ink)] text-xl mb-4">
          {category ? 'Editar categoria' : 'Nova categoria'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category-name" className="block text-[0.8rem] font-medium text-[var(--ink-soft)] mb-1">
              Nome
            </label>
            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-[var(--gray-border)] rounded-lg px-3 py-2 text-sm bg-[var(--gray-table)] text-[var(--ink)] focus:outline-none focus:border-[var(--burgundy)]"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-lg text-sm border border-[var(--gray-border)] text-[var(--ink-soft)] hover:bg-[var(--blush)] disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-lg text-sm bg-[var(--burgundy)] text-white hover:bg-[var(--burgundy-deep)] disabled:opacity-50"
            >
              {isPending ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
