import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: [true, "Please enter product description"]
  },
  price: {
    type: Number,
    required: true
  },
  images: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  sizes: {
    type: Array,
    required: false
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
}); 

const productModel = mongoose.models.Product || mongoose.model('Product', productSchema); 

export default productModel; 