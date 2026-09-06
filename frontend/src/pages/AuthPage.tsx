import { useState } from 'react'
import type { FormEvent } from 'react'

import { login, register } from '../api/auth'
import '../styles/auth.css'

interface AuthPageProps {
  onAuthenticated: () => void
}

function AuthPage({
  onAuthenticated,
}: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
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

        onAuthenticated()
        return
      }

      await register({
        email,
        password,
      })

      setIsLogin(true)
      setPassword('')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong',
      )
    } finally {
      setIsLoading(false)
    }
  }

  function toggleMode() {
    setIsLogin((current) => !current)
    setError('')
    setPassword('')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand-icon">✎</div>

          <div>
            <strong>Writing</strong>
            <span>Planner</span>
          </div>
        </div>

        <div className="auth-heading">
          <p className="auth-eyebrow">
            ✦ YOUR WRITING SPACE
          </p>

          <h1>
            {isLogin
              ? 'Welcome back'
              : 'Create your account'}
          </h1>

          <p>
            {isLogin
              ? 'Continue working on your stories.'
              : 'A quiet place for your stories.'}
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
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
              placeholder="••••••••"
              autoComplete={
                isLogin
                  ? 'current-password'
                  : 'new-password'
              }
              required
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Loading...'
              : isLogin
                ? 'Login'
                : 'Create account'}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isLogin
              ? "Don't have an account?"
              : 'Already have an account?'}
          </span>

          <button
            type="button"
            onClick={toggleMode}
          >
            {isLogin
              ? 'Create an account'
              : 'Login'}
          </button>
        </div>

        <div className="auth-decoration">
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>

      </section>
    </main>
  )
}

export default AuthPage