import userModel from '../models/User.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const createToken = (id) => {
  return jwt.sign({userId: id}, process.env.JWT_SECRET)
}

// Login User Route
const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    // Check if user exists
    const user = await userModel.findOne({email});
    if(!user) {
      console.error('User not found:', email);
      return res.json({success:false, message:"User does not exist"})
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    
    if(isPasswordCorrect) {
      const token = createToken(user._id);
      console.log('Login successful, token generated');
      console.log('User role:', user.role);
      res.json({success:true, message:"Login successful", token})
    }
    else {
      console.log('Password incorrect for user:', email);
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

        const token = createToken(user._id);
        res.json({success:true, message:"User created successfully", token})

    } catch (error) {
        console.log('Signup error:', error);
        res.json({success:false, message:error.message})
    }
}

// Logout User Route
const logOutUser = async (req, res) => {
  try {
    const {userId} = req.user;

  } catch (error) {
    
  }
}

// Get User Profile Route
const getUserProfile = async (req, res) => { 
  try {
    const {userId} = req.user;
    const user = await userModel.findById(userId).select('-password');
    
    if (!user) {
      return res.json({success: false, message: "User not found"});
    }
    
    res.json({
      success: true, 
      name: user.name, 
      npm: user.npm, 
      email: user.email, 
      phone: user.phone, 
      role: user.role
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
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({success: true, message: "Admin Login Success", token})
    }
    else {
      res.json({success: false, message: "Invalid Admin Credentials"})
    }
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

export { loginUser, signUpUser, adminLogin, getUserProfile}