import os
import random
import logging

logger = logging.getLogger(__name__)

class ResponseGenerator:
    """Generate contextual responses based on intent"""

    def __init__(self):
        self.follow_ups = {
            'service_inquiry': [
                'Would you like to know more about any specific service?',
                'What type of project are you interested in?',
                'Can you tell me about your business?'
            ],
            'pricing': [
                'Would you like a free quote?',
                'What\'s your approximate budget?',
                'Can you describe your project in more detail?'
            ],
            'timeline': [
                'When do you need this completed?',
                'Is this an urgent project?',
                'What\'s your ideal start date?'
            ],
            'portfolio': [
                'Are there specific industries you\'d like to see?',
                'Would you like case study details?',
                'Do you see anything similar to your vision?'
            ],
            'contact': [
                'Would you prefer phone or email?',
                'What time works best for you?',
                'Should I schedule a meeting?'
            ]
        }

    def generate(self, intent, entities, context):
        """Generate response based on intent and context"""
        try:
            response = random.choice(intent.get('responses', ['How can I help you?']))

            # Personalize response if context available
            if context.get('clientName'):
                response = f"{context['clientName']}, " + response[0].lower() + response[1:]

            return response
        except Exception as e:
            logger.error(f"Response generation error: {str(e)}")
            return 'How can I assist you further?'

    def get_follow_up_questions(self, intent):
        """Get follow-up questions for intent"""
        try:
            intent_id = intent.get('id', 'support')
            follow_ups = self.follow_ups.get(intent_id, [])
            return random.sample(follow_ups, min(2, len(follow_ups)))
        except Exception as e:
            logger.error(f"Follow-up generation error: {str(e)}")
            return []
