from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
from datetime import datetime

from services.nlp_engine import NLPEngine
from services.intent_classifier import IntentClassifier
from services.response_generator import ResponseGenerator
from utils.logger import setup_logger
from utils.cache import RedisCache

load_dotenv()

app = Flask(__name__)
CORS(app)

logger = setup_logger(__name__)

# Initialize services
nlp_engine = NLPEngine()
classifier = IntentClassifier()
response_gen = ResponseGenerator()
cache = RedisCache()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'service': 'AI Agent',
        'timestamp': datetime.now().isoformat()
    }), 200

@app.route('/query', methods=['POST'])
def query():
    """Process user query and generate response"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        conversation_id = data.get('conversationId')
        context = data.get('context', {})

        if not message:
            return jsonify({
                'error': 'Message is required'
            }), 400

        # Check cache
        cache_key = f"query:{message[:50]}"
        cached = cache.get(cache_key)
        if cached:
            logger.info(f"Cache hit for: {message[:50]}")
            return jsonify(cached), 200

        # Process message
        logger.info(f"Processing query: {message[:50]}")

        # Extract entities and intent
        entities = nlp_engine.extract_entities(message)
        intent = classifier.classify(message)

        logger.info(f"Detected intent: {intent['name']} (confidence: {intent['confidence']})")

        # Generate response
        response_text = response_gen.generate(intent, entities, context)
        follow_up_questions = response_gen.get_follow_up_questions(intent)

        result = {
            'id': f"response-{datetime.now().timestamp()}",
            'conversationId': conversation_id,
            'message': response_text,
            'confidence': intent['confidence'],
            'intent': intent['name'],
            'entities': entities,
            'followUpQuestions': follow_up_questions,
            'timestamp': datetime.now().isoformat()
        }

        # Cache result
        cache.set(cache_key, result, ttl=3600)

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Query processing error: {str(e)}")
        return jsonify({
            'error': 'Failed to process query',
            'details': str(e)
        }), 500

@app.route('/intents', methods=['GET'])
def get_intents():
    """Get all recognized intents"""
    try:
        intents = classifier.get_all_intents()
        return jsonify({
            'intents': intents
        }), 200
    except Exception as e:
        logger.error(f"Get intents error: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve intents'
        }), 500

@app.route('/train', methods=['POST'])
def train():
    """Train AI agent on new examples"""
    try:
        data = request.get_json()
        message = data.get('message')
        intent_label = data.get('intent')
        correct = data.get('correct', False)

        if not message or not intent_label:
            return jsonify({
                'error': 'Message and intent are required'
            }), 400

        # Add training sample
        classifier.add_training_sample(message, intent_label)
        logger.info(f"Added training sample: {message[:50]} -> {intent_label}")

        return jsonify({
            'success': True,
            'message': 'Training sample added',
            'intent': intent_label
        }), 201

    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        return jsonify({
            'error': 'Training failed'
        }), 500

@app.route('/sentiment', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of message"""
    try:
        data = request.get_json()
        message = data.get('message')

        if not message:
            return jsonify({
                'error': 'Message is required'
            }), 400

        sentiment = nlp_engine.analyze_sentiment(message)

        return jsonify({
            'message': message,
            'sentiment': sentiment['label'],
            'score': sentiment['score'],
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Sentiment analysis error: {str(e)}")
        return jsonify({
            'error': 'Sentiment analysis failed'
        }), 500

@app.route('/lead-score', methods=['POST'])
def score_lead():
    """Score a lead based on conversation"""
    try:
        data = request.get_json()
        conversation = data.get('conversation', [])
        context = data.get('context', {})

        if not conversation:
            return jsonify({
                'error': 'Conversation is required'
            }), 400

        # Analyze conversation
        score = classifier.score_lead(conversation, context)

        return jsonify({
            'score': score,
            'level': 'hot' if score >= 80 else 'warm' if score >= 50 else 'cold',
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Lead scoring error: {str(e)}")
        return jsonify({
            'error': 'Lead scoring failed'
        }), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(e):
    logger.error(f"Internal error: {str(e)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('AI_AGENT_PORT', 8000))
    debug = os.getenv('NODE_ENV') != 'production'
    app.run(host='0.0.0.0', port=port, debug=debug)
