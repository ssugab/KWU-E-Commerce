import { redis } from '../config/redis.js';

/**
 * REDIS AUTH SERVICE
 * 
 * Fungsi untuk e-commerce mahasiswa dengan security yang tepat:
 * 1. Session Management - Untuk cart persistence dan login state
 * 2. User Caching - Untuk performa yang lebih baik
 * 3. Refresh Token - Security + UX yang baik (15 menit + 7 hari)
 * 4. Token Blacklist - Logout yang aman dan immediate
 * 5. Cart Persistence - Fitur utama e-commerce
 * 
 * Fitur yang dihapus dan alasannya:
 * - Token Blacklisting: Kompleks, tidak perlu untuk mahasiswa
 * - Rate Limiting: Mahasiswa tidak akan brute force
 * - Refresh Token: Membuat kode rumit, access token 24 jam cukup
 * - Activity Tracking: Monitoring tidak diperlukan
 * - Complex Statistics: Overkill untuk aplikasi sederhana
 *  Refresh token diperlukan karena:
 * - E-commerce butuh security yang baik (uang + data pribadi)
 * - User experience penting (mahasiswa tidak mau login terus)
 * - Multiple device usage (HP, laptop, komputer lab)
 * 
 * Token blacklist diperlukan karena:
 * - Logout harus immediate dan secure
 * - Mencegah token bekas dipakai lagi
 * - Multi-device logout capability
 */

class RedisAuth {
  
  // ==================== SESSION MANAGEMENT ====================
  
  /**
   * Simpan session user ke Redis
   * TTL: 7 hari (sesuai refresh token)
   */
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

  /**
   * Ambil session user dari Redis
   */
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

  /**
   * Hapus session (logout)
   */
  async deleteSession(userId) {
    try {
      const sessionKey = `session:${userId}`;
      await redis.del(sessionKey);
      
      console.log(`✅ Session deleted for user: ${userId}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Delete session error:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== TOKEN BLACKLISTING ====================
  
  /**
   * Blacklist token (saat logout)
   * Diperlukan untuk logout yang immediate dan secure
   * TTL: 15 menit (sesuai access token expiry)
   */
  async blacklistToken(token) {
    try {
      const blacklistKey = `blacklist:${token}`;
      await redis.setex(blacklistKey, 900, 'blacklisted'); // 15 menit
      
      console.log('✅ Token blacklisted for immediate logout');
      return { success: true };
    } catch (error) {
      console.error('❌ Blacklist token error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cek apakah token sudah di-blacklist
   * Diperlukan untuk security - token yang sudah logout tidak bisa dipakai
   */
  async isTokenBlacklisted(token) {
    try {
      const blacklistKey = `blacklist:${token}`;
      const result = await redis.get(blacklistKey);
      return result !== null; // true jika ada (blacklisted)
    } catch (error) {
      console.error('❌ Check blacklist error:', error);
      return false; // Default allow jika Redis error
    }
  }

  // ==================== REFRESH TOKEN MANAGEMENT ====================
  
  /**
   * Simpan refresh token
   * TTL: 7 hari - untuk UX yang baik
   */
  async saveRefreshToken(userId, refreshToken) {
    try {
      const refreshKey = `refresh:${userId}`;
      await redis.setex(refreshKey, 604800, refreshToken); // 7 hari
      return { success: true };
    } catch (error) {
      console.error('❌ Save refresh token error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validasi refresh token
   * Diperlukan untuk generate access token baru
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

  /**
   * Hapus refresh token (logout)
   */
  async deleteRefreshToken(userId) {
    try {
      const refreshKey = `refresh:${userId}`;
      await redis.del(refreshKey);
      return { success: true };
    } catch (error) {
      console.error('❌ Delete refresh token error:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== USER CACHING ====================
  
  /**
   * Cache user data untuk performa
   * TTL: 1 jam (cukup untuk reduce database calls)
   */
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

  /**
   * Ambil cached user data
   */
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

  // ==================== CART PERSISTENCE ====================
  
  /**
   * Simpan cart data untuk persistence
   * Khusus untuk e-commerce agar cart tidak hilang saat refresh
   */
  async saveCart(userId, cartData) {
    try {
      const cartKey = `cart:${userId}`;
      await redis.setex(cartKey, 604800, JSON.stringify(cartData)); // 7 hari
      return { success: true };
    } catch (error) {
      console.error('❌ Save cart error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Ambil cart data dari Redis
   */
  async getCart(userId) {
    try {
      const cartKey = `cart:${userId}`;
      const cartData = await redis.get(cartKey);
      
      if (cartData) {
        return { success: true, data: JSON.parse(cartData) };
      }
      
      return { success: false, message: 'Cart not found' };
    } catch (error) {
      console.error('❌ Get cart error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Hapus cart data (setelah checkout berhasil)
   */
  async clearCart(userId) {
    try {
      const cartKey = `cart:${userId}`;
      await redis.del(cartKey);
      return { success: true };
    } catch (error) {
      console.error('❌ Clear cart error:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== MONITORING (Optional) ====================
  
  /**
   * Get basic stats untuk monitoring
   * Simplified version - hanya yang penting
   */
  async getStats() {
    try {
      const [sessions, blacklisted, refreshTokens] = await Promise.all([
        redis.keys('session:*'),
        redis.keys('blacklist:*'),
        redis.keys('refresh:*')
      ]);

      return {
        activeSessions: sessions.length,
        blacklistedTokens: blacklisted.length,
        refreshTokens: refreshTokens.length
      };
    } catch (error) {
      console.error('❌ Get stats error:', error);
      return { activeSessions: 0, blacklistedTokens: 0, refreshTokens: 0 };
    }
  }
}

export default new RedisAuth(); 