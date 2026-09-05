import { apiRequest } from './client'

export type DailyWritingStat = {
  date: string
  words_written: number
}

export function getWritingHistory(
  projectId: number,
): Promise<DailyWritingStat[]> {
  return apiRequest<DailyWritingStat[]>(
    `/projects/${projectId}/writing/history`,
  )
}