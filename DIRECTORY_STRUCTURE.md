# Project Directory Structure

```
figma-gemini-voice-editor/
│
├── 📄 README.md                          # Main documentation (9,800+ words)
├── 📄 QUICKSTART.md                      # 5-minute setup guide
├── 📄 ARCHITECTURE.md                    # System architecture & design
├── 📄 CONTRIBUTING.md                    # Development & contribution guide
├── 📄 PROJECT_SUMMARY.md                 # Complete project overview
├── 📄 DIRECTORY_STRUCTURE.md             # This file
│
├── 📦 package.json                       # NPM dependencies & scripts
├── 📦 tsconfig.json                      # TypeScript compiler config
├── 📄 .env.example                       # Environment variables template
├── 📄 .env.sample                        # Detailed env configuration guide
├── 📄 .gitignore                         # Git exclusions
│
├── 📁 src/                               # Source code
│   │
│   ├── 📁 config/                        # Configuration management
│   │   └── 📄 index.ts                   # Config loader & validator
│   │
│   ├── 📁 types/                         # TypeScript type definitions
│   │   └── 📄 index.ts                   # Shared types & interfaces
│   │
│   ├── 📁 services/                      # External service integrations
│   │   ├── 📄 figma.ts                   # Figma REST API client
│   │   │                                 # - File reading
│   │   │                                 # - Node searching
│   │   │                                 # - Metadata retrieval
│   │   │
│   │   └── 📄 gemini.ts                  # Gemini Live API client
│   │                                     # - Voice processing
│   │                                     # - Text processing
│   │                                     # - Context-aware suggestions
│   │
│   ├── 📁 server/                        # Backend server
│   │   ├── 📄 index.ts                   # Express HTTP server
│   │   │                                 # - REST API endpoints
│   │   │                                 # - Health checks
│   │   │                                 # - Startup validation
│   │   │
│   │   └── 📄 websocket.ts               # WebSocket server
│   │                                     # - Client management
│   │                                     # - Message routing
│   │                                     # - Command broadcasting
│   │
│   └── 📁 plugin/                        # Figma plugin
│       ├── 📄 code.ts                    # Plugin logic (1,000+ lines)
│       │                                 # - WebSocket client
│       │                                 # - Command execution
│       │                                 # - Node manipulation
│       │                                 # - Figma API integration
│       │
│       ├── 📄 manifest.json              # Plugin configuration
│       │                                 # - Name, version, API level
│       │                                 # - Network permissions
│       │                                 # - UI configuration
│       │
│       └── 📄 ui.html                    # Plugin user interface
│                                         # - Voice recording UI
│                                         # - Text input
│                                         # - Command history
│                                         # - Status indicators
│
├── 📁 dist/                              # Compiled output (generated)
│   ├── 📁 config/                        # Compiled config
│   ├── 📁 types/                         # Compiled types
│   ├── 📁 services/                      # Compiled services
│   ├── 📁 server/                        # Compiled server
│   └── 📁 plugin/                        # Bundled plugin
│       ├── 📄 code.js                    # Bundled plugin code
│       ├── 📄 manifest.json              # Plugin manifest (copied)
│       └── 📄 ui.html                    # Plugin UI (copied)
│
├── 📁 scripts/                           # Utility scripts
│   ├── 🔧 setup.sh                       # Automated setup script
│   │                                     # - Dependency installation
│   │                                     # - Environment setup
│   │                                     # - Project build
│   │
│   └── 🔧 test-connection.sh             # API connection testing
│                                         # - Figma API test
│                                         # - Gemini API test
│                                         # - Server health check
│
└── 📁 examples/                          # Usage examples
    └── 📄 commands.md                    # 100+ example commands
                                          # - Simple creation
                                          # - Styled elements
                                          # - Modifications
                                          # - Advanced operations


Generated at runtime:
├── 📁 node_modules/                      # NPM dependencies (git ignored)
└── 📄 .env                               # Environment variables (git ignored)
```

## File Purposes

### Documentation Files

| File | Purpose | Size |
|------|---------|------|
| README.md | Complete user & developer guide | ~9,800 words |
| QUICKSTART.md | Fast 5-minute setup guide | ~1,800 words |
| ARCHITECTURE.md | System design & architecture | ~11,400 words |
| CONTRIBUTING.md | Development guidelines | ~6,600 words |
| PROJECT_SUMMARY.md | Project overview | ~2,500 words |
| examples/commands.md | Usage examples | ~5,000 words |

### Source Files

| File | Lines | Purpose |
|------|-------|---------|
| src/config/index.ts | ~50 | Configuration management |
| src/types/index.ts | ~40 | Type definitions |
| src/services/figma.ts | ~100 | Figma API integration |
| src/services/gemini.ts | ~200 | Gemini API integration |
| src/server/index.ts | ~150 | Express server |
| src/server/websocket.ts | ~120 | WebSocket server |
| src/plugin/code.ts | ~400 | Figma plugin logic |
| src/plugin/ui.html | ~250 | Plugin UI |

### Configuration Files

| File | Purpose |
|------|---------|
| package.json | NPM dependencies & scripts |
| tsconfig.json | TypeScript compiler settings |
| .env.example | Environment template |
| .env.sample | Detailed env guide |
| .gitignore | Git exclusions |
| manifest.json | Figma plugin config |

### Build Artifacts (Generated)

| Path | Purpose |
|------|---------|
| dist/ | Compiled TypeScript output |
| dist/plugin/ | Bundled plugin for Figma |
| node_modules/ | NPM dependencies |

## Key Directories

### `/src` - Source Code
All TypeScript source code organized by concern:
- **config**: Environment & settings
- **types**: Shared TypeScript types
- **services**: External API clients
- **server**: Backend HTTP & WebSocket servers
- **plugin**: Figma plugin code

### `/dist` - Compiled Output
Generated by `npm run build`:
- Transpiled JavaScript from TypeScript
- Bundled plugin code (via esbuild)
- Ready for production deployment

### `/scripts` - Utility Scripts
Shell scripts for automation:
- `setup.sh`: One-command project setup
- `test-connection.sh`: Validate API connections

### `/examples` - Usage Examples
User-facing documentation:
- `commands.md`: 100+ example voice commands

## File Naming Conventions

- **TypeScript**: `kebab-case.ts`
- **Documentation**: `SCREAMING_CAPS.md`
- **Scripts**: `kebab-case.sh`
- **Config**: Lowercase (package.json, tsconfig.json)

## Import Paths

TypeScript uses ESM with `.js` extensions:
```typescript
// Correct
import { config } from '../config/index.js';

// Incorrect
import { config } from '../config/index.ts';
import { config } from '../config';
```

## Build Process

```
Source (.ts) → TypeScript Compiler → JavaScript (.js)
                                          ↓
                                      dist/

Plugin (.ts) → esbuild → Bundled (.js)
                             ↓
                         dist/plugin/
```

## Git Tracking

**Tracked:**
- All source files (`src/`)
- Documentation files
- Configuration files
- Scripts

**Ignored:**
- `node_modules/`
- `dist/`
- `.env`
- `*.log`
- `.DS_Store`

## NPM Scripts

```bash
npm run dev           # Start dev server (auto-restart)
npm run build         # Build entire project
npm run build:plugin  # Build plugin only
npm start             # Start production server
npm run plugin:watch  # Watch plugin for changes
```

## Entry Points

**Server:**
- Development: `src/server/index.ts` (via tsx)
- Production: `dist/server/index.js` (via node)

**Plugin:**
- Source: `src/plugin/code.ts`
- Compiled: `dist/plugin/code.js`
- UI: `dist/plugin/ui.html`

## Environment Variables

Required in `.env`:
```
FIGMA_ACCESS_TOKEN    # Figma API authentication
FIGMA_FILE_KEY        # Target Figma file
GEMINI_API_KEY        # Google Gemini API key
PORT                  # HTTP server port (default: 3000)
WS_PORT              # WebSocket port (default: 8080)
```
