import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { createProject, getProjects } from '../api/projects'
import type { Project } from '../types/project'

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects()
        setProjects(data)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load projects',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsCreating(true)

    try {
      const project = await createProject({
        title,
        description: description || undefined,
        genre: genre || undefined,
      })

      setProjects((current) => [...current, project])
      setTitle('')
      setDescription('')
      setGenre('')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create project',
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <main>
      <header>
        <h1>Writing Planner</h1>
      </header>

      <section>
        <h2>New Project</h2>

        <form onSubmit={handleCreateProject}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label>
            Genre
            <input
              type="text"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            />
          </label>

          <button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </section>

      <section>
        <h2>My Projects</h2>

        {isLoading && <p>Loading projects...</p>}

        {error && <p>{error}</p>}

        {!isLoading && !error && projects.length === 0 && (
          <p>No projects yet.</p>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <ul>
            {projects.map((project) => (
            <li key={project.id}>
                <Link to={`/projects/${project.id}`}>
                <h3>{project.title}</h3>
                </Link>

                {project.description && (
                <p>{project.description}</p>
                )}

                {project.genre && <p>{project.genre}</p>}
            </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default DashboardPage