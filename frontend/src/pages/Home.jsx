import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import ProductGrid from '../components/ProductGrid';
import Button from "../components/Button";


const Home = () => {
  // Data produk
  const products = [
    { img: assets.ospekkit, name: "Ospek Kit 2024", link: "/produk/ospekkit" },
    { img: assets.product1, name: "Merchandise KWU", link: "/produk/merchandise" },
    { img: assets.product2, name: "Notebook KWU", link: "/produk/notebook" },
  ];


  // State untuk menyimpan produk yang sedang aktif
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <main>
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row h-auto md:h-100">

          {/* Hero Left (Image Slider + Thumbnail Preview) */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {/* Swiper Slider */}
            <div className="relative w-3/4 md:w-1/2 mb-5">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
                pagination={{ clickable: true }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              >
                {products.map((product, index) => (
                  <SwiperSlide key={index}>
                    <img className="w-full p-4 rounded-lg" src={product.img} alt={product.name} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Tombol Navigasi Custom (Ditempatkan di dalam slider) */}
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 z-10">
                <button className="custom-prev border-3 border-black">❮</button>
                <button className="custom-next border-3 border-black">❯</button>
              </div>
            </div>
          </div>

          {/* Hero Right (Nama Produk & Link) */}
          <div className="flex flex-col w-full md:w-1/2 border-l-0 md:border-l-3 md:border-t-0 border-t-3 py-5 justify-center items-center md:items-start text-center md:text-left ">
            <div className='md:ml-10 p-4 sm:ml-0'>
              <h1 className="text-2xl md:text-3xl font-display font-bold">{products[activeIndex].name}</h1>
              <p className="text-xl md:text-lg font-display mb-5">Produk terbaru dari KWU</p>
              <Button text="Lihat Detail Produk" align="left" to={products[activeIndex].link} className="mt-5" />
            </div>
          </div>


        </section>

        {/* Promo Section */}
        <section className="promo flex flex-col items-center border-3 bg-accent md:flex-row p-5 mt-5">
          <div className="text-center md:text-left w-full md:w-1/2">
            <h1 className="text-xl md:text-2xl font-semibold">PROMO TERBARU</h1>
          </div>
          <div className="w-1/2 md:w-1/2 flex justify-center">
            <img className="w-3/4 md:w-1/3 border-3" src={assets.imagePromo} alt="Promo" />
            <h1 className="text-xl md:text-2xl font-semibold ml-5">Rp 49.000</h1>
          </div>
          <div className="w-1/2 md:w-1/2 flex justify-center">
            <img className="w-3/4 md:w-1/3 border-3" src={assets.imagePromo} alt="Promo" />
            <div>
              <h2 className="text-lg font-semibold ml-5 line-through  ">Rp 99.000</h2>
              <h1 className="text-xl md:text-2xl font-semibold ml-5 text-red-600">Rp 49.000</h1>
            </div> 
          </div>
        </section>
        
        {/* Product Section */}
        <ProductGrid />
          <Button text="Lihat Semua Produk" to="/catalog" className="mb-15 mt-10" />

        {/* About Section */}
        <section id="about" className="p-10 border-t-3">
          <h2 className="text-3xl font-bold text-center">About Us</h2>
          <p className="text-gray-600 text-center mt-4">
            Ini adalah section About yang bisa diakses melalui navbar.
          </p>
        </section>

        
      </main>
    </div>
  )
}

export default Home