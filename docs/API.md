# Web Studio Australia - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All API endpoints (except public routes) require JWT authentication.

### Obtaining a Token

```bash
POST /auth/login

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Using the Token

Include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Endpoints

### Authentication

#### POST /auth/register
Create a new user account

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "company": "My Company"
}
```

Response: `201 Created`
```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /auth/login
Login to existing account

#### POST /auth/logout
Logout current user

#### POST /auth/refresh
Refresh JWT token

---

### Chat

#### GET /chat/conversations
Get all conversations for current user

Query Parameters:
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)
- `status`: Filter by status (active, closed, archived)

Response: `200 OK`
```json
{
  "conversations": [
    {
      "id": "conv-123",
      "title": "Website Inquiry",
      "status": "active",
      "participant": {
        "id": "client-123",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "avatar": "https://..."
      },
      "lastMessage": {
        "id": "msg-456",
        "content": "Thanks for the update!",
        "timestamp": "2026-09-04T10:30:00Z",
        "sender": "client"
      },
      "unreadCount": 2,
      "createdAt": "2026-09-01T08:00:00Z",
      "updatedAt": "2026-09-04T10:30:00Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

#### GET /chat/conversations/:id
Get specific conversation with message history

Query Parameters:
- `limit`: Number of messages (default: 50)
- `offset`: Pagination offset (default: 0)

Response: `200 OK`
```json
{
  "id": "conv-123",
  "title": "Website Inquiry",
  "status": "active",
  "participant": { ... },
  "messages": [
    {
      "id": "msg-123",
      "content": "Hello, I need a new website",
      "sender": "client",
      "senderId": "client-123",
      "timestamp": "2026-09-01T08:00:00Z",
      "read": true,
      "attachments": []
    },
    {
      "id": "msg-124",
      "content": "I'd be happy to help! Let's discuss your needs.",
      "sender": "agent",
      "senderId": "agent-ai-001",
      "timestamp": "2026-09-01T08:05:00Z",
      "read": true,
      "attachments": []
    }
  ],
  "total": 28,
  "limit": 50
}
```

#### POST /chat/conversations/:id/messages
Send a message in a conversation

```json
{
  "content": "What are your pricing options?",
  "attachments": [
    {
      "type": "file",
      "url": "https://s3.amazonaws.com/...",
      "filename": "requirements.pdf"
    }
  ]
}
```

Response: `201 Created`
```json
{
  "id": "msg-125",
  "conversationId": "conv-123",
  "content": "What are your pricing options?",
  "sender": "team",
  "senderId": "user-123",
  "timestamp": "2026-09-04T11:00:00Z",
  "read": false,
  "attachments": [...]
}
```

#### PUT /chat/conversations/:id
Update conversation (status, title, etc.)

```json
{
  "status": "closed",
  "notes": "Project completed successfully"
}
```

Response: `200 OK`

#### DELETE /chat/conversations/:id
Archive or delete a conversation

Response: `204 No Content`

---

### AI Agent

#### POST /ai/query
Send a query to the AI agent

```json
{
  "message": "What services do you offer?",
  "conversationId": "conv-123",
  "context": {
    "clientName": "Jane Smith",
    "clientEmail": "jane@example.com",
    "previousInteractions": 3
  }
}
```

Response: `200 OK`
```json
{
  "id": "response-789",
  "conversationId": "conv-123",
  "message": "We offer web design, web development, e-commerce solutions, and digital marketing services. What specifically interests you?",
  "confidence": 0.95,
  "intent": "service_inquiry",
  "followUpQuestions": [
    "Would you like to know more about any specific service?",
    "What's your budget range?",
    "When do you need this completed?"
  ],
  "timestamp": "2026-09-04T11:15:00Z"
}
```

#### GET /ai/intents
Get list of recognized intents

Response: `200 OK`
```json
{
  "intents": [
    {
      "id": "intent-service-inquiry",
      "name": "Service Inquiry",
      "description": "Client asking about services",
      "responses": 5
    },
    {
      "id": "intent-pricing",
      "name": "Pricing Question",
      "description": "Client asking about pricing",
      "responses": 8
    }
  ]
}
```

---

### Leads

#### POST /leads
Create a new lead

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+61 2 1234 5678",
  "company": "Smith & Co",
  "message": "Interested in a new website",
  "source": "live_chat",
  "budget": "$10,000-$20,000"
}
```

Response: `201 Created`
```json
{
  "id": "lead-123",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "status": "new",
  "score": 85,
  "createdAt": "2026-09-04T11:20:00Z"
}
```

#### GET /leads
Get all leads

Query Parameters:
- `status`: Filter by status (new, qualified, contacted, won, lost)
- `source`: Filter by source (live_chat, form, referral, etc.)
- `sort`: Sort field (createdAt, score, name)

#### PUT /leads/:id
Update lead status and information

#### DELETE /leads/:id
Delete a lead

---

### Portfolio/Services

#### GET /services
Get all services

Response: `200 OK`
```json
{
  "services": [
    {
      "id": "service-1",
      "name": "Web Design",
      "description": "Custom website design",
      "price": "$5,000+",
      "image": "https://..."
    }
  ]
}
```

#### GET /portfolio
Get portfolio projects/case studies

Query Parameters:
- `category`: Filter by category (e-commerce, corporate, etc.)
- `featured`: Show only featured projects

---

### Analytics

#### GET /analytics/dashboard
Get dashboard analytics

Query Parameters:
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

Response: `200 OK`
```json
{
  "metrics": {
    "totalConversations": 150,
    "activeConversations": 12,
    "totalLeads": 45,
    "qualifiedLeads": 18,
    "conversionRate": 0.40,
    "averageResponseTime": "2m 30s",
    "aiResolutionRate": 0.65
  },
  "trends": {
    "conversations": [...],
    "leads": [...]
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Common Error Codes
- `INVALID_REQUEST` (400): Validation failed
- `UNAUTHORIZED` (401): Missing or invalid token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists
- `INTERNAL_ERROR` (500): Server error

---

## Rate Limiting

- API Rate: 1000 requests per hour
- WebSocket Connections: Max 10 per user

Headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1693756800
```

---

## WebSocket Connection

### Connect to Live Chat

```javascript
const socket = io('http://localhost:5001', {
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIs...'
  }
});

socket.on('message', (data) => {
  console.log('New message:', data);
});

socket.emit('message:send', {
  conversationId: 'conv-123',
  content: 'Hello!'
});
```

---

## API Version
Current: v1
Endpoint: `http://localhost:5000/api/v1`

Last Updated: September 2026
