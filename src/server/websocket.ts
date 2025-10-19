import { WebSocketServer, WebSocket } from 'ws';
import { geminiService } from '../services/gemini.js';
import { figmaService } from '../services/figma.js';

export class VoiceCommandServer {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.setupServer();
  }

  private setupServer() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected');
      this.clients.add(ws);

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          await this.handleMessage(ws, data);
        } catch (error: any) {
          console.error('Error handling message:', error);
          this.sendError(ws, error.message);
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Send welcome message
      this.send(ws, {
        type: 'connected',
        message: 'Connected to Gemini Voice Editor server',
      });
    });

    console.log(`WebSocket server started on port ${this.wss.options.port}`);
  }

  private async handleMessage(ws: WebSocket, message: any) {
    console.log('Received message:', message.type);

    switch (message.type) {
      case 'voice-command':
        await this.handleVoiceCommand(ws, message.data);
        break;
      case 'file-data':
        console.log('Received file data:', message.data);
        break;
      case 'ping':
        this.send(ws, { type: 'pong' });
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private async handleVoiceCommand(ws: WebSocket, data: any) {
    try {
      let geminiResponse;

      if (data.audio) {
        // Process audio command
        console.log('Processing audio command...');
        const context = data.context ? JSON.stringify(data.context) : '';
        geminiResponse = await geminiService.processVoiceCommand(data.audio, context);
      } else if (data.text) {
        // Process text command
        console.log('Processing text command:', data.text);

        // Use provided context or fetch from Figma API
        let context = '';
        if (data.context) {
          context = JSON.stringify(data.context);
          console.log('Using provided context with', data.context.nodeCount, 'nodes');
        } else {
          try {
            const fileData = await figmaService.getFile();
            context = JSON.stringify({
              name: fileData.document.name,
              childCount: fileData.document.children?.length || 0,
            });
          } catch (error) {
            console.warn('Could not fetch Figma context:', error);
          }
        }

        geminiResponse = await geminiService.processTextCommand(data.text, context);
      } else {
        throw new Error('No audio or text data provided');
      }

      console.log('Gemini response:', geminiResponse);

      // Send command to Figma plugin
      this.broadcast({
        type: 'execute-command',
        data: geminiResponse.command,
      });

      // Send confirmation back to the client
      this.send(ws, {
        type: 'command-processed',
        data: geminiResponse,
      });
    } catch (error: any) {
      console.error('Error processing voice command:', error);
      this.sendError(ws, error.message);
    }
  }

  private send(ws: WebSocket, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  private sendError(ws: WebSocket, error: string) {
    this.send(ws, {
      type: 'error',
      error,
    });
  }

  private broadcast(data: any) {
    const message = JSON.stringify(data);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public close() {
    this.wss.close();
  }
}
