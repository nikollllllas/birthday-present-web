import { useEffect, useState } from 'react'
import type { ConditionValue, Present } from '../../lib/api/queries'
import { useCategories, useCreatePresent, useUpdatePresent } from '../../lib/api/queries'

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
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl overflow-y-auto max-h-[90vh]" role="dialog" aria-modal="true" aria-labelledby="present-modal-title">
        <h2 id="present-modal-title" className="text-lg font-semibold mb-4">
          {present ? 'Editar presente' : 'Novo presente'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="present-name" className="block text-sm font-medium mb-1">Nome</label>
            <input
              id="present-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="present-place" className="block text-sm font-medium mb-1">Lugar</label>
            <input
              id="present-place"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="present-condition" className="block text-sm font-medium mb-1">Condição</label>
            <select
              id="present-condition"
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
            <label htmlFor="present-category" className="block text-sm font-medium mb-1">Categoria</label>
            <select
              id="present-category"
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
            <label htmlFor="present-note" className="block text-sm font-medium mb-1">Nota (opcional)</label>
            <input
              id="present-note"
              type="text"
              value={note}
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
