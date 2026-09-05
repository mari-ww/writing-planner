import { apiRequest } from './client'
import type { ProjectStatistics } from '../types/statistics'

export function getProjectStatistics(
  projectId: number,
): Promise<ProjectStatistics> {
  return apiRequest<ProjectStatistics>(
    `/projects/${projectId}/statistics`,
  )
}