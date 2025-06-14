import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import { Link } from 'react-router-dom';
import { assets,  howToOrder } from '../assets/assets';
import LatestProducts from '../components/Products/LatestProducts';
import Button from "../components/Button";
import { FaInstagram, FaTiktok, FaYoutube, FaEnvelope } from 'react-icons/fa';

const Home = () => {
  // Products Ospek Kit
  const products = [
    { img: assets.ospekkit, name: "Ospek Kit 2025", link: "/produk/ospekkit" },
    { img: assets.product1, name: "Merchandise Ospek 2025", link: "/produk/merchandise" },
    { img: assets.product2, name: "Notebook Ospek 2025", link: "/produk/notebook" },
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
                pagination={{
                  clickable: true,
                  renderBullet: (index, className) => {
                    return `<span class="${className} custom-bullet"></span>`;
                  }
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              >
                {products.map((product, index) => (
                  <SwiperSlide key={index}>
                    <img className="w-85 p-4 pt-10 md:pt-4 rounded-lg m-auto mb-5" src={product.img} alt={product.name} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Tombol Navigasi Custom (Ditempatkan di dalam slider) */}
              <div className="absolute top-1/2 transform left-2 right-2 -translate-y-1/2 w-auto flex justify-between z-10 pointer-events-none">
                <button className="custom-prev border-2 border-black hover:scale-110 transition-all duration-300 pointer-events-auto">❮</button>
                <button className="custom-next border-2 border-black hover:scale-110 transition-all duration-300 pointer-events-auto">❯</button>
              </div>
            </div>
          </div>    

          {/* Hero Right (Nama Produk & Link) */}
          <div className="flex flex-col w-full md:w-1/2 border-l-0 md:border-l-3 md:border-t-0 border-t-3 md:mb-0 mb-15 py-5 justify-center items-center md:items-start text-center md:text-left ">
            <div className='bg-accent p-2 md:mt-[-130px] md:mb-10 border-4 md:border-l-0 border-matteblack'>
              <h2 className='text-2xl md:text-3xl font-display font-bold'>Ospek Kit Collection</h2>    
            </div>  
            <div className='md:ml-10 p-4 ml-0 md:mt-0 mt-10'>
              <h1 className="text-2xl md:text-3xl font-display font-bold">{products[activeIndex].name}</h1>
              <p className="text-xl md:text-lg font-display mb-5">Produk terbaru dari KWU</p>
              <Button text="See Product Details" align="left" to={products[activeIndex].link} className="mt-5" />
            </div>
          </div>


        </section>

        {/* Sale Section 
        <section className="promo flex flex-col items-center bg-accent md:flex-row p-5 font-display">
          <div className="text-center md:text-left w-full md:w-1/2">
            <h1 className="text-3xl md:text-2xl font-atemica">SALE!</h1>
          </div>
          <Link to="/product/sale" className="w-1/2 md:w-1/2 flex justify-center">
            <img className="w-3/4 md:w-1/3 border-2" src={assets.imagePromo} alt="Promo" />
            <h1 className="text-xl md:text-2xl  ml-5">Rp 49.000</h1>
          </Link>
          <div className="w-1/2 md:w-1/2 flex justify-center">
            <img className="w-3/4 md:w-1/3 border-2" src={assets.imagePromo} alt="Promo" />
            <div>
              <h2 className="text-lg  ml-5 line-through  ">Rp 99.000</h2>
              <h1 className="text-xl md:text-2xl  ml-5 text-red-600">Rp 49.000</h1>
            </div> 
          </div>
        </section> */}
        <div className="promo flex flex-col items-center bg-accent md:flex-row p-5 font-display"></div>
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
          
          {/* Additional decorative elements for neo brutalism */}
          <div className="absolute top-10 left-10 w-20 h-20 border-3 border-matteblack rotate-12 opacity-20"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-accent border-2 border-matteblack rotate-45 opacity-30"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 border-3 border-matteblack rotate-[-15deg] opacity-25"></div>
          <div className="absolute bottom-32 right-32 w-24 h-8 bg-matteblack opacity-20 rotate-6"></div>
          
          {/* Content with relative positioning to appear above background */}
          <div className="relative z-10">
            <div className="flex justify-center pt-12">
                <h2 className="font-bricolage text-center text-4xl bg-accent px-6 py-3 border-3 border-matteblack shadow-matteblack transform rotate-[-1deg]">Our Catalog</h2>
            </div>
            <LatestProducts />
            <Button text="Browse More Products" to="/catalog" className=" mb-15 mt-10" />
          </div>
        </section>

        {/* How To Order section */}
        <section className='flex flex-col items-start md:items-center bg-accent p-10'>
          <h2 className='text-4xl font-bricolage text-start pb-5'>How To Order</h2>
          <div className='flex flex-col items-start border-3 p-5 shadow-matteblack'>
            <h3 className='text-xl font-display-bold text-center'>{howToOrder.step1}</h3>
            <h3 className='text-xl font-display-bold text-center'>{howToOrder.step2}</h3>
            <h3 className='text-xl font-display-bold text-center'>{howToOrder.step3}</h3>
            <h3 className='text-xl font-display-bold text-center'>{howToOrder.step4}</h3>
            <h3 className='text-xl font-display-bold text-center'>{howToOrder.step5}</h3>
            <h3 className='text-xl font-display-bold text-center'>{howToOrder.step6}</h3>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="flex flex-col p-10 border-t-3 items-center">
          <h2 className="text-3xl font-bricolage text-center">About Us</h2>

          <div className='max-w-4xl w-full space-y-6'>
            <p className="font-display text-gray-600 leading-relaxed text-justify pt-8">
            Selamat datang di platform belanja online Ospek Kit terintegrasi KWU! Kami menghadirkan pengalaman berbelanja praktis dan transparan untuk mahasiswa dengan sistem terotomatisasi yang dirancang khusus untuk kenyamanan Anda.
            </p>
            <h3 className='font-display-bold text-xl mt-3 '>Keunggulan Sistem Kami</h3>
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
          <div className="grid grid-cols-2 md:grid-cols-4 justify-start gap-2 md:gap-4 p-2 md:p-5 w-full max-w-4xl font-display">
            <a href="#" aria-label="Instagram" className='flex items-center gap-1 md:gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 transition-all text-xs md:text-sm'><FaInstagram className="flex-shrink-0" /><span className="truncate">Instagram KWU</span></a>
            <a href="#" aria-label="TikTok" className='flex items-center gap-1 md:gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 transition-all text-xs md:text-sm'><FaTiktok className="flex-shrink-0" /><span className="truncate">TikTok KWU</span></a>
            <a href="#" aria-label="YouTube" className='flex items-center gap-1 md:gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 transition-all text-xs md:text-sm'><FaYoutube className="flex-shrink-0" /><span className="truncate">Youtube KWU</span></a>
            <a href="#" aria-label="Email" className='flex items-center gap-1 md:gap-2 p-2 bg-offwhite hover:bg-accent border-2 hover:border-black rounded-lg hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 transition-all text-xs md:text-sm'><FaEnvelope className="flex-shrink-0" /><span className="truncate">Email KWU</span></a> 
          </div>
        </section>

        
      </main>
    </div>
  )
}

export default Home