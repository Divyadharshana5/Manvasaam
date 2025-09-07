'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Volume2 } from 'lucide-react'
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
          className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600'
          }`}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
      </div>

      {/* Voice Assistant Widget */}
      {isVisible && (
        <div className="fixed bottom-24 right-6 z-50 w-80">
          <Card className="p-4 shadow-xl border-2 border-green-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Voice Assistant</span>
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