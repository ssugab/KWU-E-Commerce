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
import { FaInstagram, FaTiktok, FaYoutube, FaEnvelope } from 'react-icons/fa';


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
        <section className="flex flex-col md:flex-row h-auto md:h-100 border-b-3">

          {/* Hero Left (Image Slider + Thumbnail Preview) */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {/* Swiper Slider */}
            <div className="relative w-3/4 md:w-3/7 mb-5 overflow-visible border-3 mt-5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all duration-300">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{ prevEl: ".custom-prev", nextEl: ".custom-next" }}
                pagination={{ clickable: true }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              >
                {products.map((product, index) => (
                  <SwiperSlide key={index}>
                    <img className="w-85 p-4 pt-10 md:pt-4 rounded-lg m-auto mb-5" src={product.img} alt={product.name} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Tombol Navigasi Custom (Ditempatkan di dalam slider) */}
              <div className="absolute top-1/2 transform left-0 right-0 -translate-y-1/2 w-full flex justify-between z-10">
                <button className="custom-prev border-2 border-black -translate-x-1/2 ml-[-20px] hover:scale-110 hover:translate-x-1 transition-all duration-300">❮</button>
                <button className="custom-next border-2 border-black translate-x-1/2 mr-[-20px] hover:scale-110 hover:translate-x-1 transition-all duration-300">❯</button>
              </div>
            </div>
          </div>

          {/* BRAND NEW Section 
          <div className="absolute w-full flex flex-col items-center">
            <div className="bg-offwhite mb-5 overflow-visible border-3 border-t-0 p-2">
              <h1 className="text-2xl md:text-3xl font-display font-bold">BRAND NEW!!</h1>
            </div>
          </div> */}

          {/* Hero Right (Nama Produk & Link) */}
          <div className="flex flex-col w-full md:w-1/2 border-l-0 md:border-l-3 md:border-t-0 border-t-3 md:mb-0 mb-15 py-5 justify-center items-center md:items-start text-center md:text-left ">
            <div className='md:ml-10 p-4 ml-0 md:mt-0 mt-10'>
              <h1 className="text-2xl md:text-3xl font-display font-bold">{products[activeIndex].name}</h1>
              <p className="text-xl md:text-lg font-display mb-5">Produk terbaru dari KWU</p>
              <Button text="Lihat Detail Produk" align="left" to={products[activeIndex].link} className="mt-5" />
            </div>
          </div>


        </section>

        {/* Promo Section */}
        <section className="promo flex flex-col items-center bg-accent md:flex-row p-5 font-display">
          <div className="text-center md:text-left w-full md:w-1/2">
            <h1 className="text-xl md:text-2xl ">PROMO TERBARU</h1>
          </div>
          <div className="w-1/2 md:w-1/2 flex justify-center">
            <img className="w-3/4 md:w-1/3 border-2" src={assets.imagePromo} alt="Promo" />
            <h1 className="text-xl md:text-2xl  ml-5">Rp 49.000</h1>
          </div>
          <div className="w-1/2 md:w-1/2 flex justify-center">
            <img className="w-3/4 md:w-1/3 border-2" src={assets.imagePromo} alt="Promo" />
            <div>
              <h2 className="text-lg  ml-5 line-through  ">Rp 99.000</h2>
              <h1 className="text-xl md:text-2xl  ml-5 text-red-600">Rp 49.000</h1>
            </div> 
          </div>
        </section>
        
        {/* Product Section */}
        <section className='border-t-3'>
          <div className="flex justify-center mt-12">
              <h2 className="font-bold text-center text-3xl ">Our Products</h2>
          </div>
          <ProductGrid />
          <Button text="Lihat Semua Produk" to="/catalog" className="mb-15 mt-10" />
        </section>

        {/* About Section */}
        <section id="about" className="flex flex-col p-10 border-t-3 items-center">
          <h2 className="text-3xl font-bold text-center">About Us</h2>

          <div className='max-w-4xl w-full space-y-6'>
            <p className="font-display text-gray-600 leading-relaxed text-justify pt-8">
            Selamat datang di platform belanja online Ospek Kit terintegrasi KWU! Kami menghadirkan pengalaman berbelanja praktis dan transparan untuk mahasiswa dengan sistem terotomatisasi yang dirancang khusus untuk kenyamanan Anda.
            </p>
            <h3 className='font-display text-xl mt-3 '>Keunggulan Sistem Kami</h3>
            <ul className='font-display list-disc list-inside'>
              <li>             
                Notifikasi otomatis via email & SMS pada tiap tahap transaksi
              </li>
              <li>
                Pengiriman otomatis ke alamat yang terdaftar
              </li>
              <li>
                Pembayaran otomatis melalui transfer bank
              </li>
            </ul>
          </div>
          
          {/* Social Media Section */}
          <div className="flex justify-start gap-4 p-5 min-w-[200px] font-display">
            <a href="#" aria-label="Instagram" className='flex items-center gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1  transition-all'><FaInstagram />Instagram KWU</a>
            <a href="#" aria-label="TikTok" className='flex items-center gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1  transition-all '><FaTiktok />TikTok KWU</a>
            <a href="#" aria-label="YouTube" className='flex items-center gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1  transition-all   '><FaYoutube />Youtube KWU</a>
            <a href="#" aria-label="Email" className='flex items-center gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1  transition-all '><FaEnvelope />Email KWU</a> 
          </div>
        </section>

        
      </main>
    </div>
  )
}

export default Home