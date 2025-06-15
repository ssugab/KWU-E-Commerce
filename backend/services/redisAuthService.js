import { redis } from '../config/redis.js';
import jwt from 'jsonwebtoken';

class RedisAuthService {
  // Save user session to Redis
  async createSession(userId, userData, tokenData) {
    try {
      const sessionKey = `session:${userId}`;
      const sessionData = {
        userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        loginTime: new Date().toISOString(),
        tokenId: tokenData.jti, // JWT ID for tracking
        lastActivity: new Date().toISOString()
      };

      // Save session with 24 hour expiry
      await redis.setex(sessionKey, 86400, JSON.stringify(sessionData));
      
      // Save token mapping to userId for blacklisting
      const tokenKey = `token:${tokenData.jti}`;
      await redis.setex(tokenKey, 86400, userId);

      return { success: true, sessionData };
    } catch (error) {
      console.error('❌ Redis createSession error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get user session from Redis
  async getSession(userId) {
    try {
      const sessionKey = `session:${userId}`;
      const sessionData = await redis.get(sessionKey);
      
      if (!sessionData) {
        return { success: false, message: 'Session not found' };
      }

      const parsed = JSON.parse(sessionData);
      
      // Update last activity time
      parsed.lastActivity = new Date().toISOString();
      await redis.setex(sessionKey, 86400, JSON.stringify(parsed));

      return { success: true, session: parsed };
    } catch (error) {
      console.error('❌ Redis getSession error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete session (logout)
  async destroySession(userId, tokenId) {
    try {
      const sessionKey = `session:${userId}`;
      const tokenKey = `token:${tokenId}`;
      
      // Delete session
      await redis.del(sessionKey);
      
      // Blacklist token (save with TTL same as token expiry)
      const blacklistKey = `blacklist:${tokenId}`;
      await redis.setex(blacklistKey, 86400, 'blacklisted');
      
      // Delete token mapping
      await redis.del(tokenKey);

      return { success: true };
    } catch (error) {
      console.error('❌ Redis destroySession error:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if token is blacklisted
  async isTokenBlacklisted(tokenId) {
    try {
      const blacklistKey = `blacklist:${tokenId}`;
      const result = await redis.get(blacklistKey);
      return result !== null;
    } catch (error) {
      console.error('❌ Redis isTokenBlacklisted error:', error);
      return false; // Default allow if Redis error
    }
  }

  // Rate limiting for login attempts
  async checkLoginAttempts(email) {
    try {
      const key = `login_attempts:${email}`;
      const attempts = await redis.get(key);
      
      if (!attempts) {
        return { success: true, attempts: 0 };
      }

      const count = parseInt(attempts);
      if (count >= 5) {
        const ttl = await redis.ttl(key);
        return { 
          success: false, 
          message: `Too many login attempts. Try again in ${Math.ceil(ttl/60)} minutes`,
          attempts: count 
        };
      }

      return { success: true, attempts: count };
    } catch (error) {
      console.error('❌ Redis checkLoginAttempts error:', error);
      return { success: true, attempts: 0 }; // Default allow jika Redis error
    }
  }

  // Increment login attempts counter
  async incrementLoginAttempts(email) {
    try {
      const key = `login_attempts:${email}`;
      const current = await redis.incr(key);
      
      if (current === 1) {
        // Set expiry 15 minutes for first attempt
        await redis.expire(key, 900);
      }

      return current;
    } catch (error) {
      console.error('❌ Redis incrementLoginAttempts error:', error);
      return 0;
    }
  }

  // Reset login attempts after successful login
  async resetLoginAttempts(email) {
    try {
      const key = `login_attempts:${email}`;
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('❌ Redis resetLoginAttempts error:', error);
      return false;
    }
  }

  // Cache user data untuk performa
  async cacheUserData(userId, userData) {
    try {
      const cacheKey = `user_cache:${userId}`;
      await redis.setex(cacheKey, 3600, JSON.stringify(userData)); // Cache 1 jam
      return true;
    } catch (error) {
      console.error('❌ Redis cacheUserData error:', error);
      return false;
    }
  }

  // Ambil cached user data
  async getCachedUserData(userId) {
    try {
      const cacheKey = `user_cache:${userId}`;
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }
      
      return { success: false, message: 'Cache not found' };
    } catch (error) {
      console.error('❌ Redis getCachedUserData error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get active sessions count (untuk monitoring)
  async getActiveSessionsCount() {
    try {
      const keys = await redis.keys('session:*');
      return keys.length;
    } catch (error) {
      console.error('❌ Redis getActiveSessionsCount error:', error);
      return 0;
    }
  }
}

export default new RedisAuthService(); 