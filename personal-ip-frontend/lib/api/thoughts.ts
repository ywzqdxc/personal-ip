import { apiFetch } from './client'

export interface Thought {
  id: number
  content: string
  mood: string | null
  tags: string | null
  imageUrl: string | null
  createTime: string
}

export function getPublishedThoughts(pageNo = 1, pageSize = 20): Promise<Thought[]> {
  return apiFetch<Thought[]>(`/ip/thought/page?pageNo=${pageNo}&pageSize=${pageSize}`)
}
