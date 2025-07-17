import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Crown, Zap, Code, Sparkles } from 'lucide-react'

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: string
}

export function PricingModal({ open, onOpenChange, currentPlan }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out Whelp.ai',
      features: [
        '50 messages per month',
        'Basic AI responses',
        'Chat history (7 days)',
        'Community support',
        'Standard response time'
      ],
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-gray-400 to-gray-600',
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19',
      period: 'per month',
      description: 'Great for regular users',
      features: [
        '500 messages per month',
        'Advanced AI responses',
        'Unlimited chat history',
        'Priority support',
        'Faster response time',
        'Custom chat themes',
        'Export conversations'
      ],
      icon: <Zap className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49',
      period: 'per month',
      description: 'For power users and developers',
      features: [
        'Unlimited messages',
        'Premium AI models',
        'Developer badge',
        'AI training tools',
        'Custom knowledge base',
        'API access',
        'White-label options',
        'Dedicated support',
        'Advanced analytics'
      ],
      icon: <Crown className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      popular: false
    }
  ]

  const handleUpgrade = async (planId: string) => {
    setLoading(planId)
    // Simulate payment processing
    setTimeout(() => {
      setLoading(null)
      onOpenChange(false)
      // In a real app, this would handle the actual upgrade
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-xl">
                Choose Your Plan
              </span>
            </div>
            <p className="text-sm text-gray-500 font-normal">
              Unlock the full potential of AI-powered conversations
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'ring-2 ring-indigo-500 shadow-lg' : ''} ${
                currentPlan === plan.id ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white mb-3`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {currentPlan === plan.id ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loading !== null}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                    }`}
                  >
                    {loading === plan.id ? 'Processing...' : 
                     plan.id === 'free' ? 'Downgrade' : 'Upgrade to ' + plan.name}
                  </Button>
                )}

                {plan.id === 'pro' && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Code className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Developer Features</span>
                    </div>
                    <p className="text-xs text-purple-700">
                      Train custom AI models, upload knowledge bases, and access advanced developer tools.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            All plans include secure data handling and 99.9% uptime guarantee.
            <br />
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}