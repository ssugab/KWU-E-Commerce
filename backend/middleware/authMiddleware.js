import jwt from 'jsonwebtoken';
import redisAuth from '../services/redisAuth.js';

const auth = async (req, res, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    const token = req.headers.authorization?.split(' ')[1] || 
                  req.headers.token || 
                  req.cookies?.accessToken;
    
    if (!token) {
      console.log('❌ No token found in any source');
      return res.status(401).json({ 
        success: false, 
        message: 'Token is required for access' 
      });
    }

    const isBlacklisted = await redisAuth.isTokenBlacklisted(token);
      if (isBlacklisted) {
        console.log('❌ Token is blacklisted (user logged out)');
        return res.status(401).json({ 
          success: false, 
          message: 'Token is no longer valid, please login again' 
        });
      }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token is not valid' 
        });
      }

    const sessionResult = await redisAuth.getSession(userId);
    
      if (sessionResult.success) {
        // If there is a session, use data from Redis
        req.user = {
          userId: sessionResult.session.userId,
          email: sessionResult.session.email,
          name: sessionResult.session.name,
          role: sessionResult.session.role,
          npm: sessionResult.session.npm,
          phone: sessionResult.session.phone
        };
      } else {
      // If there is no session, continue with data from token
      req.user = { 
        userId: userId,
        id: userId // Compatibility
      };
    }
    
    next();

  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has expired, please refresh or login again',
        needRefresh: true // Frontend can handle refresh token
      });
    }
    
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

// Admin Role Check Middleware
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'You can only access this page if you are an admin' 
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

// Refresh Token Validation Middleware
const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Refresh token is required' 
      });
    }

    // Decode refresh token to get userId
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Validate refresh token in Redis
    const validation = await redisAuth.validateRefreshToken(userId, refreshToken);
    
    if (!validation.success) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token is not valid' 
      });
    }

    req.user = { userId };
    next();

  } catch (error) {
    console.error('❌ Refresh token validation error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token is not valid' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export { auth, requireAdmin, validateRefreshToken };