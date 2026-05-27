const BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:48080'

export async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/app-api${path}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  const json = await res.json()
  if (json.code !== 0) throw new Error(`Business error ${json.code}: ${json.msg}`)
  return json.data as T
}
