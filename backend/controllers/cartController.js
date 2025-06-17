import cartModel from '../models/Cart.js';

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.user.userId;

    if (userId === 'admin') {
      return res.json({ 
        success: false, 
        message: 'Admin cannot add item to cart'
      });
    }

    if (!productId || !quantity) {
      return res.json({ success: false, message: 'Product ID dan quantity harus diisi' });
    }

    // Find existing cart for user
    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      // If cart doesn't exist, create new cart
      cart = new cartModel({
        userId,
        products: [{
          productId,
          size: size || 'default',
          quantity
        }]
      });
    } else {
      // Check if product with same size already exists
      const existingProductIndex = cart.products.findIndex(
        item => item.productId.toString() === productId && item.size === (size || 'default')
      );

      if (existingProductIndex > -1) {
        // If already exists, add quantity
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // If not exists, add new product
        cart.products.push({
          productId,
          size: size || 'default',
          quantity
        });
      }
    }

    await cart.save();
    await cart.populate('products.productId');

    res.json({ 
      success: true, 
      message: 'Product added to cart successfully',
      cart 
    });

  } catch (error) {
    console.log('Error adding to cart:', error);
    res.json({ success: false, message: error.message });
  }
};

// Get cart user
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (userId === 'admin') {
      return res.json({ 
        success: true, 
        cart: { products: [] },
        message: 'Admin does not have cart'
      });
    }

    const cart = await cartModel.findOne({ userId }).populate('products.productId');

    if (!cart) {
      return res.json({ 
        success: true, 
        cart: { products: [] },
        message: 'Cart is empty'
      });
    }

    res.json({ 
      success: true, 
      cart 
    });

  } catch (error) {
    console.log('Error getting cart:', error);
    res.json({ success: false, message: error.message });
  }
};

// Update quantity item in cart
const updateCartQuantity = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.user.userId;

    // ✅ Validation for admin user
    if (userId === 'admin') {
      return res.json({ 
        success: false, 
        message: 'Admin cannot update cart'
      });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.json({ success: false, message: 'Cart Not Found' });
    }

    const productIndex = cart.products.findIndex(
      item => item.productId.toString() === productId && item.size === (size || 'default')
    );

    if (productIndex === -1) {
      return res.json({ success: false, message: 'Product Not Found in Cart' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.products.splice(productIndex, 1);
    } else {
      // Update quantity
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('products.productId');

    res.json({ 
      success: true, 
      message: 'Cart updated successfully',
      cart 
    });

  } catch (error) {
    console.log('Error updating cart:', error);
    res.json({ success: false, message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.user.userId;

    // ✅ Validation for admin user
    if (userId === 'admin') {
      return res.json({ 
        success: false, 
        message: 'Admin cannot remove item from cart'
      });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.json({ success: false, message: 'Cart Not Found' });
    }

    cart.products = cart.products.filter(
      item => !(item.productId.toString() === productId && item.size === (size || 'default'))
    );

    await cart.save();
    await cart.populate('products.productId');

    res.json({ 
      success: true, 
      message: 'Item removed from cart',
      cart 
    });

  } catch (error) {
    console.log('Error removing from cart:', error);
    res.json({ success: false, message: error.message });
  }
};

// Remove all items from cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    // ✅ Validation for admin user
    if (userId === 'admin') {
      return res.json({ 
        success: false, 
        message: 'Admin cannot clear cart'
      });
    }

    await cartModel.findOneAndUpdate(
      { userId },
      { products: [] },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Cart cleared successfully' 
    });

  } catch (error) {
    console.log('Error clearing cart:', error);
    res.json({ success: false, message: error.message });
  }
};

export { 
  addToCart, 
  getCart, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart 
};
