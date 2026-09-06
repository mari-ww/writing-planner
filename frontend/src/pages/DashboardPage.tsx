import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/dashboard.css'

import {
  createProject,
  getProjects,
} from '../api/projects'

import { getWritingHistory } from '../api/dailyWriting'

import type { Project } from '../types/project'

type WritingDay = {
  date: string
  words_written: number
}

function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [writingHistory, setWritingHistory] =
    useState<WritingDay[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const location = useLocation()

  useEffect(() => {
    async function loadDashboard() {
      try {
        const projectData = await getProjects()

        setProjects(projectData)

        const histories = await Promise.all(
          projectData.map((project) =>
            getWritingHistory(project.id),
          ),
        )

        const writingByDate = new Map<
          string,
          number
        >()

        histories.flat().forEach((day) => {
          const current =
            writingByDate.get(day.date) ?? 0

          writingByDate.set(
            day.date,
            current + day.words_written,
          )
        })

        const combinedHistory = Array.from(
          writingByDate.entries(),
        )
          .map(([date, words_written]) => ({
            date,
            words_written,
          }))
          .sort((a, b) =>
            a.date.localeCompare(b.date),
          )

        setWritingHistory(combinedHistory)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load dashboard',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
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

      setProjects((current) => [
        ...current,
        project,
      ])

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

  function handleLogout() {
    localStorage.removeItem('access_token')
    window.location.reload()
  }

  const navigationItems = [
    { label: 'Home', icon: '⌂', to: '/' },
    { label: 'Projects', icon: '◈', to: '/projects' },
    { label: 'Tasks', icon: '✓', to: '/tasks' },
    { label: 'Characters', icon: '♙', to: '/characters' },
  ]

  const today = new Date()
  const graphStart = new Date(today)
  graphStart.setDate(
    today.getDate() - 364,
  )

  const writingMap = new Map(
    writingHistory.map((day) => [
      day.date,
      day.words_written,
    ]),
  )

  const maxWords = Math.max(
    ...writingHistory.map(
      (day) => day.words_written,
    ),
    0,
  )

  const graphDays = Array.from(
    { length: 365 },
    (_, index) => {
      const date = new Date(graphStart)
      date.setDate(
        graphStart.getDate() + index,
      )

      const dateKey = date
        .toISOString()
        .split('T')[0]

      const wordsWritten =
        writingMap.get(dateKey) ?? 0

      let level = 0

      if (wordsWritten > 0) {
        const ratio =
          maxWords > 0
            ? wordsWritten / maxWords
            : 0

        if (ratio <= 0.25) {
          level = 1
        } else if (ratio <= 0.5) {
          level = 2
        } else if (ratio <= 0.75) {
          level = 3
        } else {
          level = 4
        }
      }

      return {
        date: dateKey,
        wordsWritten,
        level,
      }
    },
  )

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
              A quiet place for your stories.
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

          {/* WRITING STATS */}

          <section className="dashboard-card writing-stats-card">
            <div className="card-heading">
              <span className="card-icon">▦</span>

              <div>
                <h2>Writing Stats</h2>
                <span>Your writing activity</span>
              </div>
            </div>

            <div className="writing-stats-summary">
              <strong>
                {writingHistory.reduce(
                  (total, day) =>
                    total + day.words_written,
                  0,
                )}
              </strong>

              <span>words written</span>
            </div>

            <div className="writing-graph">
              {graphDays.map((day) => (
                <span
                  key={day.date}
                  className={`writing-day writing-day-${day.level}`}
                  title={`${day.date}: ${day.wordsWritten} words`}
                />
              ))}
            </div>

            <div className="writing-graph-legend">
              <span>Less</span>

              <span className="writing-day writing-day-0" />
              <span className="writing-day writing-day-1" />
              <span className="writing-day writing-day-2" />
              <span className="writing-day writing-day-3" />
              <span className="writing-day writing-day-4" />

              <span>More</span>
            </div>
          </section>

          {/* WRITING PROGRESS */}

          <section className="dashboard-card progress-card">
            <div className="card-heading">
              <span className="card-icon">✦</span>

              <div>
                <h2>Writing Progress</h2>
                <span>Your projects at a glance</span>
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
                  Create your first project to start
                  writing.
                </p>
              )}

            {!isLoading &&
              projects.length > 0 && (
                <div className="writing-progress-list">
                  {projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="writing-progress-item"
                    >
                      <div className="writing-progress-info">
                        <strong>
                          {project.title}
                        </strong>

                        <span>
                          {project.genre ||
                            'Writing project'}
                        </span>
                      </div>

                      <div className="writing-progress-bar">
                        <span
                          style={{
                            width: '0%',
                          }}
                        />
                      </div>

                      <span className="writing-progress-arrow">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              )}
          </section>

          {/* OVERVIEW */}

          <section className="dashboard-card stats-card">
            <div className="card-heading">
              <span className="card-icon">▦</span>

              <div>
                <h2>Overview</h2>
                <span>All your writing in one place</span>
              </div>
            </div>

            <div className="stat-grid">
              <div className="stat-item">
                <strong>{projects.length}</strong>
                <span>Projects</span>
              </div>

              <div className="stat-item">
                <strong>—</strong>
                <span>Words this month</span>
              </div>

              <div className="stat-item">
                <strong>—</strong>
                <span>Daily average</span>
              </div>

              <div className="stat-item">
                <strong>—</strong>
                <span>Best day</span>
              </div>
            </div>

            <div className="stats-footer">
              <span>✦</span>

              <p>
                Keep writing. Your numbers will
                follow.
              </p>
            </div>
          </section>

          {/* QUICK START */}

          <section className="dashboard-card quick-start-card">
            <div className="card-heading">
              <span className="card-icon">✎</span>

              <div>
                <h2>Quick Start</h2>
                <span>Continue where you left off</span>
              </div>
            </div>

            {projects.length === 0 ? (
              <p className="empty-message">
                Create a project to start writing.
              </p>
            ) : (
              <div className="quick-actions">
                {projects.slice(0, 3).map((project) => (
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
                ))}
              </div>
            )}
          </section>

          {/* NEW PROJECT */}

          <section className="dashboard-card create-card">
            <div className="card-heading">
              <span className="card-icon">+</span>

              <div>
                <h2>New Project</h2>
                <span>Start a new story</span>
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
        </div>
      </main>
    </div>
  )
}

export default DashboardPage