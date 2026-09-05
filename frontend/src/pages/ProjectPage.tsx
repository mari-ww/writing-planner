import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getProject } from '../api/projects'

import {
  createChapter,
  getChapters,
} from '../api/chapters'

import {
  createTask,
  getTasks,
  updateTask,
} from '../api/tasks'

import { getProjectStatistics } from '../api/statistics'

import {
  createCharacter,
  getCharacters,
} from '../api/characters'

import {
  createNote,
  getNotes,
} from '../api/notes'

import {
  getWritingHistory,
  type DailyWritingStat,
} from '../api/dailyWriting'

import type { Project } from '../types/project'
import type { Chapter } from '../types/chapter'
import type { Task } from '../types/task'
import type { ProjectStatistics } from '../types/statistics'
import type { Character } from '../types/character'
import type { Note } from '../types/note'
import '../styles/project.css'

function ProjectPage() {
  const { projectId } = useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [statistics, setStatistics] =
    useState<ProjectStatistics | null>(null)

  const [characters, setCharacters] = useState<Character[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskChapterId, setTaskChapterId] = useState('')
  const [isCreatingTask, setIsCreatingTask] = useState(false)

  const [characterName, setCharacterName] = useState('')
  const [characterDescription, setCharacterDescription] =
    useState('')
  const [characterRole, setCharacterRole] = useState('')
  const [isCreatingCharacter, setIsCreatingCharacter] =
    useState(false)

  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [isCreatingNote, setIsCreatingNote] =
    useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [writingHistory, setWritingHistory] =
    useState<DailyWritingStat[]>([])

  useEffect(() => {
    if (!projectId) {
      return
    }

    async function loadProject() {
      try {
        const id = Number(projectId)

        const [
          projectData,
          chaptersData,
          tasksData,
          statisticsData,
          charactersData,
          notesData,
          writingHistoryData,
        ] = await Promise.all([
          getProject(id),
          getChapters(id),
          getTasks(id),
          getProjectStatistics(id),
          getCharacters(id),
          getNotes(id),
          getWritingHistory(id),
        ])

        setProject(projectData)
        setChapters(chaptersData)
        setTasks(tasksData)
        setStatistics(statisticsData)
        setCharacters(charactersData)
        setNotes(notesData)
        setWritingHistory(writingHistoryData)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load project',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId])

  async function handleCreateChapter(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!projectId) {
      return
    }

    setError('')
    setIsCreating(true)

    try {
      const chapter = await createChapter(
        Number(projectId),
        {
          title,
          content,
        },
      )

      setChapters((current) => [...current, chapter])
      setTitle('')
      setContent('')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create chapter',
      )
    } finally {
      setIsCreating(false)
    }
  }

  async function handleCreateTask(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!projectId) {
      return
    }

    setError('')
    setIsCreatingTask(true)

    try {
      const task = await createTask(
        Number(projectId),
        {
          title: taskTitle,
          chapter_id: taskChapterId
            ? Number(taskChapterId)
            : undefined,
        },
      )

      setTasks((current) => [...current, task])
      setTaskTitle('')
      setTaskChapterId('')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create task',
      )
    } finally {
      setIsCreatingTask(false)
    }
  }

  async function handleToggleTask(task: Task) {
    if (!projectId) {
      return
    }

    try {
      const updatedTask = await updateTask(
        Number(projectId),
        task.id,
        {
          completed: !task.completed,
        },
      )

      setTasks((current) =>
        current.map((item) =>
          item.id === updatedTask.id
            ? updatedTask
            : item,
        ),
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update task',
      )
    }
  }

  async function handleCreateCharacter(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!projectId) {
      return
    }

    setError('')
    setIsCreatingCharacter(true)

    try {
      const character = await createCharacter(
        Number(projectId),
        {
          name: characterName,
          description:
            characterDescription || undefined,
          role: characterRole || undefined,
        },
      )

      setCharacters((current) => [
        ...current,
        character,
      ])

      setCharacterName('')
      setCharacterDescription('')
      setCharacterRole('')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create character',
      )
    } finally {
      setIsCreatingCharacter(false)
    }
  }

  async function handleCreateNote(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!projectId) {
      return
    }

    setError('')
    setIsCreatingNote(true)

    try {
      const note = await createNote(
        Number(projectId),
        {
          title: noteTitle,
          content: noteContent,
        },
      )

      setNotes((current) => [
        ...current,
        note,
      ])

      setNoteTitle('')
      setNoteContent('')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create note',
      )
    } finally {
      setIsCreatingNote(false)
    }
  }

  if (isLoading) {
    return (
      <div className="project-page">
        <p className="page-loading">
          Loading project...
        </p>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="project-page">
        <p className="page-error">{error}</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="project-page">
        <p className="page-error">
          Project not found.
        </p>
      </div>
    )
  }

  const totalTrackedWords = writingHistory.reduce(
    (total, day) => total + day.words_written,
    0,
  )

  const todayString = new Date()
    .toISOString()
    .split('T')[0]

  const todayWriting =
    writingHistory.find(
      (day) => day.date === todayString,
    )?.words_written ?? 0

  return (
    <div className="project-page">
      <aside className="project-sidebar">
        <Link
          to="/"
          className="project-sidebar-brand"
        >
          <div className="brand-icon">✎</div>

          <div>
            <strong>Writing</strong>
            <span>Planner</span>
          </div>
        </Link>

        <nav className="project-sidebar-nav">
          <Link to="/" className="project-nav-link">
            <span>⌂</span>
            Home
          </Link>

          <Link
            to="/"
            className="project-nav-link project-nav-active"
          >
            <span>◈</span>
            Projects
          </Link>

          <span className="project-nav-link project-nav-disabled">
            <span>▤</span>
            Chapters
          </span>

          <span className="project-nav-link project-nav-disabled">
            <span>✓</span>
            Tasks
          </span>

          <span className="project-nav-link project-nav-disabled">
            <span>♙</span>
            Characters
          </span>

          <span className="project-nav-link project-nav-disabled">
            <span>▱</span>
            Notes
          </span>
        </nav>

        <div className="project-sidebar-tip">
          <span>✦</span>

          <strong>Writing tip</strong>

          <p>
            Don't worry about writing perfectly.
            Just keep going.
          </p>
        </div>
      </aside>

      <main className="project-main">
        <header className="project-header">
          <div>
            <Link
              to="/"
              className="back-link"
            >
              ← Back to projects
            </Link>

            <p className="eyebrow">
              ✦ YOUR WRITING SPACE
            </p>

            <h1>{project.title}</h1>

            {project.description && (
              <p className="project-description">
                {project.description}
              </p>
            )}

            {project.genre && (
              <span className="project-genre">
                {project.genre}
              </span>
            )}
          </div>

          <div className="project-header-stat">
            <span>✎</span>

            <div>
              <strong>
                {statistics?.total_words ?? 0}
              </strong>

              <small>total words</small>
            </div>
          </div>
        </header>

        {error && (
          <div className="project-error">
            {error}
          </div>
        )}

        <section className="project-stats-grid">
          <div className="project-stat-card">
            <span className="project-stat-icon">✦</span>
            <div>
              <strong>
                {statistics?.total_words ?? 0}
              </strong>
              <small>Total words</small>
            </div>
          </div>

          <div className="project-stat-card">
            <span className="project-stat-icon">▤</span>
            <div>
              <strong>
                {statistics?.chapter_count ?? 0}
              </strong>
              <small>Chapters</small>
            </div>
          </div>

          <div className="project-stat-card">
            <span className="project-stat-icon">◷</span>
            <div>
              <strong>{todayWriting}</strong>
              <small>Words today</small>
            </div>
          </div>

          <div className="project-stat-card">
            <span className="project-stat-icon">✓</span>
            <div>
              <strong>
                {tasks.filter(
                  (task) => task.completed,
                ).length}
                /{tasks.length}
              </strong>
              <small>Tasks done</small>
            </div>
          </div>
        </section>

        <section className="writing-history project-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                Writing activity
              </p>

              <h2>Writing Stats</h2>

              <p>
                Your writing rhythm over the last
                12 weeks.
              </p>
            </div>

            <div className="tracked-words">
              <strong>
                {totalTrackedWords}
              </strong>

              <span>words tracked</span>
            </div>
          </div>

          <div className="heatmap-wrapper">
            <div className="heatmap-months">
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>

            <div className="writing-heatmap">
              {Array.from(
                { length: 84 },
                (_, index) => {
                  const date = new Date()

                  date.setDate(
                    date.getDate() -
                      (83 - index),
                  )

                  const dateString =
                    date
                      .toISOString()
                      .split('T')[0]

                  const day =
                    writingHistory.find(
                      (item) =>
                        item.date ===
                        dateString,
                    )

                  const words =
                    day?.words_written ?? 0

                  const level =
                    words === 0
                      ? 0
                      : words < 250
                        ? 1
                        : words < 500
                          ? 2
                          : words < 1000
                            ? 3
                            : 4

                  return (
                    <div
                      key={dateString}
                      className={`writing-day level-${level}`}
                      title={`${dateString}: ${words} words`}
                    />
                  )
                },
              )}
            </div>
          </div>

          <div className="heatmap-legend">
            <span>Less</span>

            <div className="writing-day level-0" />
            <div className="writing-day level-1" />
            <div className="writing-day level-2" />
            <div className="writing-day level-3" />
            <div className="writing-day level-4" />

            <span>More</span>
          </div>
        </section>

        <div className="project-content-grid">
          <section className="project-card daily-goal-card">
            <div className="card-heading">
              <span className="card-icon">✦</span>

              <div>
                <h2>Daily Goal</h2>
                <span>
                  Keep your writing streak alive
                </span>
              </div>
            </div>

            {statistics && (
              <>
                <div className="goal-number">
                  <strong>
                    {statistics.daily_word_progress}
                  </strong>

                  <span>
                    / {statistics.daily_word_goal}{' '}
                    words
                  </span>
                </div>

                <div className="goal-progress">
                  <span
                    style={{
                      width: `${statistics.daily_goal_percentage}%`,
                    }}
                  />
                </div>

                <div className="goal-footer">
                  <span>
                    {statistics.daily_goal_percentage.toFixed(
                      0,
                    )}
                    % complete
                  </span>

                  <span>
                    {Math.max(
                      statistics.daily_word_goal -
                        statistics.daily_word_progress,
                      0,
                    )}{' '}
                    remaining
                  </span>
                </div>
              </>
            )}
          </section>

          <section className="project-card progress-summary-card">
            <div className="card-heading">
              <span className="card-icon">◷</span>

              <div>
                <h2>Progress</h2>
                <span>Your creative journey</span>
              </div>
            </div>

            {statistics && (
              <div className="progress-summary">
                <div>
                  <strong>
                    {statistics.average_words_per_chapter.toFixed(
                      0,
                    )}
                  </strong>

                  <span>
                    avg. words / chapter
                  </span>
                </div>

                <div>
                  <strong>
                    {statistics.chapter_count}
                  </strong>

                  <span>chapters written</span>
                </div>
              </div>
            )}
          </section>
        </div>

<section className="project-card chapters-section">
  <div className="section-heading">
    <div>
      <p className="eyebrow">Your story</p>
      <h2>Chapters</h2>
      <p className="section-subtitle">
        Every chapter is a page of your story.
      </p>
    </div>

    <span className="section-count">
      {chapters.length} chapters
    </span>
  </div>

  <form
    className="chapter-paper"
    onSubmit={handleCreateChapter}
  >
    <div className="paper-header">
      <span>✦</span>
      <span>New chapter</span>
    </div>

    <input
      type="text"
      placeholder="Chapter title..."
      value={title}
      onChange={(event) => setTitle(event.target.value)}
      required
    />

    <textarea
      placeholder="Begin writing your story..."
      value={content}
      onChange={(event) => setContent(event.target.value)}
      rows={7}
    />

    <div className="paper-footer">
      <span>✎ Your story starts here.</span>

      <button type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : '+ Create Chapter'}
      </button>
    </div>
  </form>

  {chapters.length > 0 && (
    <div className="chapter-diary-list">
      {chapters.map((chapter) => (
        <Link
          key={chapter.id}
          to={`/projects/${projectId}/chapters/${chapter.id}`}
          className="chapter-diary"
        >
          <div className="chapter-diary-number">
            {String(chapter.position).padStart(2, '0')}
          </div>

          <div className="chapter-diary-content">
            <span className="chapter-diary-label">
              Chapter {chapter.position}
            </span>

            <h3>{chapter.title}</h3>

            <p>
              {chapter.content
                ? chapter.content.slice(0, 150)
                : 'An empty page waiting for your words...'}
              {chapter.content && chapter.content.length > 150
                ? '...'
                : ''}
            </p>

            <span className="chapter-diary-words">
              {chapter.word_count} words
            </span>
          </div>

          <span className="chapter-diary-arrow">→</span>
        </Link>
      ))}
    </div>
  )}
</section>

        <div className="project-content-grid">
          <section className="project-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Stay organized</p>
                <h2>Tasks</h2>
              </div>

              <span className="section-count">
                {tasks.length}
              </span>
            </div>

            <form
              className="stack-form"
              onSubmit={handleCreateTask}
            >
              <input
                type="text"
                value={taskTitle}
                onChange={(event) =>
                  setTaskTitle(event.target.value)
                }
                placeholder="What needs to be done?"
                required
              />

              <select
                value={taskChapterId}
                onChange={(event) =>
                  setTaskChapterId(
                    event.target.value,
                  )
                }
              >
                <option value="">
                  No chapter
                </option>

                {chapters.map((chapter) => (
                  <option
                    key={chapter.id}
                    value={chapter.id}
                  >
                    {chapter.position}.{' '}
                    {chapter.title}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={isCreatingTask}
              >
                {isCreatingTask
                  ? 'Adding...'
                  : '+ Add Task'}
              </button>
            </form>

            <div className="task-list">
              {tasks.length === 0 && (
                <p className="empty-message">
                  No tasks yet.
                </p>
              )}

              {tasks.map((task) => (
                <label
                  key={task.id}
                  className={`task-item ${
                    task.completed
                      ? 'task-completed'
                      : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleToggleTask(task)
                    }
                  />

                  <span>{task.title}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="project-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your world</p>
                <h2>Characters</h2>
              </div>

              <span className="section-count">
                {characters.length}
              </span>
            </div>

            <form
              className="stack-form"
              onSubmit={handleCreateCharacter}
            >
              <input
                type="text"
                value={characterName}
                onChange={(event) =>
                  setCharacterName(
                    event.target.value,
                  )
                }
                placeholder="Character name"
                required
              />

              <input
                type="text"
                value={characterRole}
                onChange={(event) =>
                  setCharacterRole(
                    event.target.value,
                  )
                }
                placeholder="Role"
              />

              <textarea
                value={characterDescription}
                onChange={(event) =>
                  setCharacterDescription(
                    event.target.value,
                  )
                }
                placeholder="Character description"
                rows={3}
              />

              <button
                type="submit"
                disabled={isCreatingCharacter}
              >
                {isCreatingCharacter
                  ? 'Adding...'
                  : '+ Add Character'}
              </button>
            </form>

            <div className="character-list">
              {characters.length === 0 && (
                <p className="empty-message">
                  No characters yet.
                </p>
              )}

              {characters.map((character) => (
                <div
                  key={character.id}
                  className="character-item"
                >
                  <div className="character-avatar">
                    {character.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {character.name}
                    </strong>

                    {character.role && (
                      <span>
                        {character.role}
                      </span>
                    )}

                    {character.description && (
                      <p>
                        {character.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="project-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Ideas & thoughts</p>
              <h2>Notes</h2>
            </div>

            <span className="section-count">
              {notes.length}
            </span>
          </div>

          <form
            className="note-form"
            onSubmit={handleCreateNote}
          >
            <label>
              Title

              <input
                type="text"
                value={noteTitle}
                onChange={(event) =>
                  setNoteTitle(event.target.value)
                }
                placeholder="Note title"
                required
              />
            </label>

            <label>
              Content

              <textarea
                value={noteContent}
                onChange={(event) =>
                  setNoteContent(
                    event.target.value,
                  )
                }
                placeholder="Write down an idea..."
                rows={4}
                required
              />
            </label>

            <button
              type="submit"
              disabled={isCreatingNote}
            >
              {isCreatingNote
                ? 'Saving...'
                : '+ Add Note'}
            </button>
          </form>

          {notes.length === 0 ? (
            <p className="empty-message">
              No notes yet.
            </p>
          ) : (
            <div className="note-grid">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="note-item"
                >
                  <span>▱</span>

                  <div>
                    <strong>
                      {note.title}
                    </strong>

                    <p>{note.content}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default ProjectPage