import { apiFetch } from './client'

export interface TravelDiary {
  id: number
  title: string
  destination: string | null
  tripDate: string | null
  coverUrl: string | null
  accentColor: string
  content: string | null
  photos: string | null
  sortOrder: number
  createTime: string
}

export function getTravelDiaryList(): Promise<TravelDiary[]> {
  return apiFetch<TravelDiary[]>('/ip/travel-diary/list')
}

export function getTravelDiaryById(id: number): Promise<TravelDiary | null> {
  return apiFetch<TravelDiary | null>(`/ip/travel-diary/get?id=${id}`)
}

/** 将 photos 字段从 JSON 字符串解析为数组 */
export function parsePhotos(photos: string | null): string[] {
  if (!photos) return []
  try { return JSON.parse(photos) } catch { return [] }
}
