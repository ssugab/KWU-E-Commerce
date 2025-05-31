import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import Button from '../components/Button';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';


const Product = () => {
  const { productId } = useParams(); // Get productId from URL parameter
  const { catalog, addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1); // State untuk quantity
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    // Find product based on ID
    if (catalog && catalog.length > 0 && productId) {
      setLoading(true);

      const foundProduct = catalog.find(item => item.id === productId);
      setProduct(foundProduct);
      
      // Set first image as default selectedImage
      if (foundProduct && foundProduct.images && foundProduct.images.length > 0) {
        setSelectedImage(foundProduct.images[0]);
      }
      
      setLoading(false);
    }
  }, [catalog, productId]);

  //console.log('Product ID:', productId);
  //console.log('Selected Image:', selectedImage);

  // Function for handling add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Validate size selection if product has sizes
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size first!');
      return;
    }
    
    // Validate stock
    if (quantity > (product.stock || 0)) {
      toast.error(`Insufficient stock! Stock available: ${product.stock || 0}`);
      return;
    }
    
    // Add to cart with selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }
    
    toast.success(`${quantity} ${product.name} item added to cart!`);
    
    // Reset quantity to 1 after add to cart
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Memuat detail produk...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-lg text-red-600 mb-4">Produk tidak ditemukan</div>
        <Button text="Kembali ke Katalog" to="/catalog" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-5">
      {/* Back to catalog link */}
        <Link to="/catalog" className="text-accent hover:underline text-center flex items-center gap-2">
          <FaArrowLeft /> Return to Catalog
        </Link>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 items-start border-b-3">
        
        {/* Product Images */}
        <div className="flex flex-col items-center border-b-3 md:border-b-0">
          <img 
            src={selectedImage || 'https://via.placeholder.com/500x500?text=No+Image'} 
            alt={product.name} 
            className="w-full md:w-1/2 h-96 object-cover border-3 mb-4 shadow-matteblack hover:shadow-accent"
          />
          {/* Additional Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-1/2">
              {product.images.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`${product.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover border-3 cursor-pointer transition-all duration-200 hover:shadow-accent ${
                    selectedImage === img 
                      ? 'border-accent shadow-accent' 
                      : 'hover:shadow-accent'
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col h-[28rem] justify-between w-full md:w-4/5">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-matteblack mb-6">Rp {product.price.toLocaleString()}</p>

            {/* Product Details */}
            <div className="flex flex-col gap-2 py-5">
              <h2 className="text-lg font-semibold mb-2 border-b-3 border-accent">Detail</h2>
              <p className="text-matteblack mb-8 md:mb-4">{product.description}</p>

              {/* Category 
              <p className="text-sm text-gray-500 mb-4">Category: {product.category}</p> */}
            </div>
            
            {/* Sizes if available */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6 md:mb-4">
                <h3 className="text-lg font-semibold">Size:</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 border-2 text-sm cursor-pointer transition-colors ${
                        selectedSize === size 
                          ? 'border-accent bg-accent text-white' 
                          : 'bg-offwhite3 border-gray-300 hover:border-accent'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected size: <span className="font-medium">{selectedSize}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Add to Cart Section */}
          <div className="flex flex-col gap-4 mt-auto">
            {/* Stock Info */}
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Stock Available:</p>
              <span className={`font-bold text-sm px-2 py-1 rounded ${
                (product.stock || 0) > 10 
                  ? 'bg-green-100 text-green-800' 
                  : (product.stock || 0) > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {product.stock || 0} unit
                {(product.stock || 0) <= 5 && (product.stock || 0) > 0 && ' (Limited Stock!)'}
                {(product.stock || 0) === 0 && ' (Out of Stock)'}
              </span>
            </div>
            
            {/* Add to Cart Button & Quantity Selector */}
            <div className="flex items-center gap-3">
              <Button 
                text={
                  (product.stock || 0) <= 0 
                    ? 'Out of Stock' 
                    : `Add to Cart (${quantity})`
                } 
                className={`flex-1 ${
                  (product.stock || 0) <= 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock <= 0}
              />
              {/* Quantity Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center border-2 bg-offwhite3 h-10">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-offwhite2 border-r h-9 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className={`w-15 ${quantity < 10 ? 'px-6' : ' px-5'}`}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    className="px-3 py-1 hover:bg-offwhite2 border-l h-9 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= (product.stock || 1)}
                  >
                    +
                  </button>
                </div>
                {/* <span className="text-xs text-gray-500">
                  (Max: {product.stock || 0})
                </span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-2 py-5 px-10">
          <h2 className="text-lg font-semibold mb-2 border-b-3 border-accent">Detail</h2>
          <p className="text-matteblack mb-8 md:mb-4">{product.description}</p>
        </div>

      </div>
      {/* Similar Products */}
      <div className="flex flex-col gap-3 mt-6 items-center">
            <h3 className="text-2xl font-bold mb-4">Similar Products</h3>
            <img src={product.byCategory} alt="" />
        </div>
    </div>
  )
}

export default Product