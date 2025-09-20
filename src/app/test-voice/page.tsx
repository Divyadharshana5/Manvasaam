import { TestVoiceNavigation } from "@/components/test-voice-navigation";

export default function TestVoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Voice Assistant Testing</h1>
        <TestVoiceNavigation />
      </div>
    </div>
  );
}