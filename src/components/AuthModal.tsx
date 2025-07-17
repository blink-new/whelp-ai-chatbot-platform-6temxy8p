import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Chrome, Mail, Lock, User } from 'lucide-react'
import { blink } from '@/lib/blink'
import type { User } from '@/lib/blink'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (user: User) => void
}

export function AuthModal({ open, onOpenChange, onLogin }: AuthModalProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      // Use Blink auth login
      blink.auth.login()
      onOpenChange(false)
    } catch (error) {
      console.error('Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!email || !password || (isSignUp && !name)) return
    
    setLoading(true)
    // Simulate email auth
    setTimeout(() => {
      const user: User = {
        id: 'email_' + Date.now(),
        email,
        displayName: isSignUp ? name : email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        plan: 'free',
        badges: [],
        messageCount: 0,
        maxMessages: 50
      }
      onLogin(user)
      onOpenChange(false)
      setLoading(false)
      setEmail('')
      setPassword('')
      setName('')
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome to Fire Works AI
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <Button 
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleEmailAuth(false)}
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <Button 
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={() => handleEmailAuth(true)}
                disabled={loading || !email || !password || !name}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-center text-gray-500 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  )
}