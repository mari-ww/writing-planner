import { useState } from 'react'

import {
  login,
  register,
} from './api/auth'

import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      Boolean(
        localStorage.getItem('access_token'),
      ),
    )

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] =
    useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const response = await login({
          email,
          password,
        })

        localStorage.setItem(
          'access_token',
          response.access_token,
        )

        setIsAuthenticated(true)
      } else {
        await register({
          email,
          password,
        })

        const response = await login({
          email,
          password,
        })

        localStorage.setItem(
          'access_token',
          response.access_token,
        )

        setIsAuthenticated(true)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'Something went wrong',
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem(
      'access_token',
    )

    setIsAuthenticated(false)
  }

  if (isAuthenticated) {
    return (
      <main className="app">
        <section className="authenticated">
          <h1>Writing Planner</h1>

          <p>
            You are logged in.
          </p>

          <button
            type="button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app">
      <section className="auth-card">
        <div className="auth-header">
          <h1>Writing Planner</h1>

          <p>
            {isLogin
              ? 'Welcome back. Continue writing your story.'
              : 'Create your account and start writing.'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </label>

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Loading...'
              : isLogin
                ? 'Log in'
                : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          className="switch-mode"
          onClick={() => {
            setIsLogin(!isLogin)
            setError('')
          }}
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </button>
      </section>
    </main>
  )
}

export default App