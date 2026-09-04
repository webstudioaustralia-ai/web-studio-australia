import redis
import json
import logging
import os

logger = logging.getLogger(__name__)

class RedisCache:
    """Redis caching service"""

    def __init__(self):
        redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/1')
        try:
            self.client = redis.from_url(redis_url, decode_responses=True)
            self.client.ping()
            logger.info("Connected to Redis")
        except Exception as e:
            logger.error(f"Redis connection error: {str(e)}")
            self.client = None

    def get(self, key):
        """Get value from cache"""
        try:
            if not self.client:
                return None
            value = self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Cache get error: {str(e)}")
            return None

    def set(self, key, value, ttl=3600):
        """Set value in cache"""
        try:
            if not self.client:
                return False
            self.client.setex(key, ttl, json.dumps(value))
            return True
        except Exception as e:
            logger.error(f"Cache set error: {str(e)}")
            return False

    def delete(self, key):
        """Delete value from cache"""
        try:
            if not self.client:
                return False
            self.client.delete(key)
            return True
        except Exception as e:
            logger.error(f"Cache delete error: {str(e)}")
            return False

    def clear(self):
        """Clear all cache"""
        try:
            if self.client:
                self.client.flushdb()
            return True
        except Exception as e:
            logger.error(f"Cache clear error: {str(e)}")
            return False
