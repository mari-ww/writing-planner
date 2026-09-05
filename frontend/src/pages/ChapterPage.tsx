import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  getChapter,
  updateChapter,
} from '../api/chapters'

import type { Chapter } from '../types/chapter'

import '../styles/chapter.css'

function ChapterPage() {
  const { projectId, chapterId } = useParams()

  const [chapter, setChapter] = useState<Chapter | null>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!projectId || !chapterId) {
      return
    }

    async function loadChapter() {
      try {
        const data = await getChapter(
          Number(projectId),
          Number(chapterId),
        )

        setChapter(data)
        setTitle(data.title)
        setContent(data.content)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load chapter',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadChapter()
  }, [projectId, chapterId])

  async function handleSave(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!projectId || !chapterId) {
      return
    }

    setError('')
    setSaved(false)
    setIsSaving(true)

    try {
      const updatedChapter = await updateChapter(
        Number(projectId),
        Number(chapterId),
        {
          title,
          content,
        },
      )

      setChapter(updatedChapter)
      setTitle(updatedChapter.title)
      setContent(updatedChapter.content)
      setSaved(true)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to save chapter',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  if (isLoading) {
    return (
      <main className="chapter-page-state">
        <p>Opening your chapter...</p>
      </main>
    )
  }

  if (error && !chapter) {
    return (
      <main className="chapter-page-state">
        <p>{error}</p>
      </main>
    )
  }

  if (!chapter) {
    return (
      <main className="chapter-page-state">
        <p>Chapter not found.</p>
      </main>
    )
  }

  return (
    <main className="chapter-page">
      <header className="chapter-topbar">
        <Link
          to={`/projects/${projectId}`}
          className="chapter-back"
        >
          ← Back to story
        </Link>

        <div className="chapter-topbar-center">
          <span>Writing Journal</span>
          <small>Chapter {chapter.position}</small>
        </div>

        <div className="chapter-topbar-right">
          {saved && (
            <span className="saved-indicator">
              ✓ Saved
            </span>
          )}
        </div>
      </header>

      <section className="chapter-sheet">
        <div className="chapter-sheet-inner">
          <div className="chapter-heading">
            <span className="chapter-label">
              Chapter {String(chapter.position).padStart(2, '0')}
            </span>

            <span className="chapter-date">
              Your story, your words.
            </span>
          </div>

          <form onSubmit={handleSave}>
            <input
              className="chapter-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Chapter title..."
              required
            />

            <div className="chapter-divider" />

            <textarea
              className="chapter-editor"
              value={content}
              onChange={(event) => {
                setContent(event.target.value)
                setSaved(false)
              }}
              placeholder="Let the story begin..."
            />

            <footer className="chapter-footer">
              <div className="chapter-meta">
                <span>{wordCount} words</span>

                <span className="meta-dot">·</span>

                <span>
                  Chapter {chapter.position}
                </span>
              </div>

              <div className="chapter-actions">
                {error && (
                  <span className="chapter-error">
                    {error}
                  </span>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="save-chapter-button"
                >
                  {isSaving
                    ? 'Saving...'
                    : 'Save Chapter'}
                </button>
              </div>
            </footer>
          </form>
        </div>
      </section>
    </main>
  )
}

export default ChapterPage