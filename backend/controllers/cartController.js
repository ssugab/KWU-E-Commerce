import cartModel from '../models/Cart.js';
import userModel from '../models/User.js';

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.user.userId;

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
      // Cari apakah produk dengan size yang sama sudah ada
      const existingProductIndex = cart.products.findIndex(
        item => item.productId.toString() === productId && item.size === (size || 'default')
      );

      if (existingProductIndex > -1) {
        // Jika sudah ada, tambah quantity
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Jika belum ada, tambah produk baru
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
      message: 'Produk berhasil ditambahkan ke cart',
      cart 
    });

  } catch (error) {
    console.log('Error adding to cart:', error);
    res.json({ success: false, message: error.message });
  }
};

// Mendapatkan cart user
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await cartModel.findOne({ userId }).populate('products.productId');

    if (!cart) {
      return res.json({ 
        success: true, 
        cart: { products: [] },
        message: 'Cart kosong'
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

// Update quantity item di cart
const updateCartQuantity = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;
    const userId = req.user.userId;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.json({ success: false, message: 'Cart tidak ditemukan' });
    }

    const productIndex = cart.products.findIndex(
      item => item.productId.toString() === productId && item.size === (size || 'default')
    );

    if (productIndex === -1) {
      return res.json({ success: false, message: 'Produk tidak ditemukan di cart' });
    }

    if (quantity <= 0) {
      // Hapus item jika quantity 0 atau kurang
      cart.products.splice(productIndex, 1);
    } else {
      // Update quantity
      cart.products[productIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('products.productId');

    res.json({ 
      success: true, 
      message: 'Cart berhasil diupdate',
      cart 
    });

  } catch (error) {
    console.log('Error updating cart:', error);
    res.json({ success: false, message: error.message });
  }
};

// Menghapus item dari cart
const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    const userId = req.user.userId;

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.json({ success: false, message: 'Cart tidak ditemukan' });
    }

    cart.products = cart.products.filter(
      item => !(item.productId.toString() === productId && item.size === (size || 'default'))
    );

    await cart.save();
    await cart.populate('products.productId');

    res.json({ 
      success: true, 
      message: 'Item berhasil dihapus dari cart',
      cart 
    });

  } catch (error) {
    console.log('Error removing from cart:', error);
    res.json({ success: false, message: error.message });
  }
};

// Menghapus semua item dari cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    await cartModel.findOneAndUpdate(
      { userId },
      { products: [] },
      { new: true }
    );

    res.json({ 
      success: true, 
      message: 'Cart berhasil dikosongkan' 
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
