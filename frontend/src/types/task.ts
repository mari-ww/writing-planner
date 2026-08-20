export interface Task {
  id: number
  title: string
  completed: boolean
  project_id: number
  chapter_id: number | null
}