import { useState } from 'react'

import AuthPage from './pages/AuthPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(
      localStorage.getItem('access_token'),
    ),
  )

  if (!isAuthenticated) {
    return (
      <AuthPage
        onAuthenticated={() =>
          setIsAuthenticated(true)
        }
      />
    )
  }

  return (
    <main>
      <h1>Writing Planner</h1>

      <button
        type="button"
        onClick={() => {
          localStorage.removeItem('access_token')
          setIsAuthenticated(false)
        }}
      >
        Logout
      </button>
    </main>
  )
}

export default App