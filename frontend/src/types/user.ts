export interface User {
  id: number
  email: string
  daily_word_goal: number
}

export interface TokenResponse {
  access_token: string
  token_type: string
}