import { useState } from 'react'

import { login, register } from '../api/auth'

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
    setIsLogin(!isLogin)
    setError('')
    setPassword('')
  }

  return (
    <main>
      <h1>
        {isLogin
          ? 'Welcome back'
          : 'Create your account'}
      </h1>

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
          <p>
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
              ? 'Login'
              : 'Create account'}
        </button>
      </form>

      <button
        type="button"
        onClick={toggleMode}
      >
        {isLogin
          ? 'Create an account'
          : 'Already have an account? Login'}
      </button>
    </main>
  )
}

export default AuthPage