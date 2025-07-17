import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { User, Settings, Crown, Code, LogOut, Zap, Plus } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { ProfileSettings } from './ProfileSettings'
import { PricingModal } from './PricingModal'
import type { User as UserType } from '@/lib/blink'

interface HeaderProps {
  user: UserType | null
  onLogin: (user: UserType) => void
  onLogout: () => void
}

export function Header({ user, onLogin, onLogout }: HeaderProps) {
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showPricing, setShowPricing] = useState(false)

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'premium': return 'bg-gradient-to-r from-blue-500 to-cyan-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro': return <Crown className="w-3 h-3" />
      case 'premium': return <Zap className="w-3 h-3" />
      default: return null
    }
  }

  return (
    <header className="border-b bg-white flex items-center justify-between px-6 py-3">
      {/* Left - Empty for balance */}
      <div className="w-32"></div>

      {/* Center - Title */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">Fire Works AI</h1>
        <p className="text-sm text-gray-500">HR & SHRM Assistant</p>
      </div>

      {/* Right - User Actions */}
      <div className="flex items-center space-x-4 w-32 justify-end">
        {user ? (
          <>
            {/* Message Counter */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{user.messageCount}</span>
              <span className="text-gray-400">/</span>
              <span>{user.maxMessages === -1 ? '∞' : user.maxMessages}</span>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.displayName || user.email} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                      {(user.displayName || user.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.plan !== 'free' && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${getPlanColor(user.plan)} flex items-center justify-center text-white`}>
                      {getPlanIcon(user.plan)}
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <div className="flex items-center justify-start gap-2 p-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                      {(user.displayName || user.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{user.displayName || 'User'}</p>
                    <p className="w-[180px] truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Badge variant="secondary" className={`text-xs ${getPlanColor(user.plan)} text-white`}>
                        {user.plan.toUpperCase()}
                      </Badge>
                      {user.badges.map((badge) => (
                        <Badge key={badge} variant="outline" className="text-xs">
                          {badge === 'developer' && <Code className="w-3 h-3 mr-1" />}
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowPricing(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => setShowAuth(true)} size="sm">
              Sign In
            </Button>
            <Button 
              onClick={() => setShowAuth(true)} 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="sm"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AuthModal 
        open={showAuth} 
        onOpenChange={setShowAuth}
        onLogin={onLogin}
      />
      
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          {user && <ProfileSettings user={user} onUpdate={onLogin} />}
        </DialogContent>
      </Dialog>

      <PricingModal 
        open={showPricing}
        onOpenChange={setShowPricing}
        currentPlan={user?.plan || 'free'}
      />
    </header>
  )
}