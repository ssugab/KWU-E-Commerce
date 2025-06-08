import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
  }
}, {
  timestamps: true
}, {minimize: false});

// Hash password sebelum disimpan
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Method untuk verifikasi password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

const userModel = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel; 