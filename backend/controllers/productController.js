
import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/Product.js';

import dotenv from 'dotenv';

dotenv.config();

// Get All Products (untuk catalog page)
const getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      stock,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (category) {
      query.category = category;
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
      .select('name description price images sizes category stock createdAt');

    // Get total count for pagination
    const total = await productModel.countDocuments(query);

    // const products = await productModel.find({});
    //res.json({success: true, products, total})

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
    
    // Validasi format ID MongoDB
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

// Create Product (Admin only)
const createProduct = async (req, res) => {
  try {
    const {name, description, price, category, sizes, stock} = req.body;
    
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

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: 'image'
          });
          // console.log('Upload result:', result);
          return result.secure_url;
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary:', uploadError);
          throw uploadError;
        }
      })
    );
    
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

// Update Product (Admin only) -- Not done yet
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
    const { name, description, price, category, sizes, stock } = req.body;

    // Check if there are new images
    if(req.files) {

    }

    if(product) {
      //Update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.sizes = sizes || product.sizes;
      product.stock = stock || product.stock;

      const updatedProduct = await product.save();
      res.json({success: true, message: 'Product updated successfully', product: updatedProduct})
    }
    else {
      return res.status(404).json({success: false, message: 'Product not found'})
    }

    // if(req.body.image !== undefined) { 
    //   const publicId = product.image.split('/').pop().split('.')[0];
    // }

  } catch (error) {
    console.log('Error in updateProduct:', error);
    res.status(500).json({success: false, message: error.message})
  }
};

// Delete Product (Admin only)
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

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}; 