# Figma Gemini Voice Editor

A real-time Figma editor that uses Google's Gemini Live API to process voice commands and make instant changes to your designs through the Figma Plugin API.

## Features

- **Voice-to-Design**: Speak naturally to create, modify, and style Figma elements
- **Real-time Updates**: Changes appear instantly in your Figma file
- **Gemini Live API**: Leverages Google's latest multimodal AI for context-aware command processing
- **WebSocket Communication**: Low-latency connection between server and Figma plugin
- **Text Commands**: Also supports text-based commands for flexibility
- **Smart Context**: Gemini understands your design context for better command interpretation

## Architecture

```
┌─────────────────┐      WebSocket      ┌──────────────────┐
│  Figma Plugin   │ ←─────────────────→ │  Node.js Server  │
│   (UI + API)    │                      │   (Express+WS)   │
└─────────────────┘                      └──────────────────┘
                                                  │
                                                  ├→ Gemini Live API
                                                  └→ Figma REST API
```

## Prerequisites

- Node.js 18+ and npm
- Figma Desktop App
- Figma Personal Access Token ([Get it here](https://www.figma.com/developers/api#authentication))
- Google Gemini API Key ([Get it here](https://ai.google.dev/))
- A Figma file to work with

## Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Configure your `.env` file:
```env
# Get from: https://www.figma.com/developers/api#authentication
FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN_HERE

# From your Figma file URL: figma.com/file/FILE_KEY/...
FIGMA_FILE_KEY=YOUR_FILE_KEY

# Get from: https://ai.google.dev/
GEMINI_API_KEY=YOUR_GEMINI_KEY

# Server configuration
PORT=3000
WS_PORT=8080
```

## Getting Your API Keys

### Figma Access Token
1. Go to your [Figma Settings](https://www.figma.com/settings)
2. Scroll to "Personal access tokens"
3. Click "Generate new token"
4. Copy the token (it won't be shown again!)

### Figma File Key
1. Open your Figma file in the browser
2. Look at the URL: `https://www.figma.com/file/ABC123DEF456/My-Design`
3. The file key is `ABC123DEF456`

### Gemini API Key
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create or select a project
4. Copy your API key

## Usage

### 1. Build the Project

```bash
npm run build
```

This compiles TypeScript and bundles the Figma plugin code.

### 2. Start the Server

```bash
npm run dev
```

You should see:
```
✓ Successfully connected to Figma
  File: Your Design File
  Nodes: 42

===========================================
Figma Gemini Voice Editor Server Running
===========================================
HTTP API: http://localhost:3000
WebSocket: ws://localhost:8080
```

### 3. Install the Figma Plugin

1. Open Figma Desktop App
2. Open your design file (the one matching your `FIGMA_FILE_KEY`)
3. Go to **Plugins → Development → Import plugin from manifest...**
4. Navigate to `dist/plugin/` and select `manifest.json`
5. Run the plugin: **Plugins → Development → Gemini Voice Editor**

### 4. Start Using Voice Commands

The plugin UI will appear. Once connected (green indicator), you can:

**Voice Commands:**
- Hold the "Hold to Speak" button
- Speak your command naturally
- Release when done

**Text Commands:**
- Type in the text input field
- Press Enter or click "Send Command"

## Example Commands

### Creating Elements
- "Create a blue rectangle 200 by 100 pixels"
- "Add a red circle"
- "Make a text that says Welcome"
- "Create a frame for the header"

### Modifying Elements
- "Make the header text bigger"
- "Change the button color to green"
- "Increase the opacity of the background"
- "Rename the card to user profile"

### Styling
- "Change the background to dark blue"
- "Make the button corners rounded"
- "Add a shadow to the card"

### Moving & Resizing
- "Move the login button to the right"
- "Make the sidebar wider"
- "Resize the logo to 50 by 50"

### Deleting
- "Delete the footer"
- "Remove the placeholder text"

## API Endpoints

The server exposes the following REST API endpoints:

### `GET /health`
Check server status
```bash
curl http://localhost:3000/health
```

### `GET /api/figma/file`
Get Figma file metadata
```bash
curl http://localhost:3000/api/figma/file
```

### `GET /api/figma/search?query=button`
Search for nodes by name
```bash
curl http://localhost:3000/api/figma/search?query=button
```

### `POST /api/command/text`
Process a text command
```bash
curl -X POST http://localhost:3000/api/command/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Create a blue rectangle"}'
```

## Project Structure

```
figma-gemini-voice-editor/
├── src/
│   ├── config/           # Configuration and environment
│   │   └── index.ts
│   ├── services/         # Core services
│   │   ├── figma.ts      # Figma REST API client
│   │   └── gemini.ts     # Gemini Live API client
│   ├── server/           # Backend server
│   │   ├── index.ts      # Express server
│   │   └── websocket.ts  # WebSocket server
│   ├── plugin/           # Figma plugin
│   │   ├── code.ts       # Plugin logic
│   │   ├── manifest.json # Plugin manifest
│   │   └── ui.html       # Plugin UI
│   └── types/            # TypeScript types
│       └── index.ts
├── dist/                 # Compiled output
├── package.json
├── tsconfig.json
└── .env
```

## How It Works

1. **Voice Input**: User speaks or types a command in the Figma plugin UI
2. **WebSocket**: Command is sent to the Node.js server via WebSocket
3. **Gemini Processing**: Server sends to Gemini Live API for natural language understanding
4. **Command Parsing**: Gemini converts voice/text to structured Figma operations
5. **Figma Context**: Server fetches current file state from Figma REST API for context
6. **Command Execution**: Server broadcasts structured command back to plugin
7. **Real-time Update**: Plugin executes command using Figma Plugin API
8. **Visual Feedback**: Changes appear instantly in Figma

## Advanced Features

### Context Awareness
Gemini receives information about your current Figma file, enabling context-aware commands like:
- "Make it bigger" (understands what "it" refers to)
- "Change the color to match the header" (knows header color)

### Command Confidence
Each command includes a confidence score. Low confidence commands may need clarification.

### Command History
The plugin UI shows a history of executed commands for easy reference and debugging.

### Suggestions
The system can suggest relevant commands based on your current design state.

## Troubleshooting

### Plugin Won't Connect
- Ensure the server is running (`npm run dev`)
- Check that WebSocket port 8080 is not blocked
- Verify Figma Desktop App has network access

### Commands Not Working
- Check server logs for errors
- Verify your Gemini API key is valid and has credits
- Ensure the Figma file key matches your open file

### "No nodes found" Error
- The plugin searches by name (fuzzy matching)
- Try being more specific with element names
- Check that the element exists in your current page

### Figma API Errors
- Verify your access token is valid
- Check token has `file_content:read` scope
- Ensure file key is correct

## Development

### Watch Mode
Development with auto-reload:
```bash
npm run dev
```

### Plugin Watch Mode
Auto-rebuild plugin on changes:
```bash
npm run plugin:watch
```

### Build for Production
```bash
npm run build
npm start
```

## Limitations

- Requires Figma Desktop App (Web version doesn't support plugins with network access)
- Voice commands need clear audio for best results
- Some complex design operations may require multiple commands
- Color parsing supports common color names and will be enhanced with hex/RGB support

## Future Enhancements

- [ ] Gemini Live API streaming for real-time voice interaction
- [ ] Multi-modal input (screen sharing, images)
- [ ] Batch operations (apply command to multiple elements)
- [ ] Design pattern recognition and suggestions
- [ ] Undo/redo voice command history
- [ ] Custom voice command templates
- [ ] Team collaboration features
- [ ] Plugin marketplace distribution

## Security Notes

- Never commit your `.env` file
- Keep API keys secure and rotate regularly
- Use environment-specific configurations for production
- Figma access tokens have full access to your files - protect them

## Contributing

Contributions are welcome! Please ensure:
- TypeScript types are properly defined
- Code follows existing patterns
- Error handling is comprehensive
- Documentation is updated

## License

MIT License - feel free to use this project as a starting point for your own Figma automation tools!

## Resources

- [Figma Plugin API Docs](https://www.figma.com/plugin-docs/)
- [Figma REST API Docs](https://www.figma.com/developers/api)
- [Gemini Live API Docs](https://ai.google.dev/gemini-api/docs/live)
- [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai)

## Support

For issues and questions:
- Check the troubleshooting section above
- Review server logs for error messages
- Ensure all prerequisites are met
- Verify API keys and configuration

---

Built with Figma Plugin API, Gemini Live API, WebSockets, and TypeScript.
