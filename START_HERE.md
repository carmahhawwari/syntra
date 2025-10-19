# 🎯 START HERE

Welcome to **Figma Gemini Voice Editor**! This guide will get you started in under 5 minutes.

## What This Does

Talk to your Figma designs! Say things like:
- "Create a blue rectangle 200 by 100 pixels"
- "Make the header text bigger"
- "Change the button color to green"
- "Move the logo to the right"

And watch it happen in real-time! ✨

## Quick Setup (5 Minutes)

### 1. Install Dependencies (30 seconds)
```bash
npm install
```

### 2. Get API Keys (2 minutes)

#### Figma Access Token
1. Visit: https://www.figma.com/developers/api#authentication
2. Click "Generate new token"
3. Copy the token

#### Figma File Key
1. Open your Figma file in browser
2. Look at URL: `figma.com/file/ABC123/...`
3. Copy `ABC123` (your file key)

#### Gemini API Key
1. Visit: https://ai.google.dev/
2. Click "Get API Key"
3. Copy the key

### 3. Configure (30 seconds)
```bash
cp .env.example .env
```

Edit `.env` and paste your keys:
```env
FIGMA_ACCESS_TOKEN=your_figma_token_here
FIGMA_FILE_KEY=your_file_key_here
GEMINI_API_KEY=your_gemini_key_here
```

### 4. Build & Run (1 minute)
```bash
npm run build
npm run dev
```

You should see:
```
✓ Successfully connected to Figma
Figma Gemini Voice Editor Server Running
HTTP API: http://localhost:3000
WebSocket: ws://localhost:8080
```

### 5. Install Plugin in Figma (1 minute)
1. Open **Figma Desktop App** (required - web version won't work)
2. Open your design file (the one matching your file key)
3. Click **Plugins → Development → Import plugin from manifest...**
4. Navigate to `dist/plugin/` folder
5. Select `manifest.json`
6. Click **Plugins → Development → Gemini Voice Editor**

### 6. Test It! (30 seconds)

Once the plugin opens:

**Text Command (easier first test):**
1. Type: `Create a blue rectangle 200 by 100 pixels`
2. Press Enter
3. Watch the rectangle appear! 🎉

**Voice Command:**
1. Hold "Hold to Speak" button
2. Say: "Make it red"
3. Release button
4. Watch it turn red! 🔴

## Example Commands to Try

```
Create a button 150 by 50 pixels
Make it blue
Add rounded corners
Change the text to say Click Me
Make it bigger
Move it to the center
Create a circle next to it
Make the circle green
Delete the rectangle
```

## Troubleshooting

### Server won't start?
- Check your `.env` file has all three API keys
- Make sure keys are valid (no quotes, no spaces)

### Plugin won't connect?
- Make sure server is running (`npm run dev`)
- Check you're using Figma Desktop App (not web)
- Look for green "Connected" indicator in plugin

### Commands not working?
- Check the terminal for error messages
- Make sure you're in the correct Figma file
- Try simpler commands first

## What to Read Next

- **New User?** → Read [QUICKSTART.md](QUICKSTART.md)
- **Want Examples?** → See [examples/commands.md](examples/commands.md)
- **Need Details?** → Check [README.md](README.md)
- **Building Features?** → Review [ARCHITECTURE.md](ARCHITECTURE.md)
- **Want to Contribute?** → See [CONTRIBUTING.md](CONTRIBUTING.md)

## Project Files Overview

```
📄 START_HERE.md           ← You are here!
📄 QUICKSTART.md           ← 5-minute setup guide
📄 README.md               ← Complete documentation
📄 ARCHITECTURE.md         ← How it works
📄 CONTRIBUTING.md         ← Development guide
📄 PROJECT_SUMMARY.md      ← Project overview
📁 examples/               ← 100+ example commands
📁 src/                    ← Source code
📁 scripts/                ← Setup & test scripts
```

## Common Questions

**Q: Does this work in Figma web?**
A: No, plugins with network access require the Desktop App.

**Q: Can I use it with any Figma file?**
A: Yes! Just change the `FIGMA_FILE_KEY` in `.env`.

**Q: How much does it cost?**
A: Figma API is free. Gemini has a free tier with generous limits.

**Q: Can others use my plugin?**
A: Currently it's local only. For team use, everyone needs their own setup.

**Q: Is my data secure?**
A: Yes! Everything runs locally. API keys stay on your machine.

## Need Help?

1. Check the terminal for error messages
2. Review the troubleshooting section above
3. Read the full [README.md](README.md)
4. Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details

## Quick Commands Reference

### Creating
- `Create a [color] [shape] [width] by [height] pixels`
- `Make a [element type]`
- `Add a [element]`

### Modifying
- `Make the [element] [property]`
- `Change [element] to [value]`
- `Update [element] [property] to [value]`

### Styling
- `Change the color to [color]`
- `Add rounded corners`
- `Make it [opacity]`

### Moving/Sizing
- `Move [element] to the [direction]`
- `Resize [element] to [dimensions]`
- `Make [element] bigger/smaller`

### Deleting
- `Delete the [element]`
- `Remove [element]`

## Tips for Best Results

1. **Be Specific**: "Create a blue button" is better than "Make a button"
2. **Use Names**: Name your elements clearly in Figma
3. **Start Simple**: Try basic commands before complex ones
4. **Check History**: Plugin shows what commands succeeded
5. **Use Text First**: Test commands via text before voice

## Architecture at a Glance

```
You speak/type → Plugin UI → WebSocket → Server
                                          ↓
                              Gemini processes command
                                          ↓
Server → WebSocket → Plugin → Figma API → Your design updates!
```

## Development Mode

Already know what you're doing? Here's the dev workflow:

```bash
# Terminal 1: Server with auto-restart
npm run dev

# Terminal 2: Plugin with auto-rebuild
npm run plugin:watch

# Reload plugin in Figma when code changes
```

## That's It!

You're ready to start voice-controlling Figma! 🚀

Try some commands and see the magic happen. Start simple, experiment, and have fun!

---

**Next Steps:**
- Try the example commands above
- Read [examples/commands.md](examples/commands.md) for 100+ more ideas
- Check [README.md](README.md) for complete documentation

Happy designing! 🎨
