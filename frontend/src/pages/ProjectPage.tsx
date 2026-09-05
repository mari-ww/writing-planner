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

import type { Project } from '../types/project'
import type { Chapter } from '../types/chapter'
import type { Task } from '../types/task'

function ProjectPage() {
  const { projectId } = useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [taskTitle, setTaskTitle] = useState('')
  const [taskChapterId, setTaskChapterId] = useState('')
  const [isCreatingTask, setIsCreatingTask] = useState(false)

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
        ] = await Promise.all([
          getProject(id),
          getChapters(id),
          getTasks(id),
        ])

        setProject(projectData)
        setChapters(chaptersData)
        setTasks(tasksData)
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

      {project.genre && <p>{project.genre}</p>}

      {error && <p>{error}</p>}

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

                <p>{chapter.word_count} words</p>
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
              <option value="">No chapter</option>

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
    </main>
  )
}

export default ProjectPage