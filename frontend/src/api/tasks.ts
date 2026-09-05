import { apiRequest } from './client'
import type { Task } from '../types/task'

export function getTasks(
  projectId: number,
): Promise<Task[]> {
  return apiRequest<Task[]>(
    `/projects/${projectId}/tasks`,
  )
}

export function createTask(
  projectId: number,
  data: {
    title: string
    chapter_id?: number
  },
): Promise<Task> {
  return apiRequest<Task>(
    `/projects/${projectId}/tasks`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}

export function updateTask(
  projectId: number,
  taskId: number,
  data: {
    title?: string
    completed?: boolean
    chapter_id?: number
  },
): Promise<Task> {
  return apiRequest<Task>(
    `/projects/${projectId}/tasks/${taskId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )
}