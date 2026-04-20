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
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
        <h2 id="category-modal-title" className="text-lg font-semibold mb-4">
          {category ? 'Editar categoria' : 'Nova categoria'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium mb-1">Nome</label>
            <input
              id="category-name"
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
