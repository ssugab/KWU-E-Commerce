import jwt from 'jsonwebtoken';

// Middleware for user authentication
const auth = async (req, res, next) => {
  try {
    // Check if JWT_SECRET is available
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ success: false, message: 'Server configuration error' });
    }

    // Get token from header
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
    
    //console.log('🔍 Auth middleware - Authorization header:', req.headers.authorization);
    //console.log('🔍 Auth middleware - Token:', token ? `${token.substring(0, 20)}...` : 'No token');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log('✅ Token decoded successfully:', { userId: decoded.userId });

    // Add user info to request
    req.user = { 
      userId: decoded.userId || decoded.id,  // Support both formats
      id: decoded.userId || decoded.id       // Compatibility dengan kode yang menggunakan req.user.id
    };
    
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

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

export { auth, protect, admin };