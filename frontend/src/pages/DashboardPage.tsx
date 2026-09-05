import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'

import {
  createProject,
  getProjects,
} from '../api/projects'

import type { Project } from '../types/project'

function DashboardPage() {

    function handleLogout() {
    localStorage.removeItem('access_token')
    window.location.reload()
    }

  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const location = useLocation()

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

  async function handleCreateProject(
    event: FormEvent<HTMLFormElement>,
  ) {
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

  const navigationItems = [
    { label: 'Home', icon: '⌂', to: '/' },
    { label: 'Projects', icon: '◈', to: '/' },
    { label: 'Chapters', icon: '▤' },
    { label: 'Tasks', icon: '✓' },
    { label: 'Characters', icon: '♙' },
    { label: 'Notes', icon: '▱' },
  ]

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">✎</div>

          <div>
            <strong>Writing</strong>
            <span>Planner</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const isDisabled = !item.to

            if (isDisabled) {
              return (
                <span
                  key={item.label}
                  className="sidebar-link sidebar-link-disabled"
                  aria-disabled="true"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </span>
              )
            }

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`sidebar-link ${
                  location.pathname === item.to
                    ? 'sidebar-link-active'
                    : ''
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-tip">
          <span className="tip-icon">✦</span>

          <strong>Writing tip</strong>

          <p>
            Don't worry about writing
            perfectly. Just keep going.
          </p>
        </div>

        <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
            >
            <span>⇥</span>
            Logout
            </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">
              ✦ YOUR WRITING SPACE
            </p>

            <h1>Welcome back!</h1>

            <p>
              Here's an overview of your
              writing projects.
            </p>
          </div>

          <div className="header-date">
            <span>◷</span>

            <div>
              <strong>
                {new Date().toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  },
                )}
              </strong>

              <small>Keep creating today</small>
            </div>
          </div>
        </header>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <div className="dashboard-grid">
          <section className="dashboard-card progress-card">
            <div className="card-heading">
              <span className="card-icon">✦</span>

              <div>
                <h2>Writing Progress</h2>
                <span>Your creative journey</span>
              </div>
            </div>

            <div className="progress-content">
              <div className="progress-circle">
                <strong>{projects.length}</strong>
                <span>projects</span>
              </div>

              <div className="progress-details">
                <p>
                  <strong>
                    {projects.length}
                  </strong>{' '}
                  active projects
                </p>

                <div className="soft-progress">
                  <span
                    style={{
                      width: projects.length
                        ? '70%'
                        : '8%',
                    }}
                  />
                </div>

                <small>
                  Every story starts with one
                  sentence.
                </small>
              </div>
            </div>
          </section>

          <section className="dashboard-card projects-card">
            <div className="card-heading">
              <span className="card-icon">◈</span>

              <div>
                <h2>My Projects</h2>
                <span>
                  {projects.length} total
                </span>
              </div>
            </div>

            {isLoading && (
              <p className="empty-message">
                Loading projects...
              </p>
            )}

            {!isLoading &&
              projects.length === 0 && (
                <p className="empty-message">
                  No projects yet.
                </p>
              )}

            {!isLoading &&
              projects.length > 0 && (
                <div className="project-mini-list">
                  {projects
                    .slice(0, 3)
                    .map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="project-mini"
                      >
                        <div className="project-dot">
                          ✦
                        </div>

                        <div>
                          <strong>
                            {project.title}
                          </strong>

                          <span>
                            {project.genre ||
                              'Writing project'}
                          </span>
                        </div>

                        <span className="arrow">
                          →
                        </span>
                      </Link>
                    ))}
                </div>
              )}
          </section>

          <section className="dashboard-card create-card">
            <div className="card-heading">
              <span className="card-icon">+</span>

              <div>
                <h2>New Project</h2>
                <span>
                  Start a new story
                </span>
              </div>
            </div>

            <form onSubmit={handleCreateProject}>
              <label>
                Title

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="My new story"
                  required
                />
              </label>

              <label>
                Genre

                <input
                  type="text"
                  value={genre}
                  onChange={(event) =>
                    setGenre(event.target.value)
                  }
                  placeholder="Fantasy, romance..."
                />
              </label>

              <label>
                Description

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="What is your story about?"
                />
              </label>

              <button
                type="submit"
                disabled={isCreating}
              >
                {isCreating
                  ? 'Creating...'
                  : '✦ Create Project'}
              </button>
            </form>
          </section>

          <section className="dashboard-card overview-card">
            <div className="card-heading">
              <span className="card-icon">▦</span>

              <div>
                <h2>Overview</h2>
                <span>Your workspace</span>
              </div>
            </div>

            <div className="stat-grid">
              <div className="stat-item">
                <strong>{projects.length}</strong>
                <span>Projects</span>
              </div>

              <div className="stat-item">
                <strong>✎</strong>
                <span>Chapters</span>
              </div>

              <div className="stat-item">
                <strong>✓</strong>
                <span>Tasks</span>
              </div>

              <div className="stat-item">
                <strong>♙</strong>
                <span>Characters</span>
              </div>
            </div>

            <div className="overview-message">
              <span>🌿</span>

              <p>
                Your stories are waiting
                for you.
              </p>
            </div>
          </section>

          <section className="dashboard-card recent-card">
            <div className="card-heading">
              <span className="card-icon">▱</span>

              <div>
                <h2>Quick Start</h2>
                <span>
                  Pick up where you left off
                </span>
              </div>
            </div>

            <div className="quick-actions">
              {projects.slice(0, 4).map(
                (project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="quick-project"
                  >
                    <span>✦</span>

                    <div>
                      <strong>
                        {project.title}
                      </strong>

                      <small>
                        Continue writing →
                      </small>
                    </div>
                  </Link>
                ),
              )}

              {projects.length === 0 && (
                <p className="empty-message">
                  Create your first project
                  to get started.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage