import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/Product.js';

import dotenv from 'dotenv';

dotenv.config();

// Get All Products 
const getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      stock,
      highlight,
      hero,
      sort = 'createdAt',
      order = 'desc',
      status = 'active'
    } = req.query;

    // Build query
    const query = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    if (highlight !== undefined) {
      query.highlight = highlight === 'true';
    }
    if (hero !== undefined) {
      query.isHero = hero === 'true';
    }

    // Build sort
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    // Calculate pagination 
    const skip = (page - 1) * limit;

    // Get products with pagination
    const products = await productModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('name description price images sizes category stock highlight isHero status createdAt');

    // Get total count for pagination
    const total = await productModel.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
         total,
         page: parseInt(page),
         pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID format' 
      });
    }

    const product = await productModel.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json({ success: true, message: 'Product fetched successfully', product });
    
  } catch (error) {
    console.log('Error in getProduct:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Product - Admin only
const createProduct = async (req, res) => {
  try {
    const {name, description, price, category, sizes, stock, highlight, isHero} = req.body;
    
    if (!req.files) {
      return res.status(400).json({ success: false, message: 'No files were uploaded.' });
    }

    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid images were provided.' });
    }

    // Process images sequentially to maintain order
    let imagesUrl = [];
    for (const item of images) {
      try {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image'
        });
        imagesUrl.push(result.secure_url);
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        throw uploadError;
      }
    }
    
    let checkSizes;
    if (sizes) {
      try {
        checkSizes = JSON.parse(sizes);
        if (!Array.isArray(checkSizes)) {
          return res.status(400).json({success:false, message: 'Sizes must be an array'})
        }
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid sizes format'})
      }
    } else {
      checkSizes = [];
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      sizes: checkSizes,
      stock,
      highlight: Boolean(highlight),
      isHero: Boolean(isHero),
      images: imagesUrl
    }

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: 'Product created successfully', product})
    
  } catch (error) {
    console.log('Error in createProduct:', error);
    res.status(500).json({success: false, message: error.message})
  }
};

// Update Product - Admin only
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID format' 
      });
    }

    const product = await productModel.findById(id);
    
    if (!product) {
      return res.status(404).json({success: false, message: 'Product not found'})
    }

    const { 
      name, 
      description, 
      price, 
      category, 
      sizes, 
      stock, 
      highlight, 
      isHero,
      status 
    } = req.body;

    // Update basic product fields
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    
    // Update highlight field
    if (highlight !== undefined) {
      product.highlight = Boolean(highlight);
    }
    
    // Update isHero field
    if (isHero !== undefined) {
      product.isHero = Boolean(isHero);
    }
    
    // Update status field
    if (status !== undefined) {
      if (['active', 'inactive', 'out_of_stock'].includes(status)) {
        product.status = status;
      } else {
        return res.status(400).json({
          success: false, 
          message: 'Invalid status. Must be: active, inactive, or out_of_stock'
        });
      }
    }
    
    // Handle sizes update
    if (sizes !== undefined) {
      if (typeof sizes === 'string') {
        try {
          const parsedSizes = JSON.parse(sizes);
          if (Array.isArray(parsedSizes)) {
            product.sizes = parsedSizes;
          }
        } catch (error) {
          return res.status(400).json({success: false, message: 'Invalid sizes format'});
        }
      } else if (Array.isArray(sizes)) {
        product.sizes = sizes;
      }
    }

    // Handle existing images
    const { existingImages } = req.body;
    if (existingImages !== undefined) {
      try {
        const parsedExistingImages = typeof existingImages === 'string' 
          ? JSON.parse(existingImages) 
          : existingImages;
        
        if (Array.isArray(parsedExistingImages)) {
          product.images = parsedExistingImages;
        }
      } catch (error) {
        return res.status(400).json({success: false, message: 'Invalid existing images format'});
      }
    }

    // Handle new image uploads if provided
    if (req.files && Object.keys(req.files).length > 0) {
      const newImages = [];
      
      // Look for newImage1, newImage2, etc.
      for (let i = 1; i <= 4; i++) {
        const imageField = `newImage${i}`;
        if (req.files[imageField] && req.files[imageField][0]) {
          newImages.push(req.files[imageField][0]);
        }
      }

      if (newImages.length > 0) {
        try {
          // Process images sequentially to maintain order
          const newImagesUrl = [];
          for (const item of newImages) {
            const result = await cloudinary.uploader.upload(item.path, {
              resource_type: 'image'
            });
            newImagesUrl.push(result.secure_url);
          }
          
          // Combine existing images with new images
          product.images = [...product.images, ...newImagesUrl];
        } catch (uploadError) {
          console.error('Error uploading new images:', uploadError);
          return res.status(500).json({
            success: false, 
            message: 'Error uploading new images'
          });
        }
      }
    }

    const updatedProduct = await product.save();
    
    res.json({
      success: true, 
      message: 'Product updated successfully', 
      product: updatedProduct
    });

  } catch (error) {
    console.log('Error in updateProduct:', error);
    res.status(500).json({success: false, message: error.message});
  }
};

// Delete Product - Admin only
const deleteProduct = async (req, res) => {
  try {

    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({success: false, message: 'Product not found'})
    }

    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log('Error in deleteProduct:', error);
      }
    }

    await productModel.findByIdAndDelete(req.params.id);

    res.json({success: true, message: 'Product deleted successfully'})

  } catch (error) {
    console.log('Error in deleteProduct:', error);
    res.status(500).json({success: false, message: error.message})
  }
};

// Get Hero Products (for homepage)
const getHeroProducts = async (req, res) => {
  try {
    const heroProducts = await productModel.find({
      isHero: true,
      status: 'active',
      stock: { $gt: 0 }
    })
    .sort({ createdAt: -1 }) // Sort by newest first
    .limit(5)
    .select('name description price images category');

    res.json({
      success: true,
      data: heroProducts.map(product => ({
        id: product._id,
        name: product.name,
        image: product.images[0],
        link: `/produk/${product._id}`,
        originalProduct: product
      }))
    });

  } catch (error) {
    console.error('Error getting hero products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hero products'
    });
  }
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getHeroProducts
}; 