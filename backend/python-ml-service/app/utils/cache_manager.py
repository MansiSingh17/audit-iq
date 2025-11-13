import redis
import json
from app.config import Config
from app.utils.logger import get_logger

logger = get_logger(__name__)

class CacheManager:
    """Redis cache manager"""
    
    def __init__(self):
        try:
            self.redis_client = redis.Redis(
                host=Config.REDIS_HOST,
                port=Config.REDIS_PORT,
                db=Config.REDIS_DB,
                decode_responses=True
            )
            self.ttl = Config.CACHE_TTL
            logger.info('Redis cache connected successfully')
        except Exception as e:
            logger.warning(f'Redis connection failed: {str(e)}. Caching disabled.')
            self.redis_client = None
    
    def get(self, key):
        """Get value from cache"""
        if not self.redis_client:
            return None
        
        try:
            value = self.redis_client.get(key)
            if value:
                logger.debug(f'Cache hit for key: {key}')
                return json.loads(value)
            logger.debug(f'Cache miss for key: {key}')
            return None
        except Exception as e:
            logger.error(f'Cache get error: {str(e)}')
            return None
    
    def set(self, key, value):
        """Set value in cache"""
        if not self.redis_client:
            return False
        
        try:
            self.redis_client.setex(
                key,
                self.ttl,
                json.dumps(value)
            )
            logger.debug(f'Cached key: {key}')
            return True
        except Exception as e:
            logger.error(f'Cache set error: {str(e)}')
            return False
    
    def delete(self, key):
        """Delete key from cache"""
        if not self.redis_client:
            return False
        
        try:
            self.redis_client.delete(key)
            logger.debug(f'Deleted cache key: {key}')
            return True
        except Exception as e:
            logger.error(f'Cache delete error: {str(e)}')
            return False
    
    def clear_all(self):
        """Clear all cache"""
        if not self.redis_client:
            return False
        
        try:
            self.redis_client.flushdb()
            logger.info('Cleared all cache')
            return True
        except Exception as e:
            logger.error(f'Cache clear error: {str(e)}')
            return False