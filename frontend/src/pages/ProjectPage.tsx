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

import type { Project } from '../types/project'
import type { Chapter } from '../types/chapter'
import type { Task } from '../types/task'
import type { ProjectStatistics } from '../types/statistics'
import type { Character } from '../types/character'
import type { Note } from '../types/note'

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
        ] = await Promise.all([
          getProject(id),
          getChapters(id),
          getTasks(id),
          getProjectStatistics(id),
          getCharacters(id),
          getNotes(id),
        ])

        setProject(projectData)
        setChapters(chaptersData)
        setTasks(tasksData)
        setStatistics(statisticsData)
        setCharacters(charactersData)
        setNotes(notesData)
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

      setNotes((current) => [...current, note])

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
    return <p>Loading project...</p>
  }

  if (error && !project) {
    return <p>{error}</p>
  }

  if (!project) {
    return <p>Project not found.</p>
  }

  return (
    <main>
      <Link to="/">← Back to projects</Link>

      <h1>{project.title}</h1>

      {project.description && (
        <p>{project.description}</p>
      )}

      {project.genre && (
        <p>{project.genre}</p>
      )}

      {error && <p>{error}</p>}

      <section>
        <h2>Writing Progress</h2>

        {statistics && (
          <>
            <p>
              {statistics.total_words} total words
            </p>

            <p>
              {statistics.chapter_count} chapters
            </p>

            <p>
              {statistics.average_words_per_chapter.toFixed(0)}
              {' '}average words per chapter
            </p>

            <p>
              Daily goal:{' '}
              {statistics.daily_word_progress}
              {' / '}
              {statistics.daily_word_goal} words
            </p>

            <progress
              value={statistics.daily_goal_percentage}
              max="100"
            />

            <p>
              {statistics.daily_goal_percentage.toFixed(0)}%
            </p>
          </>
        )}
      </section>

      <section>
        <h2>Chapters</h2>

        <form onSubmit={handleCreateChapter}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />
          </label>

          <label>
            Content
            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
            />
          </label>

          <button
            type="submit"
            disabled={isCreating}
          >
            {isCreating
              ? 'Creating...'
              : 'Create Chapter'}
          </button>
        </form>

        {chapters.length === 0 && (
          <p>No chapters yet.</p>
        )}

        {chapters.length > 0 && (
          <ol>
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  to={`/projects/${projectId}/chapters/${chapter.id}`}
                >
                  <h3>{chapter.title}</h3>
                </Link>

                <p>
                  {chapter.word_count} words
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h2>Tasks</h2>

        <form onSubmit={handleCreateTask}>
          <label>
            Task
            <input
              type="text"
              value={taskTitle}
              onChange={(event) =>
                setTaskTitle(event.target.value)
              }
              required
            />
          </label>

          <label>
            Chapter
            <select
              value={taskChapterId}
              onChange={(event) =>
                setTaskChapterId(event.target.value)
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
                  {chapter.position}. {chapter.title}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={isCreatingTask}
          >
            {isCreatingTask
              ? 'Creating...'
              : 'Add Task'}
          </button>
        </form>

        {tasks.length === 0 && (
          <p>No tasks yet.</p>
        )}

        {tasks.length > 0 && (
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleToggleTask(task)
                    }
                  />

                  {task.title}
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Characters</h2>

        <form onSubmit={handleCreateCharacter}>
          <label>
            Name
            <input
              type="text"
              value={characterName}
              onChange={(event) =>
                setCharacterName(event.target.value)
              }
              required
            />
          </label>

          <label>
            Role
            <input
              type="text"
              value={characterRole}
              onChange={(event) =>
                setCharacterRole(event.target.value)
              }
            />
          </label>

          <label>
            Description
            <textarea
              value={characterDescription}
              onChange={(event) =>
                setCharacterDescription(
                  event.target.value,
                )
              }
            />
          </label>

          <button
            type="submit"
            disabled={isCreatingCharacter}
          >
            {isCreatingCharacter
              ? 'Creating...'
              : 'Add Character'}
          </button>
        </form>

        {characters.length === 0 && (
          <p>No characters yet.</p>
        )}

        {characters.length > 0 && (
          <ul>
            {characters.map((character) => (
              <li key={character.id}>
                <h3>{character.name}</h3>

                {character.role && (
                  <p>{character.role}</p>
                )}

                {character.description && (
                  <p>{character.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Notes</h2>

        <form onSubmit={handleCreateNote}>
          <label>
            Title
            <input
              type="text"
              value={noteTitle}
              onChange={(event) =>
                setNoteTitle(event.target.value)
              }
              required
            />
          </label>

          <label>
            Content
            <textarea
              value={noteContent}
              onChange={(event) =>
                setNoteContent(event.target.value)
              }
              rows={8}
              required
            />
          </label>

          <button
            type="submit"
            disabled={isCreatingNote}
          >
            {isCreatingNote
              ? 'Creating...'
              : 'Add Note'}
          </button>
        </form>

        {notes.length === 0 && (
          <p>No notes yet.</p>
        )}

        {notes.length > 0 && (
          <ul>
            {notes.map((note) => (
              <li key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default ProjectPage