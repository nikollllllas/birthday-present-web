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

  const inputCls =
    'w-full border border-[var(--gray-border)] rounded-lg px-3 py-2 text-sm bg-[var(--gray-table)] text-[var(--ink)] focus:outline-none focus:border-[var(--burgundy)]'
  const labelCls = 'block text-[0.8rem] font-medium text-[var(--ink-soft)] mb-1'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--burgundy-glow)] backdrop-blur-sm">
      <div
        className="bg-[var(--surface)] border border-[rgba(128,0,32,0.2)] rounded-xl p-6 max-w-md w-full mx-4 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_28px_56px_rgba(128,0,32,0.07),0_8px_22px_rgba(0,0,0,0.05)] overflow-y-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="present-modal-title"
      >
        <h2 id="present-modal-title" className="font-display italic text-[var(--ink)] text-xl mb-4">
          {present ? 'Editar presente' : 'Novo presente'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="present-name" className={labelCls}>
              Nome
            </label>
            <input
              id="present-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="present-place" className={labelCls}>
              Lugar
            </label>
            <input
              id="present-place"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="present-condition" className={labelCls}>
              Condição
            </label>
            <select
              id="present-condition"
              value={conditionValue}
              onChange={(e) => setConditionValue(e.target.value as ConditionValue)}
              className={inputCls}
            >
              {CONDITION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="present-category" className={labelCls}>
              Categoria
            </label>
            <select
              id="present-category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              required
              className={inputCls}
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
            <label htmlFor="present-note" className={labelCls}>
              Nota (opcional)
            </label>
            <input
              id="present-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
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
              disabled={isPending || categoryId === 0}
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
