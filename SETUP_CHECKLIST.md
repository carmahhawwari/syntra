# Setup Checklist

Use this checklist to ensure everything is properly configured and working.

## ✅ Pre-Installation

- [ ] Node.js 18 or higher installed
  ```bash
  node -v  # Should show v18.x.x or higher
  ```
- [ ] npm installed
  ```bash
  npm -v  # Should show version number
  ```
- [ ] Figma Desktop App installed (not just web browser)
- [ ] Git installed (optional, for version control)

## ✅ Dependencies

- [ ] Dependencies installed
  ```bash
  npm install
  # Should complete without errors
  ```
- [ ] `node_modules/` folder exists
- [ ] No error messages in terminal

## ✅ API Keys Obtained

### Figma
- [ ] Personal Access Token created
  - Visit: https://www.figma.com/developers/api#authentication
  - Settings → Personal access tokens → Generate new token
  - Token saved securely

- [ ] File Key identified
  - From URL: `figma.com/file/YOUR_KEY_HERE/...`
  - File Key copied

### Gemini
- [ ] Gemini API Key obtained
  - Visit: https://ai.google.dev/
  - Created or selected project
  - API key generated and copied

## ✅ Configuration

- [ ] `.env` file exists (copied from `.env.example`)
  ```bash
  ls -la .env  # Should show file
  ```

- [ ] `.env` contains all required keys:
  ```bash
  cat .env | grep -E "FIGMA_ACCESS_TOKEN|FIGMA_FILE_KEY|GEMINI_API_KEY"
  ```

- [ ] No template values remain in `.env`
  - ❌ `FIGMA_ACCESS_TOKEN=your_token_here`
  - ✅ `FIGMA_ACCESS_TOKEN=figd_abc123...`

- [ ] API keys have no quotes or extra spaces
  ```env
  # ✅ Correct
  FIGMA_ACCESS_TOKEN=figd_abc123def456

  # ❌ Wrong
  FIGMA_ACCESS_TOKEN="figd_abc123def456"
  FIGMA_ACCESS_TOKEN= figd_abc123def456
  ```

## ✅ Build Process

- [ ] Project builds successfully
  ```bash
  npm run build
  # Should complete without errors
  ```

- [ ] `dist/` folder created
  ```bash
  ls -la dist/
  ```

- [ ] Plugin files exist:
  - [ ] `dist/plugin/code.js`
  - [ ] `dist/plugin/manifest.json`
  - [ ] `dist/plugin/ui.html`

## ✅ API Connections

### Test Figma API
- [ ] Figma API accessible
  ```bash
  ./scripts/test-connection.sh
  # Or manually:
  curl -H "X-Figma-Token: YOUR_TOKEN" \
    "https://api.figma.com/v1/files/YOUR_FILE_KEY"
  ```
  - Should return HTTP 200
  - Should show file data (not error)

### Test Gemini API
- [ ] Gemini API accessible
  ```bash
  ./scripts/test-connection.sh
  # Check for "✓ Gemini API connection successful"
  ```

## ✅ Server Startup

- [ ] Server starts without errors
  ```bash
  npm run dev
  ```

- [ ] Terminal shows:
  - [ ] "Validating configuration..."
  - [ ] "✓ Successfully connected to Figma"
  - [ ] "HTTP server listening on port 3000"
  - [ ] "WebSocket server listening on port 8080"
  - [ ] "Figma Gemini Voice Editor Server Running"

- [ ] No error messages in red

- [ ] Health endpoint works
  ```bash
  # In another terminal:
  curl http://localhost:3000/health
  # Should return JSON with status: "ok"
  ```

## ✅ Plugin Installation

### In Figma Desktop App

- [ ] Figma Desktop App is open
- [ ] Correct design file is open (matching `FIGMA_FILE_KEY`)
- [ ] Menu: Plugins → Development → Import plugin from manifest...
- [ ] Navigate to project folder
- [ ] Select `dist/plugin/manifest.json`
- [ ] No error message appears
- [ ] Plugin appears in: Plugins → Development → Gemini Voice Editor

## ✅ Plugin Connection

### When Plugin Runs

- [ ] Plugin UI appears (400x600 window)
- [ ] UI shows "Gemini Voice Editor" header
- [ ] Connection indicator turns green
- [ ] Status shows "Connected"
- [ ] No error messages in plugin UI
- [ ] Server terminal shows: "New client connected"

### If Connection Fails

Try these:
- [ ] Server is running in terminal
- [ ] No firewall blocking port 8080
- [ ] Restart plugin (Plugins menu → Reload)
- [ ] Check server terminal for errors

## ✅ Functionality Tests

### Test 1: Text Command (Simple)
- [ ] Type in plugin: `Create a blue rectangle`
- [ ] Press Enter or click "Send Command"
- [ ] Rectangle appears in Figma canvas
- [ ] Rectangle is blue
- [ ] Command appears in history (green checkmark)
- [ ] No error in plugin UI

### Test 2: Text Command (Detailed)
- [ ] Type: `Create a red circle 100 by 100 pixels`
- [ ] Press Enter
- [ ] Circle appears
- [ ] Circle is red
- [ ] Circle is approximately 100x100
- [ ] Success in history

### Test 3: Modification
- [ ] Type: `Make it green`
- [ ] Press Enter
- [ ] Previously created element turns green
- [ ] Success in history

### Test 4: Voice Command
- [ ] Click and hold "Hold to Speak" button
- [ ] Button shows "Recording..."
- [ ] Button has recording animation
- [ ] Speak clearly: "Create a yellow square"
- [ ] Release button
- [ ] Wait 1-2 seconds
- [ ] Square appears
- [ ] Square is yellow
- [ ] Success in history

### Test 5: Error Handling
- [ ] Type: `Delete the nonexistent element`
- [ ] Press Enter
- [ ] Error message appears in history (red)
- [ ] Error is clear and helpful
- [ ] Plugin still works after error

## ✅ Server Logs

### Terminal Should Show:

```
✓ Successfully connected to Figma
  File: Your Design File Name
  Nodes: [some number]

===========================================
Figma Gemini Voice Editor Server Running
===========================================
HTTP API: http://localhost:3000
WebSocket: ws://localhost:8080

Next steps:
[instructions...]
===========================================
```

### When Commands Execute:

```
Received message: voice-command
Processing text command: Create a blue rectangle
Gemini response: { command: {...}, confidence: 0.95 }
```

## ✅ Common Issues Resolution

### "Failed to fetch Figma file"
- [ ] Verify `FIGMA_ACCESS_TOKEN` is correct
- [ ] Verify `FIGMA_FILE_KEY` is correct
- [ ] Check token has `file_content:read` scope
- [ ] Confirm file exists and you have access

### "Failed to process voice command"
- [ ] Verify `GEMINI_API_KEY` is correct
- [ ] Check Gemini API quota/billing
- [ ] Try text command instead to isolate issue

### "Plugin won't connect"
- [ ] Server is running (`npm run dev`)
- [ ] Port 8080 is not blocked
- [ ] Using Figma Desktop (not web)
- [ ] Try restarting both server and plugin

### "No nodes found matching"
- [ ] Element name is correct
- [ ] Element exists in current page
- [ ] Try being more specific with name
- [ ] Check Figma layer panel for actual names

## ✅ Development Environment

### For Development Work

- [ ] TypeScript compiles without errors
  ```bash
  npx tsc --noEmit
  ```

- [ ] Watch mode works
  ```bash
  npm run plugin:watch  # In one terminal
  npm run dev           # In another
  ```

- [ ] Hot reload works
  - Change server code → auto-restarts
  - Change plugin code → rebuild + reload in Figma

## ✅ Documentation Review

- [ ] Read [START_HERE.md](START_HERE.md)
- [ ] Reviewed [QUICKSTART.md](QUICKSTART.md)
- [ ] Skimmed [README.md](README.md)
- [ ] Checked [examples/commands.md](examples/commands.md)
- [ ] Understand basic architecture

## ✅ Ready for Use!

If all items above are checked, you're ready to go! 🎉

### Recommended Next Steps:

1. **Try more commands** from [examples/commands.md](examples/commands.md)
2. **Experiment** with your own commands
3. **Read** [README.md](README.md) for full capabilities
4. **Explore** the codebase in `src/`

### Advanced Users:

1. Review [ARCHITECTURE.md](ARCHITECTURE.md)
2. Check [CONTRIBUTING.md](CONTRIBUTING.md)
3. Customize and extend the system

## 🆘 Still Having Issues?

1. **Check server logs** - Most errors appear here
2. **Try test script** - Run `./scripts/test-connection.sh`
3. **Review .env** - Common source of issues
4. **Restart everything** - Server, Figma, plugin
5. **Read troubleshooting** - See README.md → Troubleshooting

## 📝 Setup Complete!

Date completed: ________________

Version: 1.0.0

Notes:
______________________________________
______________________________________
______________________________________

Happy designing with voice! 🎨🎤
