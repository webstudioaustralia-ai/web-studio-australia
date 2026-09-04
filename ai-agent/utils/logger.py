import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logger(name):
    """Setup logging configuration"""
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_format = logging.Formatter('[%(asctime)s] %(levelname)s - %(name)s: %(message)s')
    console_handler.setFormatter(console_format)

    # File handler
    try:
        if not os.path.exists('logs'):
            os.makedirs('logs')
        file_handler = RotatingFileHandler('logs/ai_agent.log', maxBytes=10485760, backupCount=5)
        file_handler.setLevel(logging.INFO)
        file_format = logging.Formatter('[%(asctime)s] %(levelname)s - %(name)s: %(message)s')
        file_handler.setFormatter(file_format)
        logger.addHandler(file_handler)
    except Exception as e:
        print(f"Error setting up file handler: {e}")

    logger.addHandler(console_handler)

    return logger
