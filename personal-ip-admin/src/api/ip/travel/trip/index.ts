import request from '@/config/axios'

export interface TripVO {
  id?: number
  year: number
  title: string
  titleYear?: string
  subtitle?: string
  chinese?: string
  tagline?: string
  filmLabel?: string
  filmHeader?: string
  devCredit?: string
  sideText?: string
  coverImg?: string
  accentColor?: string
  sortOrder?: number
  status: number
}

export const getTripPage = async (params: any) => {
  return await request.get({ url: '/ip/travel/trip/page', params })
}

export const getTrip = async (id: number) => {
  return await request.get({ url: '/ip/travel/trip/get', params: { id } })
}

export const createTrip = async (data: TripVO) => {
  return await request.post({ url: '/ip/travel/trip/create', data })
}

export const updateTrip = async (data: TripVO) => {
  return await request.put({ url: '/ip/travel/trip/update', data })
}

export const deleteTrip = async (id: number) => {
  return await request.delete({ url: '/ip/travel/trip/delete', params: { id } })
}
