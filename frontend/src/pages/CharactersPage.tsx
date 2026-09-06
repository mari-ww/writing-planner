import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getProjects } from '../api/projects'
import { getCharacters } from '../api/characters'

import type { Project } from '../types/project'
import type { Character } from '../types/character'

import '../styles/characters.css'

type ProjectCharacters = {
  project: Project
  characters: Character[]
}

function CharactersPage() {
  const [projectCharacters, setProjectCharacters] = useState<
    ProjectCharacters[]
  >([])

  const [selectedCharacter, setSelectedCharacter] =
    useState<Character | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCharacters() {
      try {
        const projects = await getProjects()

        const results = await Promise.all(
          projects.map(async (project) => ({
            project,
            characters: await getCharacters(project.id),
          })),
        )

        setProjectCharacters(results)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load characters',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadCharacters()
  }, [])

  const totalCharacters = projectCharacters.reduce(
    (total, group) => total + group.characters.length,
    0,
  )

  return (
    <main className="characters-page">
      <header className="characters-header">
        <Link to="/" className="back-link">
          ← Home
        </Link>

        <p className="page-eyebrow">CAST</p>

        <h1>Characters</h1>

        <p className="characters-subtitle">
          {totalCharacters === 0
            ? 'The people behind your stories.'
            : `${totalCharacters} character${
                totalCharacters === 1 ? '' : 's'
              } across your stories.`}
        </p>
      </header>

      {error && (
        <p className="characters-error">{error}</p>
      )}

      {isLoading && (
        <p className="characters-status">
          Loading characters...
        </p>
      )}

      {!isLoading && totalCharacters === 0 && (
        <section className="characters-empty">
          <div className="empty-icon">✦</div>

          <h2>No characters yet</h2>

          <p>
            Characters you create inside your projects
            will appear here.
          </p>

          <Link
            to="/projects"
            className="characters-link"
          >
            View projects
          </Link>
        </section>
      )}

      {!isLoading && totalCharacters > 0 && (
        <section className="characters-projects">
          {projectCharacters.map(
            ({ project, characters }) => {
              if (characters.length === 0) {
                return null
              }

              return (
                <article
                  key={project.id}
                  className="characters-project"
                >
                  <div className="characters-project-header">
                    <Link
                      to={`/projects/${project.id}`}
                      className="characters-project-title"
                    >
                      {project.title}
                    </Link>

                    <span>
                      {characters.length}
                    </span>
                  </div>

                  <div className="characters-grid">
                    {characters.map((character) => (
                      <button
                        key={character.id}
                        type="button"
                        className="character-card"
                        onClick={() =>
                          setSelectedCharacter(character)
                        }
                      >
                        <div className="character-avatar">
                          {character.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="character-info">
                          <strong>
                            {character.name}
                          </strong>

                          {character.role && (
                            <span>{character.role}</span>
                          )}
                        </div>

                        <span className="character-arrow">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </article>
              )
            },
          )}
        </section>
      )}

      {selectedCharacter && (
        <div className="character-summary">
          <div className="character-summary-header">
            <div>
              <p className="page-eyebrow">CHARACTER</p>

              <h2>{selectedCharacter.name}</h2>

              {selectedCharacter.role && (
                <span>{selectedCharacter.role}</span>
              )}
            </div>

            <button
              type="button"
              className="character-close"
              onClick={() =>
                setSelectedCharacter(null)
              }
            >
              ×
            </button>
          </div>

          {selectedCharacter.description && (
            <p className="character-description">
              {selectedCharacter.description}
            </p>
          )}
        </div>
      )}
    </main>
  )
}

export default CharactersPage