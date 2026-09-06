import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ProjectPage from './pages/ProjectPage'
import ChapterPage from './pages/ChapterPage'
import ProjectsPage from './pages/ProjectsPage'
import TasksPage from './pages/TasksPage'
import CharactersPage from './pages/CharactersPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('access_token')),
  )

  if (!isAuthenticated) {
    return (
      <AuthPage
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route
          path="/characters"
          element={<CharactersPage />}
        />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route
          path="/projects/:projectId/chapters/:chapterId"
          element={<ChapterPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App