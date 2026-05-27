import request from '@/config/axios'

export interface ThoughtVO {
  id?: number
  content: string
  mood?: string
  tags?: string
  imageUrl?: string
  status: number
}

export const getThoughtPage = async (params: any) =>
  await request.get({ url: '/ip/thought/page', params })

export const getThought = async (id: number) =>
  await request.get({ url: '/ip/thought/get', params: { id } })

export const createThought = async (data: ThoughtVO) =>
  await request.post({ url: '/ip/thought/create', data })

export const updateThought = async (data: ThoughtVO) =>
  await request.put({ url: '/ip/thought/update', data })

export const deleteThought = async (id: number) =>
  await request.delete({ url: '/ip/thought/delete', params: { id } })
