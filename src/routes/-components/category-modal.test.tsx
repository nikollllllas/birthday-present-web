import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CategoryModal } from './category-modal'

const mutate = vi.fn()

vi.mock('../../lib/api/queries', () => ({
  useCreateCategory: () => ({ mutate, isPending: false }),
  useUpdateCategory: () => ({ mutate: vi.fn(), isPending: false }),
}))

describe('CategoryModal', () => {
  it('renders with the "new category" heading and an empty name field', () => {
    render(<CategoryModal onClose={vi.fn()} />)
    expect(screen.getByText('Nova categoria')).toBeTruthy()
    expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('')
  })

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn()
    render(<CategoryModal onClose={onClose} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('submits the typed name via the create mutation', () => {
    render(<CategoryModal onClose={vi.fn()} />)
    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Roupas' },
    })
    fireEvent.click(screen.getByText('Salvar'))
    expect(mutate).toHaveBeenCalledWith(
      { category: 'Roupas' },
      expect.anything(),
    )
  })
})
