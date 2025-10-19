# Quick Start Guide

Get up and running with Figma Gemini Voice Editor in 5 minutes!

## Step 1: Install (30 seconds)

```bash
npm install
```

## Step 2: Configure (2 minutes)

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your keys:

**Get Figma Token:** https://www.figma.com/developers/api#authentication
```env
FIGMA_ACCESS_TOKEN=figd_YOUR_TOKEN
```

**Get File Key from URL:** `figma.com/file/YOUR_KEY/...`
```env
FIGMA_FILE_KEY=YOUR_FILE_KEY
```

**Get Gemini Key:** https://ai.google.dev/
```env
GEMINI_API_KEY=YOUR_GEMINI_KEY
```

## Step 3: Build & Run (1 minute)

```bash
npm run build
npm run dev
```

You should see:
```
✓ Successfully connected to Figma
Figma Gemini Voice Editor Server Running
```

## Step 4: Install Plugin (1 minute)

1. Open **Figma Desktop App**
2. Open your design file (matching your FIGMA_FILE_KEY)
3. **Plugins → Development → Import plugin from manifest...**
4. Select: `dist/plugin/manifest.json`
5. **Plugins → Development → Gemini Voice Editor**

## Step 5: Test! (30 seconds)

Once the plugin UI opens and shows "Connected":

### Try a text command first:
Type: `Create a blue rectangle 200 by 100 pixels`
Press Enter

You should see a blue rectangle appear! 🎉

### Then try voice:
1. Hold "Hold to Speak" button
2. Say: "Make it red"
3. Release button

The rectangle should turn red! 🔴

## Common First Commands

```
Create a blue button 150 by 50
Make the text larger
Change background to white
Add a circle
Move it to the right
Delete the rectangle
```

## Need Help?

- Server not starting? Check your `.env` configuration
- Plugin won't connect? Make sure server is running
- Commands not working? Check server logs in terminal

See full [README.md](README.md) for detailed documentation.
