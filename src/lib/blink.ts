import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'whelp-ai-chatbot-platform-6temxy8p',
  authRequired: true // Enable auth for full functionality
})

export type User = {
  id: string
  email: string
  displayName?: string
  avatar?: string
  plan: 'free' | 'premium' | 'pro'
  badges: string[]
  messageCount: number
  maxMessages: number
}

export type Message = {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
  userId?: string
}

export type Chat = {
  id: string
  title: string
  messages: Message[]
  userId?: string
  createdAt: number
  updatedAt: number
}