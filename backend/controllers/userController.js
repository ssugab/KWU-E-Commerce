import userModel from '../models/User.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import redisAuth from '../services/redisAuth.js';

const createToken = (id) => {
  // Access token: 15 menit untuk security
  const accessToken = jwt.sign({userId: id}, process.env.JWT_SECRET, {expiresIn: '15m'});
  
  // Refresh token: 7 hari untuk UX yang baik
  const refreshToken = jwt.sign({userId: id}, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, {expiresIn: '7d'});

  return {accessToken, refreshToken};
}

// Login User Route
const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    // 👤 STEP 1: Check if user exists
    const user = await userModel.findOne({email});
    if(!user) {
      console.error('User not found:', email);
      return res.json({success:false, message:"User does not exist"})
    }

    // 🔐 STEP 2: Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if(isPasswordCorrect) {
      // 🎫 STEP 3: Generate tokens (access 15 menit + refresh 7 hari)
      const tokens = createToken(user._id);
      
      // 💾 STEP 4: Save session to Redis dengan tokens
      const userData = {
        email: user.email,
        name: user.name,
        role: user.role,
        npm: user.npm,
        phone: user.phone
      };

      await redisAuth.saveSession(user._id.toString(), userData, tokens);
      await redisAuth.saveRefreshToken(user._id.toString(), tokens.refreshToken);
      await redisAuth.cacheUser(user._id.toString(), userData);

      console.log('✅ Login successful with refresh token for:', user.email);
      
      res.json({
        success: true, 
        message: "Login berhasil", 
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: userData
      });

    } else {
      console.log('❌ Password incorrect for user:', email);
      return res.json({success:false, message:"Password is incorrect"})
    }
  } catch (error) {
    console.error('Login error:', error);
    res.json({success:false, message:error.message})
  }
}

// Sign Up User Route
const signUpUser = async (req, res) => {
    try {
        const {name, npm, email, phone, password, role} = req.body;

        // Check if user already exists by email
        const existingUserByEmail = await userModel.findOne({email});
        if(existingUserByEmail){
          console.log('User already exists with email:', email);
          return res.json({success:false, message:"User already exists with this email"})
        }

        // Check if user already exists by npm
        const existingUserByNpm = await userModel.findOne({npm});
        if(existingUserByNpm){
          console.log('User already exists with NPM:', npm);
          return res.json({success:false, message:"User already exists with this NPM"})
        }

        // Validate input
        if(!name || name.trim().length < 2){
          return res.json({success:false, message:"Name must be at least 2 characters long"})
        }
        
        if(!npm || npm.length < 8){
          return res.json({success:false, message:"NPM must be at least 8 characters long"})
        }
        
        if(!validator.isEmail(email)){
          return res.json({success:false, message:"Enter a valid email"})
        }
        if(password.length < 8){
          return res.json({success:false, message:"Password must be at least 8 characters long"})
        }
        
        if(!validator.isMobilePhone(phone)){
          return res.json({success:false, message:"Enter a valid phone number"})
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
       
        // Create new user with all fields
        const newUser = new userModel({
          name: name.trim(),
          npm,
          email: email.toLowerCase(),
          phone,
          password: hashedPassword,
          role: role || 'user' // Default role is 'user' if not provided
        }) 
        
        // Save user to database
        const user = await newUser.save(); 
        console.log('User saved successfully:', email);

        // 🎫 Auto login setelah register - Generate tokens
        const tokens = createToken(user._id);
        
        // 💾 Save session to Redis dengan tokens
        const userData = {
          email: user.email,
          name: user.name,
          role: user.role,
          npm: user.npm,
          phone: user.phone
        };

        await redisAuth.saveSession(user._id.toString(), userData, tokens);
        await redisAuth.saveRefreshToken(user._id.toString(), tokens.refreshToken);
        await redisAuth.cacheUser(user._id.toString(), userData);

        res.json({
          success: true, 
          message: "User berhasil dibuat", 
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: userData
        });

    } catch (error) {
        console.log('Signup error:', error);
        res.json({success:false, message:error.message})
    }
}

// Logout User Route - With Token Blacklisting
const logOutUser = async (req, res) => {
  try {
    const {userId} = req.user;
    const token = req.headers.authorization?.split(' ')[1];

    if (!userId) {
      return res.json({success: false, message: "User ID not found"});
    }

    // 🗑️ STEP 1: Delete session dari Redis
    await redisAuth.deleteSession(userId);

    // 🚫 STEP 2: Blacklist current access token (immediate logout)
    if (token) {
      await redisAuth.blacklistToken(token);
    }

    // 🗄️ STEP 3: Delete refresh token
    await redisAuth.deleteRefreshToken(userId);

    console.log('✅ Logout successful with token blacklist for user:', userId);
    res.json({
      success: true, 
      message: "Logout berhasil"
    });

  } catch (error) {
    console.error('❌ logout error:', error);
    res.json({success: false, message: error.message});
  }
}

// Get User Profile Route
const getUserProfile = async (req, res) => { 
  try {
    const {userId} = req.user;
    
    // 🚀 STEP 1: Try to get from Redis cache first (SUPER FAST!)
    const cachedResult = await redisAuth.getCachedUser(userId);
    
    if (cachedResult.success) {
      // console.log('⚡ Profile from Redis cache');
      return res.json({
        success: true, 
        ...cachedResult.data
      });
    }

    // 🐌 STEP 2: If not in cache, get from database (slower)
    console.log('🔍 Profile not in cache, loading from database...');
    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      return res.json({success: false, message: "User not found"});
    }
    
    const userData = {
      name: user.name, 
      npm: user.npm, 
      email: user.email, 
      phone: user.phone, 
      role: user.role
    };

    // 📦 STEP 3: Cache for next time
    await redisAuth.cacheUser(userId, userData);
    console.log('💾 Profile cached to Redis for next time');
    
    res.json({
      success: true, 
      ...userData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.json({success: false, message: error.message});    
  }
}

// Admin Login Route
const adminLogin = async (req, res) => {
  try {
    const {email, password} = req.body;

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      // Generate tokens untuk admin juga
      const tokens = createToken('admin');
      
      // 💾 Save admin session to Redis
      const adminData = {
        email: process.env.ADMIN_EMAIL,
        name: 'Admin User',
        role: 'admin',
        npm: 'ADMIN',
        phone: 'ADMIN'
      };

      await redisAuth.saveSession('admin', adminData, tokens);
      await redisAuth.saveRefreshToken('admin', tokens.refreshToken);

      console.log('✅ Admin login successful');
      res.json({
        success: true, 
        message: "Admin login berhasil", 
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: adminData
      });
    }
    else {
      res.json({success: false, message: "Invalid Admin Credentials"})
    }
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

// 🔄 NEW: Refresh Token Route
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const { userId } = req.user;

    if (!refreshToken) {
      return res.json({success: false, message: "Refresh token required"});
    }

    // 🔍 Validate refresh token in Redis
    const validation = await redisAuth.validateRefreshToken(userId, refreshToken);
    
    if (!validation.success) {
      return res.json({success: false, message: "Invalid refresh token"});
    }

    // 🎫 Generate new access token (15 menit baru)
    const newTokens = createToken(userId);

    // 💾 Update session dengan tokens baru
    const sessionResult = await redisAuth.getSession(userId);
    if (sessionResult.success) {
      const userData = {
        email: sessionResult.session.email,
        name: sessionResult.session.name,
        role: sessionResult.session.role,
        npm: sessionResult.session.npm,
        phone: sessionResult.session.phone
      };
      await redisAuth.saveSession(userId, userData, newTokens);
    }

    // 🗄️ Update refresh token in Redis
    await redisAuth.saveRefreshToken(userId, newTokens.refreshToken);

    console.log('✅ Token refreshed successfully for user:', userId);
    res.json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken
    });

  } catch (error) {
    console.error('❌ Refresh token error:', error);
    res.json({success: false, message: error.message});
  }
}

// 📊 Get Auth Stats (untuk monitoring sederhana)
const getAuthStats = async (req, res) => {
  try {
    const stats = await redisAuth.getStats();
    
    res.json({
      success: true,
      message: "Auth stats berhasil diambil",
      stats
    });
  } catch (error) {
    console.error('❌ Get auth stats error:', error);
    res.json({success: false, message: error.message});
  }
}

export { 
  loginUser, 
  signUpUser, 
  logOutUser, 
  adminLogin, 
  getUserProfile,
  refreshToken,
  getAuthStats
}