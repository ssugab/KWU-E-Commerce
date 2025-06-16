import { redis } from '../config/redis.js';
class RedisAuth {
  async saveSession(userId, userData, tokens) {
    try {
      const sessionKey = `session:${userId}`;
      const sessionData = {
        userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        npm: userData.npm,
        phone: userData.phone,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      // TTL 7 hari (604800 detik) - sesuai refresh token
      await redis.setex(sessionKey, 604800, JSON.stringify(sessionData));
      
      console.log(`✅ Session saved for user: ${userData.email}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Save session error:', error);
      return { success: false, error: error.message };
    }
  }

  async getSession(userId) {
    try {
      const sessionKey = `session:${userId}`;
      const sessionData = await redis.get(sessionKey);
      
      if (!sessionData) {
        return { success: false, message: 'Session not found' };
      }

      const parsed = JSON.parse(sessionData);
      
      // Update last activity
      parsed.lastActivity = new Date().toISOString();
      await redis.setex(sessionKey, 604800, JSON.stringify(parsed));

      return { success: true, session: parsed };
    } catch (error) {
      console.error('❌ Get session error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteSession(userId) {
    try {
      const sessionKey = `session:${userId}`;
      await redis.del(sessionKey);
      
      console.log(`✅ Session deleted for user: ${userId}`); //Log Out
      return { success: true };
    } catch (error) {
      console.error('❌ Delete session error:', error);
      return { success: false, error: error.message };
    }
  }


  async blacklistToken(token) {
    try {
      const blacklistKey = `blacklist:${token}`;
      await redis.setex(blacklistKey, 900, 'blacklisted'); // 15 minutes
      
      console.log('✅ Token blacklisted for immediate logout');
      return { success: true };
    } catch (error) {
      console.error('❌ Blacklist token error:', error);
      return { success: false, error: error.message };
    }
  }

  async isTokenBlacklisted(token) {
    try {
      const blacklistKey = `blacklist:${token}`;
      const result = await redis.get(blacklistKey);
      return result !== null; // true if exists (blacklisted)
    } catch (error) {
      console.error('❌ Check blacklist error:', error);
      return false; // Default allow if Redis error
    }
  }

  async saveRefreshToken(userId, refreshToken) {
    try {
      const refreshKey = `refresh:${userId}`;
      await redis.setex(refreshKey, 604800, refreshToken); // 7 days
      return { success: true };
    } catch (error) {
      console.error('❌ Save refresh token error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate Refresh Token
   * Needed to generate new access token
   */
  async validateRefreshToken(userId, refreshToken) {
    try {
      const refreshKey = `refresh:${userId}`;
      const storedToken = await redis.get(refreshKey);
      
      if (!storedToken || storedToken !== refreshToken) {
        return { success: false, message: 'Invalid refresh token' };
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Validate refresh token error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteRefreshToken(userId) {
    try {
      const refreshKey = `refresh:${userId}`;
      await redis.del(refreshKey);
      return { success: true }; // Log Out
    } catch (error) {
      console.error('❌ Delete refresh token error:', error);
      return { success: false, error: error.message };
    }
  }

  async cacheUser(userId, userData) {
    try {
      const cacheKey = `user:${userId}`;
      await redis.setex(cacheKey, 3600, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('❌ Cache user error:', error);
      return false;
    }
  }

  async getCachedUser(userId) {
    try {
      const cacheKey = `user:${userId}`;
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        return { success: true, data: JSON.parse(cached) };
      }
      
      return { success: false, message: 'Cache not found' };
    } catch (error) {
      console.error('❌ Get cached user error:', error);
      return { success: false, error: error.message };
    }
  }



}

export default new RedisAuth(); 