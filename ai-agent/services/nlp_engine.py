import os
import openai
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
import logging

logger = logging.getLogger(__name__)

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

class NLPEngine:
    """Natural Language Processing Engine"""

    def __init__(self):
        self.openai_key = os.getenv('OPENAI_API_KEY')
        self.model = os.getenv('AI_MODEL', 'gpt-4')
        self.temperature = float(os.getenv('AI_TEMPERATURE', 0.7))

    def extract_entities(self, text):
        """Extract named entities from text"""
        try:
            entities = {
                'services': self._extract_services(text),
                'budget': self._extract_budget(text),
                'timeline': self._extract_timeline(text),
                'keywords': self._extract_keywords(text)
            }
            return entities
        except Exception as e:
            logger.error(f"Entity extraction error: {str(e)}")
            return {}

    def _extract_services(self, text):
        """Extract mentioned services"""
        services = ['web design', 'web development', 'e-commerce', 'digital marketing', 'branding', 'maintenance']
        mentioned = [s for s in services if s.lower() in text.lower()]
        return mentioned

    def _extract_budget(self, text):
        """Extract budget mentions"""
        import re
        # Match patterns like $5000, $5K, $5,000
        pattern = r'\$[\d,]+[K]?'
        matches = re.findall(pattern, text)
        return matches if matches else None

    def _extract_timeline(self, text):
        """Extract timeline mentions"""
        import re
        # Match patterns like "2 weeks", "3 months", etc.
        pattern = r'(\d+)\s+(week|month|day|year)s?'
        matches = re.findall(pattern, text.lower())
        return [f"{m[0]} {m[1]}" for m in matches] if matches else None

    def _extract_keywords(self, text):
        """Extract important keywords"""
        tokens = word_tokenize(text.lower())
        stop_words = set(stopwords.words('english'))
        keywords = [t for t in tokens if t.isalnum() and t not in stop_words and len(t) > 3]
        return list(set(keywords))[:5]

    def analyze_sentiment(self, text):
        """Analyze sentiment of text"""
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a sentiment analysis expert. Respond with only JSON: {\"label\": \"positive\" | \"negative\" | \"neutral\", \"score\": 0-1}"
                    },
                    {
                        "role": "user",
                        "content": f"Analyze the sentiment of this text: {text}"
                    }
                ],
                temperature=self.temperature
            )

            result = response['choices'][0]['message']['content']
            import json
            return json.loads(result)
        except Exception as e:
            logger.error(f"Sentiment analysis error: {str(e)}")
            return {'label': 'neutral', 'score': 0.5}

    def summarize(self, text):
        """Summarize text"""
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a summarization expert. Provide a concise summary."
                    },
                    {
                        "role": "user",
                        "content": f"Summarize this text: {text}"
                    }
                ],
                temperature=self.temperature
            )

            return response['choices'][0]['message']['content']
        except Exception as e:
            logger.error(f"Summarization error: {str(e)}")
            return text
