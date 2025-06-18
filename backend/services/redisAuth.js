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

      // TTL 7 days (604800 seconds)
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
      
      // Only update lastActivity every 5 minutes to reduce Redis writes
      const now = new Date().toISOString();
      const lastUpdate = new Date(parsed.lastActivity);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      if (lastUpdate < fiveMinutesAgo) {
        parsed.lastActivity = now;
        await redis.setex(sessionKey, 604800, JSON.stringify(parsed));
      }

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
      await redis.setex(blacklistKey, 3600, 'blacklisted'); // 1 hour
      
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

}

export default new RedisAuth(); 