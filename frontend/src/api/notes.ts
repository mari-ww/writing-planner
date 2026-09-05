import { apiRequest } from './client'
import type { Note } from '../types/note'

export function getNotes(
  projectId: number,
): Promise<Note[]> {
  return apiRequest<Note[]>(
    `/projects/${projectId}/notes`,
  )
}

export function createNote(
  projectId: number,
  data: {
    title: string
    content: string
  },
): Promise<Note> {
  return apiRequest<Note>(
    `/projects/${projectId}/notes`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}