import { apiRequest } from './client'
import type { Character } from '../types/character'

export function getCharacters(
  projectId: number,
): Promise<Character[]> {
  return apiRequest<Character[]>(
    `/projects/${projectId}/characters`,
  )
}

export function createCharacter(
  projectId: number,
  data: {
    name: string
    description?: string
    role?: string
  },
): Promise<Character> {
  return apiRequest<Character>(
    `/projects/${projectId}/characters`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}