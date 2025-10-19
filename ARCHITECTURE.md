# Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Voice / Text    │
                    └─────────┬─────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────────┐
│                      FIGMA PLUGIN (UI)                             │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  • Voice recording (MediaRecorder API)                    │    │
│  │  • Text input field                                       │    │
│  │  • Command history display                                │    │
│  │  • Connection status indicator                            │    │
│  │  • Suggestion chips                                       │    │
│  └──────────────────────────────────────────────────────────┘    │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                    WebSocket Connection
                    (ws://localhost:8080)
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                    NODE.JS SERVER                                  │
│  ┌────────────────────────────────────────────────────────┐      │
│  │              WebSocket Server (ws)                      │      │
│  │  • Receives voice/text commands                         │      │
│  │  • Broadcasts Figma commands to plugin                  │      │
│  │  • Manages client connections                           │      │
│  └────────────────┬──────────────────┬────────────────────┘      │
│                   │                  │                            │
│  ┌────────────────▼──────────┐  ┌───▼────────────────────┐      │
│  │   Express REST API        │  │  Service Layer          │      │
│  │  • /health                │  │  • FigmaService         │      │
│  │  • /api/figma/file        │  │  • GeminiService        │      │
│  │  • /api/figma/search      │  │                         │      │
│  │  • /api/command/text      │  │                         │      │
│  │  • /api/suggestions       │  │                         │      │
│  └───────────────────────────┘  └─────────────────────────┘      │
└───────────────┬──────────────────────────┬────────────────────────┘
                │                          │
    ┌───────────▼──────────┐   ┌──────────▼─────────┐
    │   Figma REST API     │   │  Gemini Live API   │
    │  (api.figma.com)     │   │  (generativeai)    │
    │                      │   │                    │
    │  • GET /files/:key   │   │  • Text → Command  │
    │  • GET /nodes        │   │  • Voice → Command │
    │  • GET /images       │   │  • Context aware   │
    └──────────────────────┘   └────────────────────┘
                │                          │
    ┌───────────▼──────────┐   ┌──────────▼─────────┐
    │  Returns to Server   │   │  Returns to Server │
    │  (File data, nodes)  │   │  (Parsed commands) │
    └──────────────────────┘   └────────────────────┘
                │                          │
                └──────────┬───────────────┘
                           │
            ┌──────────────▼────────────────┐
            │  Command sent back to plugin  │
            │  via WebSocket                │
            └──────────────┬────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────────┐
│                  FIGMA PLUGIN (Code)                               │
│  ┌────────────────────────────────────────────────────────┐      │
│  │         Figma Plugin API Execution                      │      │
│  │  • figma.createRectangle()                              │      │
│  │  • figma.createText()                                   │      │
│  │  • node.resize()                                        │      │
│  │  • node.fills = [...]                                   │      │
│  │  • node.remove()                                        │      │
│  └────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   FIGMA CANVAS         │
              │  (Real-time updates)   │
              └────────────────────────┘
```

## Data Flow

### Voice Command Flow

1. **User speaks** → Plugin UI captures audio via MediaRecorder
2. **Audio encoding** → Convert to base64 WAV format
3. **WebSocket send** → `{ type: 'voice-command', data: { audio: base64 } }`
4. **Server receives** → WebSocket server handles message
5. **Gemini processing** → Send to Gemini Live API with context
6. **Command parsing** → Gemini returns structured command:
   ```json
   {
     "command": {
       "type": "create",
       "target": "rectangle",
       "properties": { "width": 200, "height": 100, "fills": [...] }
     },
     "confidence": 0.95
   }
   ```
7. **Broadcast** → Server sends to all connected plugin instances
8. **Plugin execution** → Plugin calls Figma API to create/modify
9. **Visual update** → User sees changes in real-time

### Text Command Flow

1. **User types** → Plugin UI text input
2. **WebSocket send** → `{ type: 'voice-command', data: { text: "..." } }`
3. **Context fetch** → Server gets current Figma file state
4. **Gemini processing** → Process with Figma context
5. **Command execution** → Same as steps 6-9 above

## Technology Stack

### Frontend (Figma Plugin UI)
- **HTML/CSS/JavaScript** - Plugin interface
- **WebSocket API** - Real-time communication
- **MediaRecorder API** - Voice recording
- **Figma Plugin Typings** - Type safety

### Backend (Node.js Server)
- **TypeScript** - Type-safe development
- **Express** - REST API server
- **ws** - WebSocket server
- **axios** - HTTP client for Figma API
- **@google/generative-ai** - Gemini SDK

### Plugin (Figma)
- **Figma Plugin API** - Design manipulation
- **WebSocket Client** - Server connection
- **TypeScript** - Plugin code

### External APIs
- **Figma REST API** - Read file data
- **Gemini Live API** - NLP and voice processing

## Security Considerations

1. **API Keys**: Stored server-side in .env, never exposed to client
2. **WebSocket**: Local connection only (localhost)
3. **Access Tokens**: Figma tokens have full file access - protect carefully
4. **Network Access**: Plugin requires network permission for WebSocket

## Scalability

### Current Architecture
- Single server instance
- Local WebSocket connection
- Direct Figma API calls

### Future Enhancements
- Redis for session management
- Message queue for command processing
- Load balancing for multiple instances
- Cloud deployment with secure WebSocket tunneling
- Rate limiting and request throttling

## Error Handling

```
User Command
     │
     ├─ Voice Recording Failed
     │  └─> Show microphone permission error
     │
     ├─ WebSocket Disconnected
     │  └─> Auto-reconnect with exponential backoff
     │
     ├─ Gemini API Error
     │  └─> Log error, show user-friendly message
     │
     ├─ Figma API Error
     │  └─> Validate token, check file access
     │
     └─ Plugin Execution Error
        └─> Show in command history, log details
```

## Performance Optimization

1. **Caching**: Figma file data cached for context
2. **Debouncing**: Text input debounced before sending
3. **Compression**: WebSocket messages use JSON (could add compression)
4. **Lazy Loading**: Plugin UI loads resources on demand
5. **Connection Pooling**: Reuse HTTP connections to external APIs

## Development Workflow

```
Edit Code
    │
    ├─ Server Code (src/server/*)
    │  └─> npm run dev (auto-restart)
    │
    └─ Plugin Code (src/plugin/*)
       └─> npm run plugin:watch (auto-rebuild)

Deploy to Figma
    │
    └─> Import manifest from dist/plugin/
```
