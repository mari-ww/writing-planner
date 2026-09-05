import { apiRequest } from './client'
import type { Project } from '../types/project'

export function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>('/projects')
}

export function createProject(data: {
  title: string
  description?: string
  genre?: string
}): Promise<Project> {
  return apiRequest<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function getProject(projectId: number): Promise<Project> {
  return apiRequest<Project>(`/projects/${projectId}`)
}