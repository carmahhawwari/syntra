import { GoogleGenerativeAI } from '@google/generative-ai';
import { VoiceCommand, GeminiResponse } from '../types/index.js';
import { config } from '../config/index.js';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
    });
  }

  /**
   * Process voice input and convert to Figma command
   */
  async processVoiceCommand(
    audioData: string | ArrayBuffer,
    context?: string
  ): Promise<GeminiResponse> {
    try {
      const systemPrompt = `You are a Figma design assistant. Convert voice commands into structured Figma design operations.

${context ? `Current Figma context: ${context}` : ''}

Analyze the voice command and respond with a JSON object containing:
{
  "command": {
    "type": "create" | "modify" | "delete" | "style" | "move" | "resize",
    "target": "name or description of the element",
    "properties": {
      // Relevant properties based on command type
      // For create: { "elementType": "rectangle|circle|text|frame", "width": number, "height": number, "x": number, "y": number }
      // For modify: { "property": "name|color|opacity|etc", "value": any }
      // For style: { "fills": [...], "strokes": [...], "effects": [...] }
      // For move: { "x": number, "y": number }
      // For resize: { "width": number, "height": number }
    },
    "rawText": "original voice command text"
  },
  "confidence": 0.0-1.0,
  "explanation": "brief explanation of the interpretation"
}

Examples:
- "Create a blue rectangle 200 by 100 pixels" -> type: "create", elementType: "rectangle", fills: [blue], width: 200, height: 100
- "Make the header text bigger" -> type: "modify", target: "header text", property: "fontSize", value: increased
- "Move the login button to the right" -> type: "move", target: "login button", x: increased
- "Delete the footer" -> type: "delete", target: "footer"
- "Change the background color to red" -> type: "style", target: "background", fills: [red color]`;

      const result = await this.model.generateContent([
        systemPrompt,
        {
          inlineData: {
            mimeType: 'audio/wav',
            data: typeof audioData === 'string' ? audioData : this.arrayBufferToBase64(audioData),
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }

      throw new Error('Could not parse Gemini response');
    } catch (error: any) {
      console.error('Error processing voice command:', error);
      throw new Error(`Failed to process voice command: ${error.message}`);
    }
  }

  /**
   * Process text command (for testing or text-based input)
   */
  async processTextCommand(
    text: string,
    context?: string
  ): Promise<GeminiResponse> {
    try {
      let contextInfo = '';
      let availableNodes = '';

      if (context) {
        try {
          const ctx = JSON.parse(context);
          if (ctx.allNodes && ctx.allNodes.length > 0) {
            availableNodes = '\n\nAVAILABLE NODES IN FILE:\n' +
              ctx.allNodes.map((n: any) => `- "${n.name}" (${n.type})`).join('\n');
          }
          if (ctx.selection && ctx.selection.length > 0) {
            contextInfo += '\n\nCURRENTLY SELECTED:\n' +
              ctx.selection.map((n: any) => `- "${n.name}" (${n.type})`).join('\n');
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      const systemPrompt = `You are a Figma design assistant. Convert commands into structured Figma design operations.
${contextInfo}${availableNodes}

Analyze the command and respond ONLY with a valid JSON object (no markdown, no extra text).

IMPORTANT RULES:
1. For CREATE commands: use "properties" with "elementType" (rectangle/ellipse/circle/text/frame), "width", "height", "x", "y", "fills", "name"
2. For MODIFY/STYLE/DELETE commands: Use the EXACT node names from the available nodes list above. If the user says "header" or "headers", look for nodes containing "header" in the list.
3. For color fills: use format { "fills": [{ "type": "SOLID", "color": { "r": 0-1, "g": 0-1, "b": 0-1 } }] }
4. For fontSize: use actual number values (e.g., 24, 32, 48), not strings like "increase" or "larger"
5. If user says "button" or "buttons", match any node name containing "button" (case insensitive)
6. For plurals like "headers", "buttons", use the singular form or find all matching nodes

Response format:
{
  "command": {
    "type": "create" | "modify" | "delete" | "style" | "move" | "resize",
    "target": "exact node name to find (use names from available nodes list)",
    "properties": {
      // For CREATE: { "elementType": "rectangle", "width": 200, "height": 100, "fills": [{"type": "SOLID", "color": {"r": 0, "g": 0, "b": 1}}], "name": "Button" }
      // For MODIFY: { "fontSize": 32, "characters": "new text", "opacity": 0.5 }
      // For STYLE: { "fills": [{"type": "SOLID", "color": {"r": 1, "g": 0, "b": 0}}] }
      // For MOVE: { "x": 100, "y": 200 }
      // For RESIZE: { "width": 300, "height": 150 }
    },
    "rawText": "${text}",
    "timestamp": ${Date.now()}
  },
  "confidence": 0.95,
  "explanation": "brief explanation"
}

Examples:
- "Create a blue button" -> {"command": {"type": "create", "properties": {"elementType": "rectangle", "width": 120, "height": 40, "fills": [{"type": "SOLID", "color": {"r": 0.2, "g": 0.4, "b": 1}}], "name": "Button"}}}
- "Make header larger" (if "My Header" exists) -> {"command": {"type": "modify", "target": "header", "properties": {"fontSize": 48}}}
- "Change background to red" -> {"command": {"type": "style", "target": "background", "properties": {"fills": [{"type": "SOLID", "color": {"r": 1, "g": 0, "b": 0}}]}}}

Command: ${text}`;

      const result = await this.model.generateContent(systemPrompt);
      const response = await result.response;
      const responseText = response.text();

      // Remove markdown code blocks if present
      const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();

      // Parse JSON response
      const parsed = JSON.parse(cleanedText);
      return parsed;
    } catch (error: any) {
      console.error('Error processing text command:', error);
      throw new Error(`Failed to process text command: ${error.message}`);
    }
  }

  /**
   * Get context-aware suggestions
   */
  async getSuggestions(currentState: any): Promise<string[]> {
    try {
      const prompt = `Based on this Figma file state: ${JSON.stringify(currentState, null, 2)}

Suggest 3-5 helpful voice commands the user could say to improve or modify this design.
Return ONLY a JSON array of suggestion strings.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error: any) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binary, 'binary').toString('base64');
  }
}

// Export a singleton instance
export const geminiService = new GeminiService(config.geminiApiKey);
