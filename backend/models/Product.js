const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  size: {
    type: Array,
    required: true
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