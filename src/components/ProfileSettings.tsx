import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Crown, Code, Camera } from 'lucide-react'
import type { User as UserType } from '@/lib/blink'

interface ProfileSettingsProps {
  user: UserType
  onUpdate: (user: UserType) => void
}

export function ProfileSettings({ user, onUpdate }: ProfileSettingsProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const updatedUser = { ...user, displayName }
      onUpdate(updatedUser)
      setLoading(false)
    }, 1000)
  }

  const generateNewAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
    const updatedUser = { ...user, avatar: newAvatar }
    onUpdate(updatedUser)
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'from-purple-500 to-pink-500'
      case 'premium': return 'from-blue-500 to-cyan-500'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.displayName || user.email} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
              {(user.displayName || user.email).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
            onClick={generateNewAvatar}
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user.displayName || 'User'}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={`bg-gradient-to-r ${getPlanColor(user.plan)} text-white`}>
              {user.plan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
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

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                value={user.email}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <Button 
            onClick={handleSave}
            disabled={loading || displayName === user.displayName}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Messages Used</span>
              <span className="font-medium">
                {user.messageCount}/{user.maxMessages === -1 ? '∞' : user.maxMessages}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: user.maxMessages === -1 ? '100%' : `${Math.min((user.messageCount / user.maxMessages) * 100, 100)}%` 
                }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {user.maxMessages === -1 
                ? 'Unlimited messages with Pro plan' 
                : `${user.maxMessages - user.messageCount} messages remaining this month`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}