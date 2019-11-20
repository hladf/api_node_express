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

  async invalidatePrefix(prefix) {
    // o metodo 'keys' não pega o keyPrefix configurado la em cima, por isso
    // foi necessario adicionar aqui tb.
    const keys = await this.redis.keys(`cache:${prefix}:*`);

    // é preciso retirar o keyPrefix das keys retornadas, pois o 'del'
    // pega o keyPrefix da config
    const keysWithoutPrefix = keys.map(key => key.replace('cache:', ''));

    return this.redis.del(keysWithoutPrefix);
  }
}

export default new Cache();
