import request from '@/config/axios'

export interface ArticleVO {
  id?: number
  title: string
  slug: string
  coverUrl?: string
  summary?: string
  content?: string
  tags?: string
  category?: string
  pinned?: boolean
  status: number
}

export const getArticlePage = async (params: any) =>
  await request.get({ url: '/ip/article/page', params })

export const getArticle = async (id: number) =>
  await request.get({ url: '/ip/article/get', params: { id } })

export const createArticle = async (data: ArticleVO) =>
  await request.post({ url: '/ip/article/create', data })

export const updateArticle = async (data: ArticleVO) =>
  await request.put({ url: '/ip/article/update', data })

export const deleteArticle = async (id: number) =>
  await request.delete({ url: '/ip/article/delete', params: { id } })
