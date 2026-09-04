import os
import json
import logging
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib

logger = logging.getLogger(__name__)

class IntentClassifier:
    """Intent classification and recognition"""

    def __init__(self):
        self.intents = [
            {
                'id': 'service_inquiry',
                'name': 'Service Inquiry',
                'keywords': ['service', 'offer', 'do you', 'provide', 'what do you', 'help', 'available'],
                'responses': [
                    'We offer web design, web development, e-commerce solutions, digital marketing, and branding services.',
                    'Our services include web design, development, and comprehensive digital solutions for your business.',
                    'We specialize in creating amazing web experiences. Can I help with a specific service?'
                ]
            },
            {
                'id': 'pricing',
                'name': 'Pricing Question',
                'keywords': ['price', 'cost', 'how much', 'pricing', 'budget', 'expensive', 'afford', 'payment'],
                'responses': [
                    'Our pricing varies based on project scope and requirements. Web design starts from $5,000. Would you like a custom quote?',
                    'Pricing depends on your specific needs. Let\'s discuss your project requirements for an accurate estimate.',
                    'We offer flexible pricing packages. Can you tell me more about your project scope?'
                ]
            },
            {
                'id': 'timeline',
                'name': 'Timeline Question',
                'keywords': ['timeline', 'how long', 'duration', 'when', 'deadline', 'weeks', 'months', 'fast'],
                'responses': [
                    'Most web projects take 4-12 weeks depending on complexity. Can you tell me more about your project?',
                    'Project timeline depends on scope. Simple sites take 4-6 weeks, complex projects 12+ weeks.',
                    'We\'ll work with your deadline. Let\'s discuss your specific timeline needs.'
                ]
            },
            {
                'id': 'portfolio',
                'name': 'Portfolio Request',
                'keywords': ['portfolio', 'examples', 'projects', 'case studies', 'work', 'previous', 'past'],
                'responses': [
                    'Check out our portfolio at www.webstudioaustralia.com/portfolio to see our recent projects.',
                    'We have completed projects for fashion boutiques, tech companies, real estate agencies, and more.',
                    'I\'d love to show you some of our recent work. What type of project interests you?'
                ]
            },
            {
                'id': 'contact',
                'name': 'Contact Request',
                'keywords': ['contact', 'call', 'meet', 'talk', 'phone', 'email', 'discuss', 'meeting'],
                'responses': [
                    'I\'d be happy to help! You can reach us at hello@webstudioaustralia.com or call +61 2 1234 5678.',
                    'Let\'s schedule a free consultation. You can contact us via email or phone.',
                    'I can connect you with our team. What\'s the best way to reach you?'
                ]
            },
            {
                'id': 'greeting',
                'name': 'Greeting',
                'keywords': ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
                'responses': [
                    'Hello! Welcome to Web Studio Australia. How can I help you today?',
                    'Hi there! I\'m here to assist with any questions about our services.',
                    'Greetings! What brings you here today?'
                ]
            },
            {
                'id': 'support',
                'name': 'Support Request',
                'keywords': ['help', 'issue', 'problem', 'support', 'error', 'bug', 'broken'],
                'responses': [
                    'I\'m here to help! Can you describe the issue you\'re experiencing?',
                    'Sorry to hear you\'re having trouble. Let\'s troubleshoot this together.',
                    'I\'ll do my best to assist. What\'s the issue?'
                ]
            }
        ]
        self.vectorizer = TfidfVectorizer(lowercase=True, stop_words='english')
        self.classifier = MultinomialNB()
        self._train_classifier()

    def _train_classifier(self):
        """Train the intent classifier"""
        try:
            training_texts = []
            training_labels = []

            for intent in self.intents:
                for keyword in intent['keywords']:
                    training_texts.append(keyword)
                    training_labels.append(intent['id'])

            X = self.vectorizer.fit_transform(training_texts)
            self.classifier.fit(X, training_labels)
            logger.info("Intent classifier trained successfully")
        except Exception as e:
            logger.error(f"Classifier training error: {str(e)}")

    def classify(self, text):
        """Classify text intent"""
        try:
            X = self.vectorizer.transform([text.lower()])
            prediction = self.classifier.predict(X)[0]
            confidence = max(self.classifier.predict_proba(X)[0])

            intent = next((i for i in self.intents if i['id'] == prediction), self.intents[0])

            return {
                'id': intent['id'],
                'name': intent['name'],
                'confidence': float(confidence),
                'responses': intent['responses']
            }
        except Exception as e:
            logger.error(f"Classification error: {str(e)}")
            return self.intents[0]

    def get_all_intents(self):
        """Get all available intents"""
        return [
            {
                'id': i['id'],
                'name': i['name'],
                'description': f"User asking about {i['name'].lower()}",
                'keywords': i['keywords'][:3],
                'responses': len(i['responses'])
            }
            for i in self.intents
        ]

    def add_training_sample(self, text, intent_id):
        """Add new training sample"""
        try:
            intent = next((i for i in self.intents if i['id'] == intent_id), None)
            if intent:
                intent['keywords'].append(text.lower())
                self._train_classifier()
                logger.info(f"Training sample added for intent: {intent_id}")
        except Exception as e:
            logger.error(f"Error adding training sample: {str(e)}")

    def score_lead(self, conversation, context):
        """Score a lead based on conversation quality"""
        try:
            score = 50  # Base score

            # Check for budget mention
            conversation_text = ' '.join([msg.get('content', '') for msg in conversation])
            if any(word in conversation_text.lower() for word in ['budget', 'price', 'cost', 'investment']):
                score += 15

            # Check for timeline mention
            if any(word in conversation_text.lower() for word in ['timeline', 'urgent', 'asap', 'week', 'month']):
                score += 10

            # Check for service specificity
            services = ['web design', 'development', 'e-commerce', 'marketing']
            if sum(1 for s in services if s in conversation_text.lower()) > 0:
                score += 10

            # Check conversation length
            if len(conversation) > 5:
                score += 15

            return min(100, score)
        except Exception as e:
            logger.error(f"Lead scoring error: {str(e)}")
            return 50
