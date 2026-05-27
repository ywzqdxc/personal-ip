import { apiFetch } from './client'

export interface Article {
  id: number
  title: string
  slug: string
  coverUrl: string | null
  summary: string | null
  content: string | null
  tags: string | null
  category: string | null
  pinned: boolean
  viewCount: number
  createTime: string
}

export function getPublishedArticles(pageNo = 1, pageSize = 10): Promise<Article[]> {
  return apiFetch<Article[]>(`/ip/article/page?pageNo=${pageNo}&pageSize=${pageSize}`)
}

export function getArticleBySlug(slug: string): Promise<Article | null> {
  return apiFetch<Article | null>(`/ip/article/get?slug=${encodeURIComponent(slug)}`)
}
