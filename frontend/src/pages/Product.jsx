import React, { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import SimilarProducts from '../components/Products/SimilarProducts';

import Button from '../components/Button';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Product = () => {
  const { productId } = useParams(); // Get productId from URL parameter
  const { products, addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('sizeGuide');
  const [ showSizeGuide, setShowSizeGuide] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchProduct = async () => {
    // Find product based on ID
    if (products && products.length > 0 && productId) {
      setLoading(true);

      const foundProduct = products.find(item => item.id === productId);
      setProduct(foundProduct);

      const shouldShowSizeGuide = foundProduct.category === 'Shirt' || foundProduct.category === 'Ospek Kit';
      setShowSizeGuide(shouldShowSizeGuide);
      
      // Set default active tab based on whether size guide should be shown
      setActiveTab(shouldShowSizeGuide ? 'sizeGuide' : 'description');
      
      if (foundProduct && foundProduct.images && foundProduct.images.length > 0) {
        setSelectedImage(foundProduct.images[0]);
      }
      
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [products, productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-lg text-red-600 mb-4">Product not found</div>
        <Button text="Back to Catalog" to="/catalog" />
      </div>
    );
  }
  

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size first!"); 
      return;
    }

    if (quantity > (product.stock || 0)) {
      toast.error(`Insufficient stock! Only ${product.stock || 0} items available.`);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      if (!isAuthenticated){
        toast.error("Please login to add to cart");
        return;
      } else {
        addToCart(product.id, selectedSize, quantity);
      }   
    }
    toast.success(`${quantity} ${product.name} added to cart!`);

    setQuantity(1);
  }

  return (
    <div className="container mx-auto px-4 py-5">
      {/* Back to catalog link */}
        <Link to="/catalog" className="text-accent hover:underline text-center flex items-center gap-2 text-sm">
          <FaArrowLeft /> Return to Catalog
        </Link>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Product Images */}
          <div className="flex flex-col">
            {/* Main Image */}
            <div className="w-full mb-4 shadow-matteblack hover:shadow-accent">
              <img 
                src={selectedImage || 'https://via.placeholder.com/500x500?text=No+Image'} 
                alt={product.name} 
                className="w-full h-80 md:h-96 lg:h-[500px] object-cover border-3 shadow-lg"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <img 
                    key={index}
                    src={img} 
                    alt={`${product.name} ${index + 1}`}
                    className={`w-16 h-16 md:w-20 md:h-20 object-cover border-3 cursor-pointer transition-all duration-200 flex-shrink-0 ${
                      selectedImage === img 
                        ? 'border-accent shadow-matteblack' 
                        : 'border-gray-200 hover:border-accent'
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            {/* Product Title & Price */}
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-bold text-accent">
                  Rp {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size, index) => (
                    <button 
                      key={index} 
                      className={`px-4 py-2 border-3 font-medium transition-all duration-200 ${
                        selectedSize === size 
                          ? 'border-accent bg-accent text-offwhite3 shadow-matteblack' 
                          : 'border-gray-300 bg-white text-gray-700 hover:border-accent hover:bg-accent hover:text-white'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-sm text-gray-600">
                    Selected size: <span className="font-medium text-gray-900">{selectedSize}</span>
                  </p>
                )}
              </div>
            )}

            {/* Stock Info */}
            <div className="flex items-center gap-3 py-3 px-4 bg-offwhite3 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Stock:</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                (product.stock || 0) > 10 
                  ? 'bg-green-100 text-green-800' 
                  : (product.stock || 0) > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
              }`}>
                {(product.stock || 0) > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            
            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t-3 md:border-t-2  border-matteblack">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border-2 border-gray-300  rounded-lg overflow-hidden">
                  <button 
                    onClick={() => {
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-2 bg-white font-medium min-w-[60px] text-center">{quantity}</span>
                  <button 
                    onClick={() => {
                      setQuantity(Math.min(product.stock || 1, quantity + 1));
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= (product.stock || 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Buttons */}
              <div className="items-center">
                <Button 
                  text={
                    (product.stock || 0) <= 0 
                      ? 'Out of Stock' 
                      : `Add to Cart (${quantity})`
                  } 
                  className={`flex-1 py-2 px-6 text-base font-semibold ${
                    (product.stock || 0) <= 0 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'bg-accent hover:bg-accent/90 text-matteblack border-accent'
                  }`}
                  onClick={() => {
                    handleAddToCart();
                  }}
                    disabled={!product.stock || product.stock <= 0}
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Size Guide & Product Information Tabs */}
      <div className="mt-28 md:mt-8 md:mx-8 border-3 border-b-0 shadow-matteblack">
        <div className="flex flex-wrap gap-4 p-6 bg-offwhite3">
          {showSizeGuide && (
          <button 
            className={`px-3 md:px-4 py-2 border-2 border-matteblack font-bricolage text-xs md:text-sm transition-all duration-300 ${
              activeTab === 'sizeGuide' 
                ? 'bg-accent shadow-matteblack transform translate-x-1 translate-y-1' 
                : 'bg-white hover:bg-accent hover:shadow-matteblack hover:transform hover:translate-x-1 hover:translate-y-1'
            }`}
            onClick={() => setActiveTab('sizeGuide')}
          >
            📏 Size Guide
          </button>
          )}
          <button 
            className={`px-3 md:px-4 py-2 border-2 border-matteblack font-bricolage text-xs md:text-sm transition-all duration-300 ${
              activeTab === 'description' 
                ? 'bg-accent shadow-matteblack transform translate-x-1 translate-y-1' 
                : 'bg-white hover:bg-accent hover:shadow-matteblack hover:transform hover:translate-x-1 hover:translate-y-1'
            }`}
            onClick={() => setActiveTab('description')}
          >
            📝 Description
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6 bg-offwhite2 border-3 border-l-0 border-r-0">
          
          {/* Size Guide Tab */}
          {activeTab === 'sizeGuide' && showSizeGuide && (
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-lg md:text-2xl font-atemica mb-3 md:mb-4 text-matteblack">📏 Size Guide</h2>
              
              {/* Size Chart Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-2 md:border-3 border-matteblack text-xs md:text-base">
                  <thead>
                    <tr className="bg-accent">
                      <th className="border-2 border-matteblack p-2 md:p-3 font-display-bold">Size</th>
                      <th className="border-2 border-matteblack p-2 md:p-3 font-display-bold">Chest (cm)</th>
                      <th className="border-2 border-matteblack p-2 md:p-3 font-display-bold">Length (cm)</th>
                      <th className="border-2 border-matteblack p-2 md:p-3 font-display-bold">Shoulder (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border-2 border-matteblack p-2 md:p-3 font-display-bold text-center">S</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">48-50</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">68-70</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">42-44</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border-2 border-matteblack p-2 md:p-3 font-display-bold text-center">M</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">52-54</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">70-72</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">44-46</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border-2 border-matteblack p-2 md:p-3 font-display-bold text-center">L</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">56-58</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">72-74</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">46-48</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border-2 border-matteblack p-2 md:p-3 font-display-bold text-center">XL</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">60-62</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">74-76</td>
                      <td className="border-2 border-matteblack p-2 md:p-3 text-center">48-50</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* How to Measure */}
              <div className="bg-offwhite p-3 md:p-4 border-2 border-matteblack">
                <h3 className="font-display-bold text-base md:text-lg mb-2 md:mb-3">📐 How to Measure:</h3>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <p className="font-display text-sm md:text-base"><strong>Chest:</strong> Measure around the fullest part of your chest</p>
                    <p className="font-display text-sm md:text-base"><strong>Length:</strong> Measure from shoulder to bottom hem</p>
                    <p className="font-display text-sm md:text-base"><strong>Shoulder:</strong> Measure from shoulder seam to shoulder seam</p>
                    <p className="font-display text-xs md:text-sm text-gray-600 mt-2">💡 Tip: Measure a similar garment that fits you well</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-lg md:text-2xl font-atemica mb-3 md:mb-4 text-matteblack">📝 Product Description</h2>
              <div className="prose max-w-none">
                <p className="font-display text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                  {product.description || "High-quality product made with premium materials. Perfect for everyday wear with comfortable fit and durable construction."}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
                  <div className="bg-gray-50 p-3 md:p-4 border-2 border-matteblack">
                    <h3 className="font-display-bold mb-2 text-sm md:text-base">🏷️ Product Features:</h3>
                    <ul className="font-display space-y-1 text-xs md:text-sm">
                      <li>• Premium quality materials</li>
                      <li>• Comfortable fit</li>
                      <li>• Durable construction</li>
                      <li>• Easy to care for</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 border-2 border-matteblack">
                    <h3 className="font-display-bold mb-2 text-sm md:text-base">📦 What's Included:</h3>
                    <ul className="font-display space-y-1 text-xs md:text-sm">
                      <li>• 1x {product.name}</li>
                      <li>• Care instruction card</li>
                      <li>• Official KWU packaging</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Similar Products */}
      <div className="flex flex-col my-10 items-center">
            <h3 className="text-2xl font-bold my-8">Similar Products</h3>
            <div className='bg-accent w-1/12 h-1 mt-[-30px] mb-10'></div>
            {product?.category ? (
              <SimilarProducts category={product.category} currentProductId={product.id} />
            ) : (
              <p className="text-gray-500">Loading similar products...</p>
            )}
        </div>

      
    </div>
  )
}

export default Product