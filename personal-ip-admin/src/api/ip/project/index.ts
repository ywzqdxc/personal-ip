import request from '@/config/axios'

export interface ProjectVO {
  id?: number
  name: string
  slug: string
  description?: string
  coverUrl?: string
  previewUrl?: string
  githubUrl?: string
  demoUrl?: string
  techStack?: string
  content?: string
  sortOrder?: number
  featured?: boolean
  status: number
}

// 获取项目展示分页
export const getProjectPage = async (params: any) => {
  return await request.get({ url: '/ip/project/page', params })
}

// 获取项目展示详情
export const getProject = async (id: number) => {
  return await request.get({ url: '/ip/project/get', params: { id } })
}

// 新增项目展示
export const createProject = async (data: ProjectVO) => {
  return await request.post({ url: '/ip/project/create', data })
}

// 修改项目展示
export const updateProject = async (data: ProjectVO) => {
  return await request.put({ url: '/ip/project/update', data })
}

// 删除项目展示
export const deleteProject = async (id: number) => {
  return await request.delete({ url: '/ip/project/delete', params: { id } })
}
