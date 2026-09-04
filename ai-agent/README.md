# AI Agent - Natural Language Processing Engine

Python-based AI chatbot for Web Studio Australia with NLP capabilities

## Setup

```bash
cd ai-agent
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Configuration

Create `.env` file:

```
OPENAI_API_KEY=your_openai_api_key
AI_MODEL=gpt-4
AI_TEMPERATURE=0.7
REDIS_URL=redis://localhost:6379/1
API_URL=http://localhost:5000/api
```

## Running

```bash
# Development
python main.py

# Or with Uvicorn
uvicorn main:app --reload --port 8000
```

## Features

- Intent recognition and classification
- Natural language understanding
- Context-aware responses
- Lead qualification
- Multi-turn conversations
- Learning from interactions

## API Endpoints

- `POST /query` - Process user query
- `GET /intents` - Get all recognized intents
- `POST /train` - Train on new examples
- `GET /health` - Health check
