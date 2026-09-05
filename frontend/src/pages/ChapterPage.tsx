import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  getChapter,
  updateChapter,
} from '../api/chapters'

import type { Chapter } from '../types/chapter'

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

  if (isLoading) {
    return <p>Loading chapter...</p>
  }

  if (error && !chapter) {
    return <p>{error}</p>
  }

  if (!chapter) {
    return <p>Chapter not found.</p>
  }

  return (
    <main>
      <Link to={`/projects/${projectId}`}>
        ← Back to project
      </Link>

      <h1>Chapter {chapter.position}</h1>

      <form onSubmit={handleSave}>
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
            rows={20}
          />
        </label>

        <p>{chapter.word_count} words</p>

        {error && <p>{error}</p>}

        {saved && <p>Chapter saved.</p>}

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Chapter'}
        </button>
      </form>
    </main>
  )
}

export default ChapterPage