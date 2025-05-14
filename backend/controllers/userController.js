import userModel from '../models/User.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET)
}

// Login User Route
const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    console.log('Login attempt for email:', email);
    console.log('Input password:', password);

    // Check if user exists
    const user = await userModel.findOne({email});
    if(!user) {
      console.log('User not found:', email);
      return res.json({success:false, message:"User does not exist"})
    }
    
    console.log('User found, stored hashed password:', user.password);
    console.log('Comparing passwords...');
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordCorrect);
    
    if(isPasswordCorrect) {
      const token = createToken(user._id);
      console.log('Login successful, token generated');
      res.json({success:true, message:"Login successful", token})
    }
    else {
      console.log('Password incorrect for user:', email);
      return res.json({success:false, message:"Password is incorrect"})
    }
  } catch (error) {
    console.log('Login error:', error);
    res.json({success:false, message:error.message})
  }
}

// Sign Up User Route
const signUpUser = async (req, res) => {
    try {
        const {name, email, phone, password} = req.body;  
        console.log('Signup attempt for email:', email);
        console.log('Input password:', password);

        // Check if user already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser){
          console.log('User already exists:', email);
          return res.json({success:false, message:"User already exists"})
        }

        // Validate input
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
        console.log('Generated salt:', salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hashed password:', hashedPassword);
       
        // Create new user
        const newUser = new userModel({
          name,
          email,
          phone,
          password: hashedPassword
        }) 
        
        // Save user to database
        const user = await newUser.save(); 
        console.log('User saved successfully:', email);
        console.log('Stored hashed password:', user.password);

        const token = createToken(user._id);
        res.json({success:true, message:"User created successfully", token})

    } catch (error) {
        console.log('Signup error:', error);
        res.json({success:false, message:error.message})
    }
}

// Logout User Route
const logOutUser = async (req, res) => {

}

// Admin Login Route
const adminLogin = async (req, res) => {

}

export { loginUser, signUpUser, adminLogin}