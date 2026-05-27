import { apiFetch } from './client'

export interface TeamMember {
  id: number
  name: string
  role: string | null
  avatarUrl: string | null
  bio: string | null
  githubUrl: string | null
  linkedinUrl: string | null
}

export function getTeamMembers(): Promise<TeamMember[]> {
  return apiFetch<TeamMember[]>('/ip/team/list')
}
