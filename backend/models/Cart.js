import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      size: {
        type: String,
        default: 'default'
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
        
}, {
  timestamps: true
})

const cartModel = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default cartModel;