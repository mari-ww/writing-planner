import { apiRequest } from './client'
import type { Chapter } from '../types/chapter'

export function getChapters(
  projectId: number,
): Promise<Chapter[]> {
  return apiRequest<Chapter[]>(
    `/projects/${projectId}/chapters`,
  )
}

export function createChapter(
  projectId: number,
  data: {
    title: string
    content?: string
  },
): Promise<Chapter> {
  return apiRequest<Chapter>(
    `/projects/${projectId}/chapters`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}

export function getChapter(
  projectId: number,
  chapterId: number,
): Promise<Chapter> {
  return apiRequest<Chapter>(
    `/projects/${projectId}/chapters/${chapterId}`,
  )
}

export function updateChapter(
  projectId: number,
  chapterId: number,
  data: {
    title?: string
    content?: string
  },
): Promise<Chapter> {
  return apiRequest<Chapter>(
    `/projects/${projectId}/chapters/${chapterId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )
}