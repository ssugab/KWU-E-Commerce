import jwt from 'jsonwebtoken';
import redisAuth from '../services/redisAuth.js';

/**
 * AUTH MIDDLEWARE
 * 
 * Fungsi yang disederhanakan untuk e-commerce mahasiswa:
 * 1. Validasi JWT token
 * 2. Cek session di Redis (untuk cart persistence)
 * 3. Role-based authorization (admin vs mahasiswa)
 * 
 * Fitur yang dihapus:
 * - Token blacklisting: Kompleks dan tidak perlu
 * - Rate limiting: Mahasiswa tidak akan attack
 * - Activity tracking: Tidak diperlukan
 * - Refresh token validation: Token 24 jam cukup
 * 
 *  * Fungsi untuk e-commerce mahasiswa dengan security yang tepat:
 * 1. Validasi JWT token (15 menit untuk security)
 * 2. Cek token blacklist (untuk logout yang immediate)
 * 3. Cek session di Redis (untuk cart persistence)
 * 4. Role-based authorization (admin vs mahasiswa)
 * 5. Support refresh token (7 hari untuk UX yang baik)
 */

// 🔐 Main Auth Middleware
const auth = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    // Get token from header
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token diperlukan untuk akses' 
      });
    }

    // 🚫 STEP 1: Check if token is blacklisted (immediate logout)
    const isBlacklisted = await redisAuth.isTokenBlacklisted(token);
    if (isBlacklisted) {
      console.log('❌ Token is blacklisted (user logged out)');
      return res.status(401).json({ 
        success: false, 
        message: 'Token sudah tidak valid, silakan login ulang' 
      });
    }

    // 🎫 STEP 2: Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token tidak valid' 
      });
    }

    // 💾 STEP 3: Check session in Redis (untuk cart persistence)
    const sessionResult = await redisAuth.getSession(userId);
    
    if (sessionResult.success) {
      // Jika ada session, gunakan data dari Redis
      req.user = {
        userId: sessionResult.session.userId,
        email: sessionResult.session.email,
        name: sessionResult.session.name,
        role: sessionResult.session.role,
        npm: sessionResult.session.npm,
        phone: sessionResult.session.phone
      };
    } else {
      // Jika tidak ada session, tetap lanjut dengan data dari token
      req.user = { 
        userId: userId,
        id: userId // Compatibility
      };
    }
    
    next();

  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token tidak valid' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token sudah expired, silakan refresh atau login ulang',
        needRefresh: true // Frontend bisa handle refresh token
      });
    }
    
    return res.status(401).json({ success: false, message: 'Autentikasi gagal' });
  }
};

// 👑 Admin Role Check Middleware
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Autentikasi diperlukan' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Akses admin diperlukan' 
      });
    }

    next();
  } catch (error) {
    console.error('❌ Admin middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// 🔄 Refresh Token Validation Middleware
const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Refresh token diperlukan' 
      });
    }

    // Decode refresh token untuk get userId
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Validate refresh token in Redis
    const validation = await redisAuth.validateRefreshToken(userId, refreshToken);
    
    if (!validation.success) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token tidak valid' 
      });
    }

    req.user = { userId };
    next();

  } catch (error) {
    console.error('❌ Refresh token validation error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token tidak valid' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Legacy support - protect middleware (untuk backward compatibility)
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if(!token){
      res.status(401);
      throw new Error('Authentication Failed: No token provided');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    if(!decodedToken){
      res.status(401);
      throw new Error('Authentication Failed: Invalid token');
    }

    next();
  }
  catch(error){
    res.status(401);
    throw new Error('Authentication Failed: Invalid token');
  }
}

// Legacy admin middleware (untuk backward compatibility)
const admin = (req, res, next) => {
  try {
    const { token } = req.headers

    if(!token){
      return res.status(401).json({success: false, message: 'Authentication Failed: No token provided'});
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if(decodedToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
      return res.status(403).json({success: false, message: 'Authentication Failed: Not Authorized'});
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({success: false, message: error.message});
  }
}

export { auth, requireAdmin, validateRefreshToken, protect, admin };