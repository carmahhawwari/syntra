export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  [key: string]: any;
}

export interface FigmaFileData {
  document: FigmaNode;
  components: Record<string, any>;
  schemaVersion: number;
  styles: Record<string, any>;
}

export interface VoiceCommand {
  type: 'create' | 'modify' | 'delete' | 'style' | 'move' | 'resize';
  target?: string;
  properties?: Record<string, any>;
  rawText: string;
  timestamp: number;
}

export interface GeminiResponse {
  command: VoiceCommand;
  confidence: number;
  explanation?: string;
}

export interface PluginMessage {
  type: string;
  data: any;
}

export interface AppConfig {
  figmaAccessToken: string;
  figmaFileKey: string;
  geminiApiKey: string;
  port: number;
  wsPort: number;
}
