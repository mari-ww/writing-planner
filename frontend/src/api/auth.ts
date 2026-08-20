import { apiRequest } from './client'
import type { TokenResponse, User } from '../types/user'

interface AuthCredentials {
  email: string
  password: string
}

export function register(
  data: AuthCredentials,
): Promise<User> {
  return apiRequest<User>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}

export function login(
  data: AuthCredentials,
): Promise<TokenResponse> {
  return apiRequest<TokenResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}