import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getProjects } from '../api/projects'
import { getTasks, updateTask } from '../api/tasks'

import type { Project } from '../types/project'
import type { Task } from '../types/task'

import '../styles/tasks.css'

type ProjectTasks = {
  project: Project
  tasks: Task[]
}

function TasksPage() {
  const [projectTasks, setProjectTasks] = useState<ProjectTasks[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTasks() {
      try {
        const projects = await getProjects()

        const results = await Promise.all(
          projects.map(async (project) => ({
            project,
            tasks: await getTasks(project.id),
          })),
        )

        setProjectTasks(results)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load tasks',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [])

  async function handleToggleTask(
    projectId: number,
    task: Task,
  ) {
    try {
      const updatedTask = await updateTask(
        projectId,
        task.id,
        {
          completed: !task.completed,
        },
      )

      setProjectTasks((current) =>
        current.map((group) => {
          if (group.project.id !== projectId) {
            return group
          }

          return {
            ...group,
            tasks: group.tasks.map((item) =>
              item.id === updatedTask.id
                ? updatedTask
                : item,
            ),
          }
        }),
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update task',
      )
    }
  }

  const totalTasks = projectTasks.reduce(
    (total, group) => total + group.tasks.length,
    0,
  )

  const completedTasks = projectTasks.reduce(
    (total, group) =>
      total +
      group.tasks.filter((task) => task.completed).length,
    0,
  )

  const pendingTasks = totalTasks - completedTasks

  const projectsWithTasks = projectTasks.filter(
    (group) => group.tasks.length > 0,
  )

  return (
    <main className="tasks-page">
      <header className="tasks-header">
        <Link to="/" className="back-link">
          ← Home
        </Link>

        <p className="page-eyebrow">TO DO</p>

        <h1>Tasks</h1>

        <p className="tasks-subtitle">
          {pendingTasks === 0
            ? 'Everything is done.'
            : `${pendingTasks} task${pendingTasks === 1 ? '' : 's'} left to do.`}
        </p>
      </header>

      {error && (
        <p className="tasks-error">{error}</p>
      )}

      {isLoading && (
        <p className="tasks-status">Loading tasks...</p>
      )}

      {!isLoading && totalTasks === 0 && (
        <section className="tasks-empty">
          <div className="empty-icon">✓</div>

          <h2>No tasks yet</h2>

          <p>
            Tasks created inside your projects will
            appear here.
          </p>

          <Link to="/projects" className="tasks-link">
            View projects
          </Link>
        </section>
      )}

      {!isLoading && projectsWithTasks.length > 0 && (
        <section className="tasks-list">
          {projectsWithTasks.map(({ project, tasks }) => {
            const completed = tasks.filter(
              (task) => task.completed,
            ).length

            return (
              <article
                key={project.id}
                className="task-project"
              >
                <div className="task-project-header">
                  <div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="task-project-title"
                    >
                      {project.title}
                    </Link>

                    <p>
                      {completed}/{tasks.length} completed
                    </p>
                  </div>

                  <span className="task-count">
                    {tasks.length}
                  </span>
                </div>

                <div className="task-items">
                  {tasks.map((task) => (
                    <label
                      key={task.id}
                      className={`task-item ${
                        task.completed
                          ? 'task-item-completed'
                          : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() =>
                          handleToggleTask(
                            project.id,
                            task,
                          )
                        }
                      />

                      <span>{task.title}</span>
                    </label>
                  ))}
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}

export default TasksPage