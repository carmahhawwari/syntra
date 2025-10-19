import dotenv from 'dotenv';
import { AppConfig } from '../types/index.js';

dotenv.config();

export const config: AppConfig = {
  figmaAccessToken: process.env.FIGMA_ACCESS_TOKEN || '',
  figmaFileKey: process.env.FIGMA_FILE_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  port: parseInt(process.env.PORT || '3000', 10),
  wsPort: parseInt(process.env.WS_PORT || '8080', 10),
};

export function validateConfig(): void {
  const requiredFields: (keyof AppConfig)[] = [
    'figmaAccessToken',
    'figmaFileKey',
    'geminiApiKey',
  ];

  const missing = requiredFields.filter((field) => !config[field]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration: ${missing.join(', ')}. Please check your .env file.`
    );
  }
}
