import axios, { AxiosInstance } from 'axios';
import { FigmaFileData, FigmaNode } from '../types/index.js';
import { config } from '../config/index.js';

export class FigmaService {
  private client: AxiosInstance;
  private fileKey: string;

  constructor(accessToken: string, fileKey: string) {
    this.fileKey = fileKey;
    this.client = axios.create({
      baseURL: 'https://api.figma.com/v1',
      headers: {
        'X-Figma-Token': accessToken,
      },
    });
  }

  /**
   * Fetches the Figma file data
   */
  async getFile(): Promise<FigmaFileData> {
    try {
      const response = await this.client.get(`/files/${this.fileKey}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch Figma file: ${error.message}`);
    }
  }

  /**
   * Gets a specific node from the file
   */
  async getNode(nodeId: string): Promise<any> {
    try {
      const response = await this.client.get(
        `/files/${this.fileKey}/nodes?ids=${nodeId}`
      );
      return response.data.nodes[nodeId];
    } catch (error: any) {
      throw new Error(`Failed to fetch node ${nodeId}: ${error.message}`);
    }
  }

  /**
   * Search for nodes by name
   */
  async findNodesByName(name: string): Promise<FigmaNode[]> {
    const fileData = await this.getFile();
    const results: FigmaNode[] = [];

    const traverse = (node: FigmaNode) => {
      if (node.name && node.name.toLowerCase().includes(name.toLowerCase())) {
        results.push(node);
      }
      if (node.children) {
        node.children.forEach((child: FigmaNode) => traverse(child));
      }
    };

    traverse(fileData.document);
    return results;
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(): Promise<any> {
    try {
      const fileData = await this.getFile();
      return {
        name: fileData.document.name,
        schemaVersion: fileData.schemaVersion,
        nodeCount: this.countNodes(fileData.document),
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch file metadata: ${error.message}`);
    }
  }

  private countNodes(node: FigmaNode): number {
    let count = 1;
    if (node.children) {
      node.children.forEach((child: FigmaNode) => {
        count += this.countNodes(child);
      });
    }
    return count;
  }

  /**
   * Get images from the file
   */
  async getImages(nodeIds: string[]): Promise<Record<string, string>> {
    try {
      const response = await this.client.get(
        `/images/${this.fileKey}?ids=${nodeIds.join(',')}&format=png`
      );
      return response.data.images;
    } catch (error: any) {
      throw new Error(`Failed to fetch images: ${error.message}`);
    }
  }
}

// Export a singleton instance
export const figmaService = new FigmaService(
  config.figmaAccessToken,
  config.figmaFileKey
);
