# Frontend - React Website

Modern React-based website with live chat integration for Web Studio Australia

## Setup

```bash
cd frontend
npm install
```

## Environment Variables

Create `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WEBSOCKET_URL=ws://localhost:5000/ws
PORT=3000
```

## Running

```bash
# Development
npm start

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── services/         # API services
├── hooks/            # Custom React hooks
├── context/          # React context for state
├── styles/           # Global styles
├── utils/            # Utility functions
└── App.jsx           # Main app component
```
