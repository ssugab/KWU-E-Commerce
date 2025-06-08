import jwt from 'jsonwebtoken';
import userModel from '../models/User.js';

// Middleware untuk user authentication
const auth = async (req, res, next) => {
  try {
    // Ambil token dari header
    const token = req.headers.authorization?.split(' ')[1] || req.headers.token;

    if (!token) {
      return res.json({ success: false, message: 'No token provided, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tambahkan user info ke request
    req.user = { userId: decoded.id };
    
    next();
  } catch (error) {
    console.log('Auth middleware error:', error);
    return res.json({ success: false, message: 'Token is not valid' });
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
      return res.json({success: false, message: 'Authentication Failed: No token provided'});
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if(decodedToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
      return res.json({success: false, message: 'Authentication Failed: Not Authorized'});
    }

    next();
  } catch (error) {
    console.log(error);
    return res.json({success: false, message: error.message});
  }
}

export { auth, protect, admin };