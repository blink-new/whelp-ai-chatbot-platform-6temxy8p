import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Bot, User as UserIcon, Sparkles, Crown, Zap, Copy, ThumbsUp, ThumbsDown, RotateCcw, Paperclip, Mic } from 'lucide-react'
import { blink } from '@/lib/blink'
import type { User, Message, Chat } from '@/lib/blink'

interface ChatInterfaceProps {
  user: User | null
  onAuthRequired: () => void
  onUpgradeRequired: () => void
}

export function ChatInterface({ user, onAuthRequired, onUpgradeRequired }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `I'm looking for some conversation starters, I can suggest a few topics: * **Technology**: We could discuss the latest advancements in AI, space exploration, or emerging tech trends. * **Creativity**: I'd be happy to engage in a fun writing prompt, generate a short story, or explore a creative idea together. * **Learning**: If you have a specific subject in mind, such as programming, psychology, or philosophy, I'm here to provide information and insights.

Feel free to pick one of these topics, or share something entirely different that's been on your mind. I'm excited to chat with you and see where our conversation takes us! By the way, I noticed you mentioned **"fworks ai"** and its founder, Elyar Hamidi. That's fascinating! Would you like to know more about AI or its applications?`,
      role: 'assistant',
      timestamp: Date.now() - 1000
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [guestMessageCount, setGuestMessageCount] = useState(0)
  const [streamingMessage, setStreamingMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

  const canSendMessage = () => {
    if (user) {
      return user.messageCount < user.maxMessages || user.maxMessages === -1
    }
    return guestMessageCount < 3 // Guest limit
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    if (!canSendMessage()) {
      if (!user) {
        onAuthRequired()
      } else {
        onUpgradeRequired()
      }
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: Date.now(),
      userId: user?.id
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)
    setStreamingMessage('')

    // Update message counts
    if (!user) {
      setGuestMessageCount(prev => prev + 1)
    }

    try {
      let fullResponse = ''
      
      // Use Blink AI for real responses
      await blink.ai.streamText(
        { 
          prompt: `You are Fire Works AI, an HR and SHRM assistant. Respond helpfully to: ${currentInput}`,
          model: 'gpt-4o-mini'
        },
        (chunk) => {
          fullResponse += chunk
          setStreamingMessage(fullResponse)
        }
      )

      // Add the complete streamed message to messages
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: fullResponse,
        role: 'assistant',
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, assistantMessage])
      setStreamingMessage('')
    } catch (error) {
      console.error('AI Error:', error)
      // Fallback response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  const getMessageLimit = () => {
    if (user) {
      return user.maxMessages === -1 ? '∞' : user.maxMessages
    }
    return 3
  }

  const getCurrentCount = () => {
    if (user) {
      return user.messageCount
    }
    return guestMessageCount
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-4 ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                {message.role === 'assistant' ? (
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                ) : (
                  <>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                      <UserIcon className="w-4 h-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              
              <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl rounded-tr-md' 
                    : 'bg-gray-50 rounded-2xl rounded-tl-md'
                } p-4`}>
                  <div className="prose prose-sm max-w-none">
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === 'user' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {message.content}
                    </p>
                  </div>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Streaming Message */}
          {streamingMessage && (
            <div className="flex items-start space-x-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="max-w-[80%] bg-gray-50 rounded-2xl rounded-tl-md p-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900">
                      {streamingMessage}
                      <span className="animate-pulse">|</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {isLoading && !streamingMessage && (
            <div className="flex items-start space-x-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="max-w-[80%] bg-gray-50 rounded-2xl rounded-tl-md p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Response */}
      <div className="border-t px-6 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-gray-600">Quick response</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about HR, SHRM certification, or workplace best practices..."
              disabled={!canSendMessage() || isLoading}
              className="min-h-[44px] max-h-[120px] resize-none pr-24 py-3 text-sm border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              rows={1}
            />
            
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || !canSendMessage() || isLoading}
                size="sm"
                className="h-8 w-8 p-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {!canSendMessage() && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              {!user 
                ? "Create a free account to get 50 messages per month" 
                : "Upgrade your plan to send more messages"
              }
            </p>
          )}
        </div>
      </div>
    </div>
  )
}