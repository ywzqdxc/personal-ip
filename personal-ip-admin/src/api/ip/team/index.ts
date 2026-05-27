import request from '@/config/axios'

export interface TeamMemberVO {
  id?: number
  name: string
  role?: string
  avatarUrl?: string
  bio?: string
  githubUrl?: string
  linkedinUrl?: string
  sortOrder?: number
  status: number
}

export const getTeamMemberPage = async (params: any) =>
  await request.get({ url: '/ip/team/page', params })

export const getTeamMember = async (id: number) =>
  await request.get({ url: '/ip/team/get', params: { id } })

export const createTeamMember = async (data: TeamMemberVO) =>
  await request.post({ url: '/ip/team/create', data })

export const updateTeamMember = async (data: TeamMemberVO) =>
  await request.put({ url: '/ip/team/update', data })

export const deleteTeamMember = async (id: number) =>
  await request.delete({ url: '/ip/team/delete', params: { id } })
