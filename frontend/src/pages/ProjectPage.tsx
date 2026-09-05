import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getProject } from '../api/projects'
import {
  createChapter,
  getChapters,
} from '../api/chapters'

import type { Project } from '../types/project'
import type { Chapter } from '../types/chapter'

function ProjectPage() {
  const { projectId } = useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!projectId) {
      return
    }

    async function loadProject() {
      try {
        const id = Number(projectId)

        const [projectData, chaptersData] =
          await Promise.all([
            getProject(id),
            getChapters(id),
          ])

        setProject(projectData)
        setChapters(chaptersData)
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

  if (isLoading) {
    return <p>Loading project...</p>
  }

  if (error) {
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
    </main>
  )
}

export default ProjectPage