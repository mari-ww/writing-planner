import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getProjects } from '../api/projects'
import type { Project } from '../types/project'

import '../styles/projects.css'

function ProjectsPage() {
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
    <main className="projects-page">
      <header className="projects-header">
        <Link to="/" className="back-link">
          ← Home
        </Link>

        <p className="page-eyebrow">MY STORIES</p>

        <h1>Projects</h1>

        <p className="projects-subtitle">
          Your stories, all in one place.
        </p>
      </header>

      {error && <p className="projects-error">{error}</p>}

      {isLoading && (
        <p className="projects-status">Loading projects...</p>
      )}

      {!isLoading && projects.length === 0 && (
        <section className="projects-empty">
          <div className="empty-icon">✦</div>

          <h2>No stories yet</h2>

          <p>
            Start your first project and turn your ideas into
            something real.
          </p>

          <Link to="/" className="projects-create-link">
            Create a project
          </Link>
        </section>
      )}

      {!isLoading && projects.length > 0 && (
        <section className="projects-grid">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="project-card"
            >
              <article>
                <div className="project-card-top">
                  <span className="project-icon">✦</span>

                  {project.genre && (
                    <span className="project-genre">
                      {project.genre}
                    </span>
                  )}
                </div>

                <h2>{project.title}</h2>

                {project.description && (
                  <p>{project.description}</p>
                )}

                <span className="project-open">
                  Open project →
                </span>
              </article>
            </Link>
          ))}
        </section>
      )}
    </main>
  )
}

export default ProjectsPage