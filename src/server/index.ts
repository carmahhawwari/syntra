import express from 'express';
import cors from 'cors';
import { config, validateConfig } from '../config/index.js';
import { VoiceCommandServer } from './websocket.js';
import { figmaService } from '../services/figma.js';
import { geminiService } from '../services/gemini.js';

async function startServer() {
  try {
    // Validate configuration
    console.log('Validating configuration...');
    validateConfig();

    // Create Express app
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        service: 'Figma Gemini Voice Editor',
        timestamp: new Date().toISOString(),
      });
    });

    // Get Figma file info
    app.get('/api/figma/file', async (req, res) => {
      try {
        const fileData = await figmaService.getFileMetadata();
        res.json(fileData);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Search for nodes
    app.get('/api/figma/search', async (req, res) => {
      try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
          return res.status(400).json({ error: 'Query parameter required' });
        }
        const nodes = await figmaService.findNodesByName(query);
        res.json({ nodes });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Process text command
    app.post('/api/command/text', async (req, res) => {
      try {
        const { text, context } = req.body;
        if (!text) {
          return res.status(400).json({ error: 'Text parameter required' });
        }
        const result = await geminiService.processTextCommand(text, context);
        res.json(result);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get suggestions
    app.post('/api/suggestions', async (req, res) => {
      try {
        const { state } = req.body;
        const suggestions = await geminiService.getSuggestions(state);
        res.json({ suggestions });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Start Express server
    app.listen(config.port, () => {
      console.log(`HTTP server listening on port ${config.port}`);
      console.log(`Health check: http://localhost:${config.port}/health`);
    });

    // Start WebSocket server
    const wsServer = new VoiceCommandServer(config.wsPort);
    console.log(`WebSocket server listening on port ${config.wsPort}`);

    // Test Figma connection
    console.log('\nTesting Figma API connection...');
    try {
      const metadata = await figmaService.getFileMetadata();
      console.log('✓ Successfully connected to Figma');
      console.log(`  File: ${metadata.name}`);
      console.log(`  Nodes: ${metadata.nodeCount}`);
    } catch (error: any) {
      console.error('✗ Failed to connect to Figma:', error.message);
      console.error('  Please check your FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY');
    }

    console.log('\n===========================================');
    console.log('Figma Gemini Voice Editor Server Running');
    console.log('===========================================');
    console.log(`HTTP API: http://localhost:${config.port}`);
    console.log(`WebSocket: ws://localhost:${config.wsPort}`);
    console.log('\nNext steps:');
    console.log('1. Open Figma Desktop App');
    console.log('2. Open your design file');
    console.log('3. Go to Plugins > Development > Import plugin from manifest');
    console.log('4. Select the manifest.json file from dist/plugin/');
    console.log('5. Run the plugin and start using voice commands!');
    console.log('===========================================\n');

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\nShutting down gracefully...');
      wsServer.close();
      process.exit(0);
    });
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
