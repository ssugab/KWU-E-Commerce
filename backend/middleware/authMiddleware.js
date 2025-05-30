import User from '../models/User.js';
import jwt from 'jsonwebtoken';

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
  
}
  catch(error){
    res.status(401);
    throw new Error('Authentication Failed: Invalid token');
  }
}

const admin = (req, res, next) => {}

export { protect, admin };