export interface ChapterWritingStat {
  chapter_id: number
  title: string
  word_count: number
}

export interface ProjectStatistics {
  total_words: number
  chapter_count: number
  average_words_per_chapter: number
  daily_word_goal: number
  daily_word_progress: number
  daily_goal_percentage: number
  chapters: ChapterWritingStat[]
}