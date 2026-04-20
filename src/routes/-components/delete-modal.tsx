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
