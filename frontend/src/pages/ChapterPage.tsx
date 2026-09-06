import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  getChapter,
  updateChapter,
  deleteChapter,
} from '../api/chapters'

import {
  getNotes,
  createNote,
} from '../api/notes'

import type { Chapter } from '../types/chapter'
import type { Note } from '../types/note'

import '../styles/chapter.css'

function ChapterPage() {
  const { projectId, chapterId } = useParams()

  const [chapter, setChapter] =
    useState<Chapter | null>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [notes, setNotes] = useState<Note[]>([])
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(true)

  const [isSaving, setIsSaving] =
    useState(false)

  const [isDeleting, setIsDeleting] =
    useState(false)

  const [isCreatingNote, setIsCreatingNote] =
    useState(false)

  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!projectId || !chapterId) {
      return
    }

    async function loadChapter() {
      try {
        const id = Number(projectId)
        const chapterIdNumber = Number(chapterId)

        const [chapterData, notesData] =
          await Promise.all([
            getChapter(id, chapterIdNumber),
            getNotes(id),
          ])

        setChapter(chapterData)
        setTitle(chapterData.title)
        setContent(chapterData.content)
        setNotes(notesData)
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
      const updatedChapter =
        await updateChapter(
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

  async function handleDeleteChapter() {
    if (!projectId || !chapterId) {
      return
    }

    const confirmed = window.confirm(
      'Delete this chapter? This action cannot be undone.',
    )

    if (!confirmed) {
      return
    }

    setError('')
    setIsDeleting(true)

    try {
      await deleteChapter(
        Number(projectId),
        Number(chapterId),
      )

      window.location.href = `/projects/${projectId}`
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to delete chapter',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleCreateNote(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !projectId ||
      !noteTitle.trim()
    ) {
      return
    }

    setError('')
    setIsCreatingNote(true)

    try {
      const note = await createNote(
        Number(projectId),
        {
          title: noteTitle,
          content: noteContent,
        },
      )

      setNotes((current) => [
        ...current,
        note,
      ])

      setNoteTitle('')
      setNoteContent('')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create note',
      )
    } finally {
      setIsCreatingNote(false)
    }
  }

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

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length

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
          <span>Chapter {chapter.position}</span>
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
          <form onSubmit={handleSave}>
            <div className="chapter-heading">
              <span className="chapter-label">
                Chapter{' '}
                {String(
                  chapter.position,
                ).padStart(2, '0')}
              </span>
            </div>

            <input
              className="chapter-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              placeholder="Chapter title..."
              required
            />

            <div className="chapter-divider" />

            <textarea
              className="chapter-editor"
              value={content}
              onChange={(event) => {
                setContent(
                  event.target.value,
                )
                setSaved(false)
              }}
              placeholder="Let the story begin..."
            />

            <footer className="chapter-footer">
              <span className="chapter-meta">
                {wordCount} words
              </span>

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
                    : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteChapter}
                  disabled={isDeleting || isSaving}
                  className="delete-chapter-button"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </footer>
          </form>
        </div>
      </section>

      <section className="chapter-notes">
        <div className="chapter-notes-header">
          <div>
            <span className="chapter-label">
              Notes
            </span>

            <h2>Ideas for this chapter</h2>
          </div>

          <span>
            {notes.length}
          </span>
        </div>

        <form
          className="chapter-note-form"
          onSubmit={handleCreateNote}
        >
          <input
            type="text"
            value={noteTitle}
            onChange={(event) =>
              setNoteTitle(
                event.target.value,
              )
            }
            placeholder="Note title..."
            required
          />

          <textarea
            value={noteContent}
            onChange={(event) =>
              setNoteContent(
                event.target.value,
              )
            }
            placeholder="Write an idea..."
            rows={3}
          />

          <button
            type="submit"
            disabled={isCreatingNote}
          >
            {isCreatingNote
              ? 'Adding...'
              : '+ Add Note'}
          </button>
        </form>

        {notes.length > 0 && (
          <div className="chapter-notes-list">
            {notes.map((note) => (
              <article
                key={note.id}
                className="chapter-note"
              >
                <h3>{note.title}</h3>

                <p>{note.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default ChapterPage