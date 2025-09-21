import { TestVoiceAssistant } from "@/components/test-voice-assistant";

export default function TestVoiceAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Voice Assistant Demo</h1>
        <TestVoiceAssistant />
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Make sure to allow microphone access when prompted.</p>
          <p>The voice assistant supports multiple languages and will navigate based on your commands.</p>
        </div>
      </div>
    </div>
  );
}