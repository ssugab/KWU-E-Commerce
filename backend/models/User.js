import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  npm: {
    type: String,
    required: [true, 'NPM is required'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  cartData: [ 
    {
      quantity:{
        type: Number,
      },
      product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    },
  ],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
}, {minimize: false});

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel; 