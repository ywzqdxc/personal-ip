import request from '@/config/axios'

export interface TravelDiaryVO {
  id?: number
  title: string
  destination?: string
  tripDate?: string
  coverUrl?: string
  accentColor?: string
  content?: string
  photos?: string
  sortOrder?: number
  status: number
}

export const getTravelDiaryPage = async (params: any) =>
  await request.get({ url: '/ip/travel-diary/page', params })

export const getTravelDiary = async (id: number) =>
  await request.get({ url: '/ip/travel-diary/get', params: { id } })

export const createTravelDiary = async (data: TravelDiaryVO) =>
  await request.post({ url: '/ip/travel-diary/create', data })

export const updateTravelDiary = async (data: TravelDiaryVO) =>
  await request.put({ url: '/ip/travel-diary/update', data })

export const deleteTravelDiary = async (id: number) =>
  await request.delete({ url: '/ip/travel-diary/delete', params: { id } })
