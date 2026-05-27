import type { TravelYear, TravelTrip } from './types'
import { getTravelYears as getMockYears, getTravelYear as getMockYear, getTravelTrip as getMockTrip } from './mock-data'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:48080'

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API ${path} returned ${res.status}`)
  }
  const json = await res.json()
  return json.data as T
}

function mapTrip(raw: Record<string, any>): TravelTrip {
  return {
    id: String(raw.id),
    year: raw.year,
    title: raw.title,
    titleYear: raw.titleYear,
    subtitle: raw.subtitle,
    chinese: raw.chinese,
    tagline: raw.tagline,
    filmLabel: raw.filmLabel,
    filmHeader: raw.filmHeader,
    devCredit: raw.devCredit,
    sideText: raw.sideText,
    coverImg: raw.coverImg,
    accentColor: raw.accentColor,
    description: raw.description,
    chapters: (raw.chapters || []).map((ch: Record<string, any>) => ({
      id: String(ch.id),
      num: ch.num,
      name: ch.name,
      chinese: ch.chinese,
      dateLabel: ch.dateLabel,
      region: ch.region,
      country: ch.country,
      area: ch.area,
      coords: ch.coords,
      locationCn: ch.locationCn,
      time: ch.time,
      tags: ch.tags,
      quote: ch.quote,
      caption: ch.caption,
      spots: ch.spots ? (typeof ch.spots === 'string' ? JSON.parse(ch.spots) : ch.spots) : [],
      photos: ch.photos || [],
      coverImg: ch.coverImg,
      coverGrad: ch.coverGrad,
      tintColor: ch.tintColor,
      bg: ch.bg,
      textColor: ch.textColor,
      accent: ch.accent,
      pageNum: ch.pageNum,
      totalExp: ch.totalExp,
      contactSheet: ch.contactSheet,
    })),
  }
}

export async function getTravelYears(): Promise<TravelYear[]> {
  try {
    const raw = await fetchApi<any[]>('/admin-api/ip/travel/year/list')
    // raw can be null when backend returns { data: null } — fall back to mock
    if (!raw || !Array.isArray(raw) || raw.length === 0) return getMockYears()
    return raw.map((item: any) => ({
      year: item.year,
      label: item.label,
      coverImg: item.coverImg,
      trips: (item.trips || []).map(mapTrip),
    }))
  } catch {
    return getMockYears()
  }
}

export async function getTravelYear(year: number): Promise<TravelYear | undefined> {
  try {
    const raw = await fetchApi<any>(`/admin-api/ip/travel/year/get?year=${year}`)
    // raw can be null when backend returns { data: null } — fall back to mock
    if (!raw) return getMockYear(year)
    return {
      year: raw.year,
      label: raw.label,
      coverImg: raw.coverImg,
      trips: (raw.trips || []).map(mapTrip),
    }
  } catch {
    return getMockYear(year)
  }
}

export async function getTravelTrip(year: number, tripId: string): Promise<TravelTrip | undefined> {
  try {
    const raw = await fetchApi<any>(`/admin-api/ip/travel/trip/get?year=${year}&tripId=${tripId}`)
    // raw can be null when backend returns { data: null } — fall back to mock
    if (!raw) return getMockTrip(year, tripId)
    return mapTrip(raw)
  } catch {
    return getMockTrip(year, tripId)
  }
}

// Re-export types for convenience
export type { TravelYear, TravelTrip, TravelChapter, TravelPhoto } from './types'
