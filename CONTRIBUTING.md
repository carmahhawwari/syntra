# Contributing to Figma Gemini Voice Editor

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Figma Desktop App
- Git

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd figma-gemini-voice-editor

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Build the project
npm run build

# Start development server
npm run dev
```

## Project Structure

```
src/
├── config/          # Configuration and environment variables
├── services/        # External service integrations (Figma, Gemini)
├── server/          # Backend server (Express, WebSocket)
├── plugin/          # Figma plugin code
└── types/           # TypeScript type definitions
```

## Development Workflow

### Running in Development Mode

**Server (with auto-restart):**
```bash
npm run dev
```

**Plugin (with auto-rebuild):**
```bash
npm run plugin:watch
```

**Both simultaneously:**
Open two terminal windows and run one command in each.

### Testing Your Changes

1. **Server changes**: The dev server auto-restarts
2. **Plugin changes**: Reload the plugin in Figma
   - Plugins → Development → Gemini Voice Editor → Reload

### Building for Production
```bash
npm run build
npm start
```

## Code Style

### TypeScript
- Use explicit types when possible
- Avoid `any` - prefer `unknown` or specific types
- Use async/await over Promises
- Add JSDoc comments for public functions

**Example:**
```typescript
/**
 * Process a voice command and convert to Figma operation
 * @param audioData - Base64 encoded audio or ArrayBuffer
 * @param context - Optional Figma file context
 * @returns Parsed command with confidence score
 */
async processVoiceCommand(
  audioData: string | ArrayBuffer,
  context?: string
): Promise<GeminiResponse> {
  // Implementation
}
```

### Naming Conventions
- **Files**: kebab-case (`figma-service.ts`)
- **Classes**: PascalCase (`FigmaService`)
- **Functions**: camelCase (`processCommand`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Interfaces**: PascalCase (`VoiceCommand`)

### Error Handling
Always handle errors gracefully:

```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error: any) {
  console.error('Error in riskyOperation:', error);
  throw new Error(`Failed to complete operation: ${error.message}`);
}
```

## Adding New Features

### 1. Voice Command Types

To add a new command type:

**Update types (`src/types/index.ts`):**
```typescript
export interface VoiceCommand {
  type: 'create' | 'modify' | 'delete' | 'style' | 'move' | 'resize' | 'YOUR_NEW_TYPE';
  // ...
}
```

**Update Gemini service (`src/services/gemini.ts`):**
Add the new type to the system prompt with examples.

**Update plugin handler (`src/plugin/code.ts`):**
```typescript
case 'YOUR_NEW_TYPE':
  await handleYourNewType(target, properties);
  break;
```

### 2. Figma API Features

To add new Figma API integration:

**Add to FigmaService (`src/services/figma.ts`):**
```typescript
async yourNewMethod(): Promise<ReturnType> {
  try {
    const response = await this.client.get('/your-endpoint');
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to execute: ${error.message}`);
  }
}
```

### 3. WebSocket Messages

To add new WebSocket message types:

**Update server handler (`src/server/websocket.ts`):**
```typescript
switch (message.type) {
  case 'your-message-type':
    await this.handleYourMessage(ws, message.data);
    break;
}
```

**Update plugin handler (`src/plugin/code.ts`):**
```typescript
switch (message.type) {
  case 'your-message-type':
    await handleYourMessage(message.data);
    break;
}
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Server starts without errors
- [ ] Plugin connects to server
- [ ] Voice commands work
- [ ] Text commands work
- [ ] Commands execute in Figma
- [ ] Error messages are clear
- [ ] No console errors

### Testing with Different Commands

Test at least these scenarios:
1. Simple creation: "Create a blue rectangle"
2. Modification: "Make it bigger"
3. Deletion: "Delete the button"
4. Complex: "Create a blue button 150 by 50 with rounded corners"
5. Error case: "Delete nonexistent element"

## Documentation

When adding features, update:

- [ ] README.md (if user-facing)
- [ ] ARCHITECTURE.md (if structural changes)
- [ ] examples/commands.md (if new command types)
- [ ] JSDoc comments in code
- [ ] Type definitions

## Pull Request Process

### Before Submitting

1. **Test thoroughly**: All functionality should work
2. **Build succeeds**: `npm run build` completes without errors
3. **TypeScript compiles**: No type errors
4. **Code is formatted**: Follow project style
5. **Documentation updated**: Relevant docs reflect changes

### PR Title Format
```
[Type] Brief description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- refactor: Code refactoring
- perf: Performance improvement
- test: Adding tests
- chore: Maintenance tasks
```

**Examples:**
- `feat: Add gradient fill support for shapes`
- `fix: Handle missing node gracefully`
- `docs: Update command examples`

### PR Description Template
```markdown
## What
Brief description of what this PR does

## Why
Why is this change needed?

## How
How does this implementation work?

## Testing
- [ ] Tested locally
- [ ] All commands work
- [ ] No console errors
- [ ] Documentation updated

## Screenshots
(if applicable)
```

## Common Issues

### Plugin Won't Connect
- Ensure server is running
- Check WebSocket port (default: 8080)
- Verify Figma has network access

### TypeScript Errors
- Run `npm install` to update types
- Check tsconfig.json settings
- Ensure all imports have proper extensions (.js)

### Build Failures
- Clear dist folder: `rm -rf dist`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

## Feature Requests

Have an idea? Open an issue with:
- **Use case**: What problem does it solve?
- **Proposed solution**: How should it work?
- **Alternatives**: What else did you consider?
- **Examples**: Show example commands or usage

## Questions?

- Check existing issues
- Review documentation
- Ask in discussions

## Code of Conduct

- Be respectful and constructive
- Focus on the code, not the person
- Help others learn and grow
- Celebrate contributions

Thank you for contributing!
