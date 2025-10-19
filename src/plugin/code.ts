// This plugin code runs inside Figma

// Show the UI
figma.showUI(__html__, { width: 400, height: 600 });

// Handle messages from the server (forwarded through UI)
async function handleServerMessage(message: any) {
  console.log('Received message from server:', message);

  switch (message.type) {
    case 'execute-command':
      await executeCommand(message.data);
      break;
    case 'get-file-data':
      sendFileData();
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

// Execute a design command
async function executeCommand(command: any) {
  try {
    const { type, target, properties } = command;

    switch (type) {
      case 'create':
        await createNode(properties);
        break;
      case 'modify':
        await modifyNode(target, properties);
        break;
      case 'delete':
        await deleteNode(target);
        break;
      case 'style':
        await styleNode(target, properties);
        break;
      case 'move':
        await moveNode(target, properties);
        break;
      case 'resize':
        await resizeNode(target, properties);
        break;
      default:
        console.log('Unknown command type:', type);
    }

    figma.ui.postMessage({
      type: 'command-executed',
      success: true,
      command: command
    });
  } catch (error: any) {
    console.error('Error executing command:', error);
    figma.ui.postMessage({
      type: 'command-executed',
      success: false,
      error: error.message,
      command: command
    });
  }
}

// Create a new node
async function createNode(properties: any) {
  const { elementType, width = 100, height = 100, x = 0, y = 0, fills, name } = properties;
  let node: SceneNode;

  switch (elementType) {
    case 'rectangle':
      node = figma.createRectangle();
      break;
    case 'ellipse':
    case 'circle':
      node = figma.createEllipse();
      break;
    case 'text':
      node = figma.createText();
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
      (node as TextNode).characters = properties.text || 'New Text';
      break;
    case 'frame':
      node = figma.createFrame();
      break;
    default:
      node = figma.createRectangle();
  }

  node.resize(width, height);
  node.x = x;
  node.y = y;

  if (name) {
    node.name = name;
  }

  if (fills && 'fills' in node) {
    node.fills = parseFills(fills);
  }

  // Add to current page
  figma.currentPage.appendChild(node);
  figma.currentPage.selection = [node];
  figma.viewport.scrollAndZoomIntoView([node]);
}

// Modify an existing node
async function modifyNode(target: string, properties: any) {
  const nodes = findNodesByName(target);

  if (nodes.length === 0) {
    // Get suggestions for similar node names
    const allNodes = getAllNodesForContext();
    const suggestions = allNodes
      .slice(0, 5)
      .map(n => n.name)
      .join('", "');

    throw new Error(
      `No nodes found matching "${target}". ` +
      `Available nodes include: "${suggestions}". ` +
      `Try using exact node names or create the element first.`
    );
  }

  console.log(`Modifying ${nodes.length} node(s) matching "${target}"`);

  for (const node of nodes) {
    if (properties.name) {
      node.name = properties.name;
    }

    if (properties.fontSize && node.type === 'TEXT') {
      await figma.loadFontAsync((node as TextNode).fontName as FontName);
      (node as TextNode).fontSize = properties.fontSize;
    }

    if (properties.characters && node.type === 'TEXT') {
      await figma.loadFontAsync((node as TextNode).fontName as FontName);
      (node as TextNode).characters = properties.characters;
    }

    if (properties.opacity !== undefined) {
      node.opacity = properties.opacity;
    }
  }
}

// Delete a node
async function deleteNode(target: string) {
  const nodes = findNodesByName(target);

  if (nodes.length === 0) {
    const allNodes = getAllNodesForContext();
    const suggestions = allNodes
      .slice(0, 5)
      .map(n => n.name)
      .join('", "');

    throw new Error(
      `No nodes found matching "${target}". ` +
      `Available nodes: "${suggestions}"`
    );
  }

  console.log(`Deleting ${nodes.length} node(s) matching "${target}"`);

  for (const node of nodes) {
    node.remove();
  }
}

// Style a node
async function styleNode(target: string, properties: any) {
  const nodes = findNodesByName(target);

  if (nodes.length === 0) {
    const allNodes = getAllNodesForContext();
    const suggestions = allNodes
      .slice(0, 5)
      .map(n => n.name)
      .join('", "');

    throw new Error(
      `No nodes found matching "${target}". ` +
      `Available nodes: "${suggestions}"`
    );
  }

  console.log(`Styling ${nodes.length} node(s) matching "${target}"`);

  for (const node of nodes) {
    if (properties.fills && 'fills' in node) {
      node.fills = parseFills(properties.fills);
    }

    if (properties.strokes && 'strokes' in node) {
      node.strokes = parseFills(properties.strokes);
    }

    if (properties.effects && 'effects' in node) {
      node.effects = properties.effects;
    }

    if (properties.cornerRadius && 'cornerRadius' in node) {
      (node as RectangleNode).cornerRadius = properties.cornerRadius;
    }
  }
}

// Move a node
async function moveNode(target: string, properties: any) {
  const nodes = findNodesByName(target);

  if (nodes.length === 0) {
    throw new Error(`No nodes found matching: ${target}`);
  }

  for (const node of nodes) {
    if (properties.x !== undefined) {
      node.x = properties.x;
    }
    if (properties.y !== undefined) {
      node.y = properties.y;
    }
  }
}

// Resize a node
async function resizeNode(target: string, properties: any) {
  const nodes = findNodesByName(target);

  if (nodes.length === 0) {
    throw new Error(`No nodes found matching: ${target}`);
  }

  for (const node of nodes) {
    if (properties.width && properties.height) {
      node.resize(properties.width, properties.height);
    }
  }
}

// Find nodes by name with smart matching
function findNodesByName(searchTerm: string): SceneNode[] {
  const results: SceneNode[] = [];
  const searchLower = searchTerm.toLowerCase();
  const searchWords = searchLower.split(/\s+/);

  // Scoring function for match quality
  function scoreMatch(nodeName: string): number {
    const nameLower = nodeName.toLowerCase();
    let score = 0;

    // Exact match
    if (nameLower === searchLower) return 1000;

    // Contains exact search term
    if (nameLower.includes(searchLower)) score += 100;

    // All words match
    const allWordsMatch = searchWords.every(word => nameLower.includes(word));
    if (allWordsMatch) score += 50;

    // Partial word matches
    searchWords.forEach(word => {
      if (nameLower.includes(word)) score += 10;
    });

    // Type-based matching
    if (searchLower.includes('button') && nameLower.includes('button')) score += 20;
    if (searchLower.includes('header') && nameLower.includes('header')) score += 20;
    if (searchLower.includes('text') && nameLower.includes('text')) score += 20;
    if (searchLower.includes('image') && (nameLower.includes('image') || nameLower.includes('img'))) score += 20;

    return score;
  }

  function traverse(node: BaseNode) {
    if ('name' in node) {
      const score = scoreMatch(node.name);
      if (score > 0) {
        results.push({ node: node as SceneNode, score });
      }
    }
    if ('children' in node) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  traverse(figma.root);

  // Sort by score and return nodes
  return results
    .sort((a: any, b: any) => b.score - a.score)
    .map((r: any) => r.node);
}

// Parse color fills from various formats
function parseFills(fillData: any): Paint[] {
  if (Array.isArray(fillData)) {
    return fillData;
  }

  // Handle color string formats
  if (typeof fillData === 'string') {
    const color = parseColor(fillData);
    return [{ type: 'SOLID', color }];
  }

  return [];
}

// Parse color strings (hex, rgb, named colors)
function parseColor(colorString: string): RGB {
  const namedColors: Record<string, RGB> = {
    red: { r: 1, g: 0, b: 0 },
    green: { r: 0, g: 1, b: 0 },
    blue: { r: 0, g: 0, b: 1 },
    yellow: { r: 1, g: 1, b: 0 },
    cyan: { r: 0, g: 1, b: 1 },
    magenta: { r: 1, g: 0, b: 1 },
    white: { r: 1, g: 1, b: 1 },
    black: { r: 0, g: 0, b: 0 },
    gray: { r: 0.5, g: 0.5, b: 0.5 },
    orange: { r: 1, g: 0.5, b: 0 },
    purple: { r: 0.5, g: 0, b: 0.5 },
  };

  const lower = colorString.toLowerCase();
  if (namedColors[lower]) {
    return namedColors[lower];
  }

  // Default to gray if parsing fails
  return { r: 0.5, g: 0.5, b: 0.5 };
}

// Get all nodes in the file for context
function getAllNodesForContext(): any[] {
  const nodes: any[] = [];

  function traverse(node: BaseNode, depth: number = 0) {
    if ('name' in node && depth < 5) { // Limit depth to avoid too much data
      nodes.push({
        id: node.id,
        name: node.name,
        type: node.type,
      });
    }
    if ('children' in node && depth < 5) {
      for (const child of node.children) {
        traverse(child, depth + 1);
      }
    }
  }

  traverse(figma.currentPage);
  return nodes;
}

// Send current file data to server (via UI)
function sendFileData() {
  const allNodes = getAllNodesForContext();
  const selection = figma.currentPage.selection;

  const data = {
    name: figma.root.name,
    pageName: figma.currentPage.name,
    allNodes: allNodes,
    selection: selection.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
    })),
    nodeCount: allNodes.length,
  };

  figma.ui.postMessage({ type: 'send-to-server', data: { type: 'file-data', data } });
}

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  console.log('Received message from UI:', msg);

  switch (msg.type) {
    case 'server-message':
      // Message from server, forwarded through UI
      await handleServerMessage(msg.data);
      break;
    case 'get-selection':
      const selection = figma.currentPage.selection;
      figma.ui.postMessage({
        type: 'selection-data',
        data: selection.map(node => ({
          id: node.id,
          name: node.name,
          type: node.type,
        })),
      });
      break;
    case 'get-file-context':
      // Get current file context and send back to UI
      const allNodes = getAllNodesForContext();
      const currentSelection = figma.currentPage.selection;

      figma.ui.postMessage({
        type: 'file-context',
        data: {
          pageName: figma.currentPage.name,
          allNodes: allNodes,
          selection: currentSelection.map(node => ({
            id: node.id,
            name: node.name,
            type: node.type,
          })),
          nodeCount: allNodes.length,
        }
      });
      break;
    default:
      console.log('Unknown UI message type:', msg.type);
  }
};
