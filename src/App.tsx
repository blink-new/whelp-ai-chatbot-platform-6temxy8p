import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { ChatInterface } from '@/components/ChatInterface'
import { ChatSidebar } from '@/components/ChatSidebar'
import { AuthModal } from '@/components/AuthModal'
import { PricingModal } from '@/components/PricingModal'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/lib/blink'
import type { User } from '@/lib/blink'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [currentChatId, setCurrentChatId] = useState<string>()
  const [showAuth, setShowAuth] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        const userData: User = {
          id: state.user.id,
          email: state.user.email || '',
          displayName: state.user.displayName || state.user.email?.split('@')[0] || 'User',
          avatar: state.user.avatar,
          plan: 'free', // Default plan
          badges: [],
          messageCount: 0,
          maxMessages: 50
        }
        setUser(userData)
      } else {
        setUser(null)
      }
      setIsLoading(state.isLoading)
    })

    return unsubscribe
  }, [])

  const handleLogin = (newUser: User) => {
    setUser(newUser)
    toast({
      title: "Welcome to Fire Works AI!",
      description: `You're now signed in as ${newUser.displayName || newUser.email}`,
    })
  }

  const handleLogout = () => {
    blink.auth.logout()
    setUser(null)
    setCurrentChatId(undefined)
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    })
  }

  const handleAuthRequired = () => {
    setShowAuth(true)
  }

  const handleUpgradeRequired = () => {
    setShowPricing(true)
  }

  const handleNewChat = () => {
    setCurrentChatId(undefined)
    // Clear any existing messages in the chat interface
    toast({
      title: "New chat started",
      description: "You can now start a fresh conversation.",
    })
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    toast({
      title: "Chat loaded",
      description: "Previous conversation has been loaded.",
    })
  }

  const handleDeleteChat = (chatId: string) => {
    if (currentChatId === chatId) {
      setCurrentChatId(undefined)
    }
    toast({
      title: "Chat deleted",
      description: "The conversation has been removed.",
      variant: "destructive"
    })
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading Fire Works AI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <ChatSidebar
        user={user}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onAuthRequired={handleAuthRequired}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header 
          user={user} 
          onLogin={handleLogin} 
          onLogout={handleLogout} 
        />

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            user={user}
            onAuthRequired={handleAuthRequired}
            onUpgradeRequired={handleUpgradeRequired}
          />
        </div>
      </div>

      {/* Modals */}
      <AuthModal 
        open={showAuth} 
        onOpenChange={setShowAuth}
        onLogin={handleLogin}
      />
      
      <PricingModal 
        open={showPricing}
        onOpenChange={setShowPricing}
        currentPlan={user?.plan || 'free'}
      />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}

export default App