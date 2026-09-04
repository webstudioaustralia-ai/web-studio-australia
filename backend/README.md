# Backend API Server

Node.js/Express backend for Web Studio Australia

## Setup

```bash
cd backend
npm install
```

## Environment Variables

Create `.env` file:

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/webstudio
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
```

## Running

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
