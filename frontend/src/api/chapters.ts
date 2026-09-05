import { apiRequest } from './client'
import type { Chapter } from '../types/chapter'

export function getChapters(projectId: number): Promise<Chapter[]> {
  return apiRequest<Chapter[]>(
    `/projects/${projectId}/chapters`,
  )
}