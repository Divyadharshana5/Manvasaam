# Voice Assistant Implementation

## Overview
The voice assistant provides instant voice navigation throughout the Manvaasam application. Users can click the microphone button and speak commands to navigate to different pages.

## Features
- **Instant Voice Capture**: Immediately starts recording when the voice button is clicked
- **AI-Powered Navigation**: Uses Gemini API for intelligent command understanding
- **Multilingual Support**: Responds in the user's selected language
- **Fallback Navigation**: Keyword-based navigation when AI processing fails
- **WhatsApp-like UX**: Similar to voice message recording in messaging apps

## Components

### 1. InstantVoiceAssistant (`src/components/instant-voice-assistant.tsx`)
- Main voice assistant component
- Handles voice recording, processing, and navigation
- Supports different sizes (sm, md, lg)
- Provides visual feedback during recording and processing

### 2. GlobalVoiceAssistant (`src/components/global-voice-assistant.tsx`)
- Wrapper component for global placement
- Positions the voice button based on current page
- Hides on login/register pages

### 3. API Route (`src/app/api/voice-navigation/route.ts`)
- Server-side voice processing
- Handles speech-to-text conversion
- Processes navigation intent using Gemini AI
- Returns navigation results

## Usage

### Basic Implementation
```tsx
import InstantVoiceAssistant from "@/components/instant-voice-assistant";

// Basic usage
<InstantVoiceAssistant />

// With custom size
<InstantVoiceAssistant size="lg" />

// With custom styling
<InstantVoiceAssistant 
  size="md" 
  className="shadow-lg hover:scale-105" 
/>
```

### Voice Commands
Users can say commands like:
- "Go to dashboard"
- "Open orders"
- "Show products"
- "Navigate to profile"
- "Take me to inventory"
- "Open matchmaking"
- "Go to FAQ"
- "Show marketing"

## Technical Details

### Voice Processing Flow
1. User clicks microphone button
2. Browser starts audio recording
3. Audio is converted to base64 format
4. Sent to `/api/voice-navigation` endpoint
5. Server processes with Gemini AI
6. Returns navigation intent
7. Client navigates or shows "Not Found"

### Fallback System
If AI processing fails, the system uses keyword matching:
- Extracts keywords from speech transcript
- Matches against predefined route mappings
- Navigates to closest matching page

### Language Support
- Supports all languages defined in the language context
- "Not Found" responses in user's selected language
- Speech synthesis uses appropriate language codes

### Error Handling
- Graceful fallback when microphone access is denied
- Keyword-based navigation when AI fails
- Clear user feedback for all states

## Configuration

### Environment Variables
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Supported Languages
- English, Tamil, Hindi, Malayalam, Telugu
- Kannada, Bengali, Arabic, Urdu, Sinhala

## Testing
Visit `/test-voice` to test the voice assistant functionality with example commands and usage instructions.

## Integration
The voice assistant is automatically included in the main layout and appears on all pages except login/register pages.

## Performance
- Minimal bundle impact with dynamic imports
- Server-side AI processing for better reliability
- Browser-native speech synthesis for fast responses
- Optimized audio recording with WebM format