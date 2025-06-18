import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config();

// Config Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Create Redis instance
export const redis = new Redis(process.env.REDIS_URL || redisConfig);

// Event handlers for monitoring
redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('ready', () => {
  console.log('Redis is ready to accept commands');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error.message);
});

redis.on('close', () => {
  console.log('Redis connection closed');
});

redis.on('reconnecting', () => {
  console.log('🔄 Redis reconnecting...');
});

export default redis;
