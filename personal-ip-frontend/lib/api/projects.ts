import { apiFetch } from './client'

export interface Project {
  id: number
  name: string
  slug: string
  description: string | null
  coverUrl: string | null
  previewUrl: string | null
  githubUrl: string | null
  demoUrl: string | null
  techStack: string | null
  content: string | null
  featured: boolean
  createTime: string
}

export function getProjectList(): Promise<Project[]> {
  return apiFetch<Project[]>('/ip/project/list')
}

export function getProjectBySlug(slug: string): Promise<Project | null> {
  return apiFetch<Project | null>(`/ip/project/get?slug=${encodeURIComponent(slug)}`)
}
