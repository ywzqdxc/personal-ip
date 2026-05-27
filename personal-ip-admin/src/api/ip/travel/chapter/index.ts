import request from '@/config/axios'

export interface ChapterVO {
  id?: number
  tripId: number
  num: string
  name: string
  chinese?: string
  dateLabel?: string
  region?: string
  country?: string
  area?: string
  coords?: string
  locationCn?: string
  time?: string
  tags?: string
  quote?: string
  caption?: string
  spots?: string
  coverImg?: string
  coverGrad?: string
  tintColor?: string
  bg?: string
  textColor?: string
  accent?: string
  pageNum?: string
  totalExp?: string
  contactSheet?: string
  sortOrder?: number
}

export const getChapterPage = async (params: any) => {
  return await request.get({ url: '/ip/travel/chapter/page', params })
}

export const getChapter = async (id: number) => {
  return await request.get({ url: '/ip/travel/chapter/get', params: { id } })
}

export const createChapter = async (data: ChapterVO) => {
  return await request.post({ url: '/ip/travel/chapter/create', data })
}

export const updateChapter = async (data: ChapterVO) => {
  return await request.put({ url: '/ip/travel/chapter/update', data })
}

export const deleteChapter = async (id: number) => {
  return await request.delete({ url: '/ip/travel/chapter/delete', params: { id } })
}
