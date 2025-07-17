import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  MessageSquare, 
  Clock, 
  Code, 
  BookOpen, 
  Users, 
  FileText, 
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import type { User, Chat } from '@/lib/blink'

interface ChatSidebarProps {
  user: User | null
  currentChatId?: string
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onAuthRequired: () => void
}

export function ChatSidebar({ user, currentChatId, onNewChat, onSelectChat, onDeleteChat, onAuthRequired }: ChatSidebarProps) {
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      title: 'HR Policy Questions',
      messages: [],
      userId: user?.id,
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000
    },
    {
      id: '2',
      title: 'SHRM Certification Help',
      messages: [],
      userId: user?.id,
      createdAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000
    },
    {
      id: '3',
      title: 'Employee Relations',
      messages: [],
      userId: user?.id,
      createdAt: Date.now() - 259200000,
      updatedAt: Date.now() - 259200000
    }
  ])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const quickActions = [
    {
      icon: BookOpen,
      label: 'SHRM Study Guide',
      description: 'Certification prep materials'
    },
    {
      icon: Users,
      label: 'Employee Relations',
      description: 'Conflict resolution & communication'
    },
    {
      icon: FileText,
      label: 'HR Policies',
      description: 'Templates & best practices'
    },
    {
      icon: Settings,
      label: 'Compliance Check',
      description: 'Legal requirements & updates'
    }
  ]

  const handleQuickAction = (label: string) => {
    const prompts = {
      'SHRM Study Guide': 'Can you help me prepare for the SHRM certification exam?',
      'Employee Relations': 'I need help with employee conflict resolution strategies.',
      'HR Policies': 'What are the essential HR policies every company should have?',
      'Compliance Check': 'What are the latest employment law compliance requirements?'
    }
    
    // This would trigger a new chat with the predefined prompt
    onNewChat()
    // In a real implementation, you'd pass the prompt to the chat interface
  }

  return (
    <div className="w-80 border-r bg-gray-50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Fire Works AI</h1>
            <p className="text-sm text-gray-500">HR & SHRM Assistant</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Quick Actions</h3>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3 hover:bg-white hover:shadow-sm"
              onClick={() => handleQuickAction(action.label)}
            >
              <action.icon className="w-4 h-4 mr-3 text-purple-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{action.label}</p>
                <p className="text-xs text-gray-500 truncate">{action.description}</p>
              </div>
              <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Chat History */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
            <Clock className="w-3 h-3 mr-2" />
            Recent Chats
          </h3>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1 pb-4">
            {user ? (
              chats.length > 0 ? (
                chats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto p-3 hover:bg-white hover:shadow-sm ${
                      currentChatId === chat.id ? 'bg-purple-50 border border-purple-200' : ''
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{chat.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(chat.updatedAt)}</p>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No chats yet</p>
                  <p className="text-xs text-gray-400">Start a conversation above</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Sign in to view</p>
                <p className="text-xs text-gray-400">your chat history</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Developer Tools Section */}
      {user?.badges.includes('developer') && (
        <>
          <Separator />
          <div className="px-4 py-3">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center">
              <Code className="w-3 h-3 mr-2" />
              Developer Tools
            </h3>
            <div className="mt-3 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto p-3 hover:bg-white hover:shadow-sm"
              >
                <Sparkles className="w-4 h-4 mr-3 text-amber-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">AI Training</p>
                  <p className="text-xs text-gray-500">Customize AI responses</p>
                </div>
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-auto p-3 hover:bg-white hover:shadow-sm"
              >
                <FileText className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Knowledge Base</p>
                  <p className="text-xs text-gray-500">Upload custom content</p>
                </div>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* User Profile */}
      <div className="border-t bg-white p-4">
        {user ? (
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                {user.displayName?.charAt(0) || user.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.displayName || user.email.split('@')[0]}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-0 ${
                    user.plan === 'pro' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                    user.plan === 'premium' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}
                >
                  {user.plan.toUpperCase()}
                </Badge>
                {user.badges.includes('developer') && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-2 py-0">
                    <Code className="w-3 h-3 mr-1" />
                    Dev
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Button 
              onClick={onAuthRequired}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 mb-2"
              size="sm"
            >
              Sign In
            </Button>
            <p className="text-xs text-gray-500">
              Get 50 free messages per month
            </p>
          </div>
        )}
      </div>
    </div>
  )
}