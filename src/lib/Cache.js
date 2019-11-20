import Redis from 'ioredis';
import redisConfig from '../config/redis';

class Cache {
  constructor() {
    this.redis = new Redis({
      ...redisConfig,
      keyPrefix: 'cache:',
    });
  }

  set(key, value) {
    // expira em 24h
    return this.redis.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24);
  }

  async get(key) {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    return this.redis.del(key);
  }
}

export default new Cache();
