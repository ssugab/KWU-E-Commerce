import userModel from '../models/User.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import redisAuth from '../services/redisAuth.js';
import crypto from 'crypto';

const createToken = (id) => {
  const accessToken = jwt.sign({userId: id}, process.env.JWT_SECRET, {expiresIn: '15m'});
  const refreshToken = jwt.sign({userId: id}, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, {expiresIn: '7d'});

  return { accessToken, refreshToken };
}

const setCookies = (res, accessToken, refreshToken) => {
  // 🍪 Set cookies untuk security (akan muncul di Postman)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,    // Tidak bisa diakses JavaScript (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only di production
    sameSite: 'lax',   // CSRF protection
    maxAge: 15 * 60 * 1000 // 15 menit
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
  });
}

// Login User Route
const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await userModel.findOne({email});
    if(!user) {
      console.error('User not found:', email);
      return res.json({success:false, message:"User does not exist"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if(isPasswordCorrect) {
      const tokens = createToken(user._id);
      
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

      setCookies(res, tokens.accessToken, tokens.refreshToken);
      res.json({
        success: true, 
        message: "Login successful",
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

// Register User Route
const registerUser = async (req, res) => {
    try {
        const {name, npm, email, phone, password, role} = req.body;

        const existingUserByEmail = await userModel.findOne({email});
        if(existingUserByEmail){
          console.log('User already exists with email:', email);
          return res.json({success:false, message:"User already exists with this email"})
        }

        const existingUserByNpm = await userModel.findOne({npm});
        if(existingUserByNpm){
          console.log('User already exists with NPM:', npm);
          return res.json({success:false, message:"User already exists with this NPM"})
        }

        if(!name || name.trim().length < 2){
          return res.json({success:false, message:"Name must be at least 2 characters long"})
        }
        
        if(!npm || npm.length < 8){
          return res.json({success:false, message:"NPM must be at least 8 characters long"})
        }
        
        if(!validator.isEmail(email)){
          return res.json({success:false, message:"Enter a valid email"})
        }
        if(password.length < 6){
          return res.json({success:false, message:"Password must be at least 6 characters long"})
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

        setCookies(res, tokens.accessToken, tokens.refreshToken);

        res.json({
          success: true, 
          message: "User berhasil dibuat", 
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: userData
        });

    } catch (error) {
        console.log('Register error:', error);
        res.json({success:false, message:error.message})
    }
}

// Logout User Route
const logOutUser = async (req, res) => {
  try {
    const {userId} = req.user;
    
    // Get token from multiple sources (same as middleware)
    const token = req.headers.authorization?.split(' ')[1] || 
                  req.headers.token || 
                  req.cookies?.accessToken;

    if (!userId) {
      return res.json({success: false, message: "User ID not found"});
    }

    await redisAuth.deleteSession(userId);
    
    if (token) {
      await redisAuth.blacklistToken(token);
    }

    await redisAuth.deleteRefreshToken(userId);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    console.log('✅ Logout successful with token blacklist for user:', userId);
    res.json({
      success: true, 
      message: "Logout successful"
    });

  } catch (error) {
    console.error('❌ logout error:', error);
    res.json({success: false, message: error.message});
  }
}

// Get User Profile Route
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID not found"
      });
    }

    const cachedUser = await redisAuth.getCachedUser(userId);
    
    if (cachedUser.success) {
      return res.json({
        success: true,
        user: cachedUser.data
      });
    }

    // If not in cache, get from database 
    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false, 
        message: "User not found"
      });
    }
    
    const userData = {
      email: user.email,
      name: user.name,
      role: user.role,
      npm: user.npm,
      phone: user.phone
    };
    
    await redisAuth.cacheUser(userId, userData);
    
    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('❌ Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change Password Route
const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the old password"
      });
    }

    // Get user from database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    await userModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword
    });

    console.log('✅ Password changed successfully for user:', user.email);
    
    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Admin Login Route
const adminLogin = async (req, res) => {
  try {
    const {email, password} = req.body;

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
      const tokens = createToken('admin');
      
      const adminData = {
        email: process.env.ADMIN_EMAIL,
        name: 'Admin User',
        role: 'admin',
        npm: 'ADMIN',
        phone: 'ADMIN'
      };

      await redisAuth.saveSession('admin', adminData, tokens);
      await redisAuth.saveRefreshToken('admin', tokens.refreshToken);
      await redisAuth.cacheUser('admin', adminData);

      setCookies(res, tokens.accessToken, tokens.refreshToken);

      console.log('✅ Admin login successful with cookies and Redis session');
      res.json({
        success: true, 
        message: "Admin login berhasil", 
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: adminData
      });
    }
    else {
      console.log('Invalid admin credentials:', email);
      res.json({success: false, message: "Invalid Admin Credentials"})
    }
  } catch (error) {
    console.error('Admin login error:', error);
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

// Forgot Password Route
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User with this email does not exist" });
    }

    // Generate reset token (simple 6-digit code)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset token to user
    await userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    console.log(`✅ Reset token generated for ${email}: ${resetToken}`);
    
    // For now, we'll return the token in response (in production, send via email)
    res.json({
      success: true,
      message: "Reset code generated successfully",
      resetToken: resetToken, // Remove this in production ------
      email: email
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Reset Password Route
const resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.json({ 
        success: false, 
        message: "Email, reset code, and new password are required" 
      });
    }

    if (newPassword.length < 6) {
      return res.json({ 
        success: false, 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Find user with valid reset token
    const user = await userModel.findOne({
      email: email,
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({ 
        success: false, 
        message: "Invalid or expired reset code" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    console.log(`✅ Password reset successful for ${email}`);

    res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.json({ success: false, message: error.message });
  }
};

export { 
  loginUser, 
  registerUser, 
  logOutUser, 
  adminLogin, 
  getUserProfile,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword
}