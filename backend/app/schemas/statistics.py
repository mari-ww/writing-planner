from pydantic import BaseModel


class ChapterWritingStat(BaseModel):
    chapter_id: int
    title: str
    word_count: int


class ProjectStatisticsResponse(BaseModel):
    total_words: int
    chapter_count: int
    average_words_per_chapter: float

    daily_word_goal: int
    daily_word_progress: int
    daily_goal_percentage: float

    chapters: list[ChapterWritingStat]