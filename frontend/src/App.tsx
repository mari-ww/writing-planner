import { useState } from 'react'

import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('access_token')),
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

  return <DashboardPage />
}

export default App