import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import { assets,  howToOrder } from '../assets/assets';
import FeaturedProducts from '../components/Products/LatestProducts';
import Button from "../components/Button";
import { FaInstagram, FaTiktok, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';

const Home = () => {

  const [heroConfig, setHeroConfig] = useState({
    title: 'Ospek Kit Collection',
    subtitle: 'Latest Products from KWU',
    products: []
  });
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const defaultProducts = [
    { 
      images: [assets.ospekkit], 
      name: "Ospek Kit 2025", 
      link: "/produk",
      id: "default-1"
    },
    { 
      images: [assets.product1], 
      name: "Merchandise Ospek 2025", 
      link: "/produk",
      id: "default-2"
    },
    { 
      images: [assets.product2], 
      name: "Notebook Ospek 2025", 
      link: "/produk",
      id: "default-3"
    },
  ];

  // Load hero products from backend
  useEffect(() => {
    const loadHeroProducts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CATALOG.GET_HERO);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          setHeroConfig({
            title: 'Ospek Kit Collection',
            subtitle: 'New Ospek Kit Collection from KWU',
            products: result.data.map(product => ({
              ...product,
              images: product.originalProduct?.images || [product.image],
              link: `/product/${product.id}`
            }))
          });
        } else {
          // Fallback to default products if no hero products
          setHeroConfig({
            title: 'Ospek Kit Collection',
            subtitle: 'New Ospek Kit Collection from KWU',
            products: defaultProducts,
          });
        }
      } catch (error) {
        console.error('Error loading hero products:', error);
        // Fallback to default products if error
        setHeroConfig({
          title: 'Ospek Kit Collection',
          subtitle: 'New Ospek Kit Collection from KWU',
          products: defaultProducts,
        });
      } finally {
        setLoading(false);
      }
    };

    loadHeroProducts();
  }, []);

  return (
    <div>
      <main>
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row h-auto md:h-100 border-b-3">

          {/* Hero Left (Image Slider + Thumbnail Preview) */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {/* Swiper Slider */}
            <div className="relative w-3/4 md:w-3/7 mb-5 overflow-hidden border-3 mt-5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all duration-300">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
                pagination={{
                  clickable: true,
                  renderBullet: (index, className) => {
                    return `<span class="${className} custom-bullet"></span>`;
                  }
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              >
                {heroConfig.products.map((product, index) => (
                  <SwiperSlide key={product.id || index}>
                    <div className="w-full h-85 p-4 pt-10 md:pt-4 pb-5">
                      <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                          src={product.images?.[0] || product.image || product.img} 
                          alt={product.name}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="absolute top-1/2 transform left-2 right-2 -translate-y-1/2 w-auto flex justify-between z-10 pointer-events-none">
                <button className="custom-prev border-2 border-black hover:scale-110 transition-all duration-300 pointer-events-auto">❮</button>
                <button className="custom-next border-2 border-black hover:scale-110 transition-all duration-300 pointer-events-auto">❯</button>
              </div>
            </div>
          </div>    

          {/* Hero Right (Product Name & Link) */}
          <div className="flex flex-col w-full md:w-1/2 border-l-0 md:border-l-3 md:border-t-0 border-t-3 md:mb-0 mb-15 py-5 justify-center items-center md:items-start text-center md:text-left ">
            <div className='bg-accent p-2 md:mt-[-130px] md:mb-10 border-4 md:border-l-0 border-matteblack'>
              <h2 className='text-2xl md:text-3xl font-display font-bold'>{heroConfig.title}</h2>    
            </div>  
            <div className='md:ml-10 p-4 ml-0 md:mt-0 mt-10'>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              ) : heroConfig.products.length > 0 ? (
                <>
                  <h1 className="text-2xl md:text-3xl font-display font-bold">{heroConfig.products[activeIndex]?.name}</h1>
                  <p className="text-xl md:text-lg font-display">{heroConfig.subtitle}</p>
                  <Button 
                    text="See Product Details" 
                    align="center md:left" 
                    to={heroConfig.products[activeIndex]?.link || "/catalog"} 
                    className="mt-5" 
                  />
                </>
              ) : (
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-display font-bold">No Products Available</h1>
                  <p className="text-xl md:text-lg font-display mb-5">Check back later</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="flex flex-col items-center bg-accent md:flex-row p-5 font-display"></div>
        
        {/* Product Section */}
        <section className='border-t-3 relative overflow-hidden'>
          {/* Grid Background Pattern */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #23150F 1px, transparent 1px),
                linear-gradient(to bottom, #23150F 1px, transparent 1px)
              `,
              backgroundSize: '45px 45px'
            }}
          ></div>
          
          <div className="absolute top-10 left-10 w-20 h-20 border-3 border-matteblack rotate-12 opacity-20"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-accent border-2 border-matteblack rotate-45 opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 border-3 border-matteblack rotate-[-15deg] opacity-25"></div>
          <div className="absolute bottom-32 right-32 w-24 h-8 bg-matteblack opacity-20 rotate-6"></div>

          <div className="relative z-10">
            <div className="flex justify-center pt-12">
                <h2 className="font-bricolage text-center text-4xl bg-accent px-6 py-3 border-3 border-matteblack shadow-matteblack transform rotate-[-1deg]">Our Catalog</h2>
            </div>
            <FeaturedProducts />
            <Button text="Browse More Products" to="/catalog" className=" mb-15 mt-10" />
          </div>
        </section>

        {/* How To Order section */}
        <section className='flex flex-col items-start md:items-center bg-accent p-10 border-y-3'>
          <h2 className='text-4xl font-bricolage text-start pb-5'>How To Order</h2>
          <div className='flex flex-col items-start border-3 p-3 md:p-5 shadow-matteblack'>
            <h3 className='text-sm md:text-xl font-display-bold text-center'>{howToOrder.step1}</h3>
            <h3 className='text-sm md:text-xl font-display-bold text-center'>{howToOrder.step2}</h3>
            <h3 className='text-sm md:text-xl font-display-bold text-center'>{howToOrder.step3}</h3>
            <h3 className='text-sm md:text-xl font-display-bold text-center'>{howToOrder.step4}</h3>
            <h3 className='text-sm md:text-xl font-display-bold text-center'>{howToOrder.step5}</h3>
            <h3 className='text-sm md:text-xl font-display-bold text-center'>{howToOrder.step6}</h3>
            <h3 className='text-sm md:text-xl font-display-bold text-center'>{howToOrder.step7}</h3>
            <h3 className='text-sm md:text-xl font-display-bold text-center'>{howToOrder.step8}</h3>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="flex flex-col p-10 my-20 items-center">
          <h2 className="text-3xl font-bricolage text-center">About Us</h2>

          <div className='max-w-4xl w-full space-y-'>
            <p className="font-display text-gray-600 leading-relaxed text-justify pt-8">
            Welcome to the online shopping platform for Ospek Kit and Products from KWU! We offer a practical and transparent shopping experience for students with an automated system designed specifically for your convenience.
            </p>
            
          </div>
          
          {/* Social Media Section */}
          <div className="grid grid-cols-2 justify-start gap-2 md:gap-4 p-2 md:p-5 w-full md:w-1/4 max-w-4xl font-display">
            <a href="https://www.instagram.com/bemfasilkom.upnjatim?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" aria-label="Instagram" className='flex items-center gap-1 md:gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 transition-all text-xs md:text-sm'><FaInstagram className="flex-shrink-0" /><span className="truncate">Instagram KWU</span></a>
            <a href="#" aria-label="TikTok" className='flex items-center gap-1 md:gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 transition-all text-xs md:text-sm'><FaTiktok className="flex-shrink-0" /><span className="truncate">TikTok KWU</span></a>
          </div>
        </section>

        
      </main>
    </div>
  )
}

export default Home