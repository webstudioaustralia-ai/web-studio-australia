# Live Chat System - Real-time WebSocket Server

Node.js-based WebSocket server for real-time live chat functionality

## Setup

```bash
cd live-chat-system
npm install
```

## Environment Variables

Create `.env` file:

```
CHAT_SERVER_PORT=5001
REDIS_URL=redis://localhost:6379/1
API_URL=http://localhost:5000/api
NODE_ENV=development
```

## Running

```bash
# Development
npm run dev

# Production
npm start
```

## Features

- Real-time messaging via WebSocket
- AI agent integration
- Message persistence
- User presence tracking
- Typing indicators
- Message read receipts
- Conversation management
- Rate limiting
- Error handling
