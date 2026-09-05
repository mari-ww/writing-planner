import { apiRequest } from './client'
import type { Project } from '../types/project'

export function getProjects(): Promise<Project[]> {
  return apiRequest<Project[]>('/projects')
}