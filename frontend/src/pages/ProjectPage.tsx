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

import {
  createCharacter,
  getCharacters,
} from '../api/characters'

import type { Project } from '../types/project'
import type { Chapter } from '../types/chapter'
import type { Task } from '../types/task'
import type { Character } from '../types/character'

import '../styles/project.css'

function ProjectPage() {
  const { projectId } = useParams()

  const [project, setProject] =
    useState<Project | null>(null)

  const [chapters, setChapters] =
    useState<Chapter[]>([])

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [characters, setCharacters] =
    useState<Character[]>([])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isCreating, setIsCreating] =
    useState(false)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskChapterId, setTaskChapterId] =
    useState('')
  const [isCreatingTask, setIsCreatingTask] =
    useState(false)

  const [characterName, setCharacterName] =
    useState('')
  const [characterDescription, setCharacterDescription] =
    useState('')
  const [characterRole, setCharacterRole] =
    useState('')
  const [isCreatingCharacter, setIsCreatingCharacter] =
    useState(false)

  const [isLoading, setIsLoading] =
    useState(true)

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
          charactersData,
        ] = await Promise.all([
          getProject(id),
          getChapters(id),
          getTasks(id),
          getCharacters(id),
        ])

        setProject(projectData)
        setChapters(chaptersData)
        setTasks(tasksData)
        setCharacters(charactersData)
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

      setChapters((current) => [
        ...current,
        chapter,
      ])

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

      setTasks((current) => [
        ...current,
        task,
      ])

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
          role:
            characterRole || undefined,
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

  if (isLoading) {
    return (
      <main className="project-page">
        <p className="page-loading">
          Loading project...
        </p>
      </main>
    )
  }

  if (error && !project) {
    return (
      <main className="project-page">
        <p className="page-error">
          {error}
        </p>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="project-page">
        <p className="page-error">
          Project not found.
        </p>
      </main>
    )
  }

  const completedTasks = tasks.filter(
    (task) => task.completed,
  ).length

  return (
    <main className="project-page">
      <header className="project-header">
        <Link
          to="/projects"
          className="back-link"
        >
          ← Back to projects
        </Link>

        <div className="project-header-content">
          <div>
            <p className="eyebrow">
              ✦ WRITING PROJECT
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

          <div className="project-overview">
            <strong>
              {chapters.length}
            </strong>
            <span>chapters</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="project-error">
          {error}
        </div>
      )}

      {/* CHAPTERS */}

      <section className="project-card chapters-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              Your story
            </p>

            <h2>Chapters</h2>

            <p className="section-subtitle">
              Write and organize your story.
            </p>
          </div>

          <span className="section-count">
            {chapters.length}
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
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />

          <textarea
            placeholder="Begin writing your story..."
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            rows={7}
          />

          <div className="paper-footer">
            <span>
              ✎ Your story starts here.
            </span>

            <button
              type="submit"
              disabled={isCreating}
            >
              {isCreating
                ? 'Creating...'
                : '+ Create Chapter'}
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
                  {String(
                    chapter.position,
                  ).padStart(2, '0')}
                </div>

                <div className="chapter-diary-content">
                  <span className="chapter-diary-label">
                    Chapter {chapter.position}
                  </span>

                  <h3>
                    {chapter.title}
                  </h3>

                  <p>
                    {chapter.content
                      ? chapter.content.slice(
                          0,
                          150,
                        )
                      : 'An empty page waiting for your words...'}
                    {chapter.content &&
                    chapter.content.length >
                      150
                      ? '...'
                      : ''}
                  </p>

                  <span className="chapter-diary-words">
                    {chapter.word_count} words
                  </span>
                </div>

                <span className="chapter-diary-arrow">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* TASKS */}

      <section className="project-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              Stay organized
            </p>

            <h2>Tasks</h2>
          </div>

          <span className="section-count">
            {completedTasks}/{tasks.length}
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
              setTaskTitle(
                event.target.value,
              )
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

      {/* CHARACTERS */}

      <section className="project-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              Your world
            </p>

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
    </main>
  )
}

export default ProjectPage