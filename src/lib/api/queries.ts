import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from './client'

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
