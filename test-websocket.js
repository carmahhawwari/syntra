// Simple WebSocket connection test
const WebSocket = require('ws');

console.log('Attempting to connect to ws://localhost:8080...');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('✓ Connected to WebSocket server');

  // Send a test message
  ws.send(JSON.stringify({ type: 'ping' }));
  console.log('Sent ping message');
});

ws.on('message', (data) => {
  console.log('Received:', data.toString());
});

ws.on('error', (error) => {
  console.error('✗ WebSocket error:', error.message);
});

ws.on('close', () => {
  console.log('Connection closed');
  process.exit(0);
});

// Close after 5 seconds
setTimeout(() => {
  ws.close();
}, 5000);
