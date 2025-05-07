import React from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';

const ProductGrid = () => {
  const products = [
    { img: assets.ospekkit, name: "Ospek Kit 2024", link: "/produk/ospekkit" },
    { img: assets.product1, name: "Merchandise KWU", link: "/produk/merchandise" },
    { img: assets.product2, name: "Notebook KWU", link: "/produk/notebook" },
  ];

  return (
    <section className="p-10">
      <div className="flex justify-center mb-6">
            <h2 className="text-center text-3xl font-bold">Our Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <NavLink 
                to={product.link} 
                key={index} 
                className="bg-white shadow-md rounded-lg border-3 p-3 hover:shadow-[3px_3px_0px_0px_rgba(255,136,45,1)] transition-all flex flex-col items-center">
                <img className="w-3/4 rounded-lg block" src={product.img} alt={product.name} />
                <div className='mt-auto w-full bg-offwhite rounded-lg p-2'>
                  <h2 className="text-lg font-display font-medium mt-3">{product.name}</h2>
                  <p className="text-gray-600 font-display">Deskripsi produk singkat.</p>
                </div>
              </NavLink>
            ))}
          </div>
          
    </section>
  );
};

export default ProductGrid;