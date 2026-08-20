import { apiRequest } from './client'
import type {
  TokenResponse,
  User,
} from '../types/user'

interface AuthData {
  email: string
  password: string
}

export function register(data: AuthData) {
  return apiRequest<User>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}

export function login(data: AuthData) {
  return apiRequest<TokenResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}