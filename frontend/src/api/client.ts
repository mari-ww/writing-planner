const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem('access_token')

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...options.headers,
      },
    },
  )

  if (!response.ok) {
    const error = await response.json()

    throw new Error(
      error.detail || 'Something went wrong',
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}