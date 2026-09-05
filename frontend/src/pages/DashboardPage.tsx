import { useEffect, useState } from 'react'

import { getProjects } from '../api/projects'
import type { Project } from '../types/project'

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <main>
      <header>
        <h1>Writing Planner</h1>
      </header>

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
                <h3>{project.title}</h3>
                {project.description && (
                  <p>{project.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default DashboardPage