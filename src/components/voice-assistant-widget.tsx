'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2, Bot } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function VoiceAssistantWidget() {
  const [isListening, setIsListening] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setIsVisible(true)
    }
  }

  const closeWidget = () => {
    setIsVisible(false)
    setIsListening(false)
  }

  return (
    <>
      {/* Floating Voice Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleListening}
          size="lg"
          className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 relative ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 hover:from-green-600 hover:via-lime-600 hover:to-yellow-600'
          }`}
        >
          <div className="relative">
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            <Bot className="h-3 w-3 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 text-green-600" />
          </div>
        </Button>
      </div>

      {/* Voice Assistant Widget */}
      {isVisible && (
        <div className="fixed bottom-24 right-6 z-50 w-80">
          <Card className="p-4 shadow-xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Bot className="h-5 w-5 text-green-600" />
                  <Volume2 className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-semibold text-green-800">🤖 Voice Assistant</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeWidget}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-2">
              {isListening ? (
                <div className="text-center py-4">
                  <div className="animate-pulse text-red-600 mb-2">🎤 Listening...</div>
                  <p className="text-sm text-gray-600">Speak your command</p>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-600 mb-2">Click the mic to start</p>
                  <div className="text-xs text-gray-500">
                    Try: "Show orders", "Check inventory", "Navigate to analytics"
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}