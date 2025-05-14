import React from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';

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
          <CardContainer key={index} className="w-full">
            <CardBody className="bg-white relative group/card border-black/[0.1] w-full h-auto rounded-xl p-6 border hover:shadow-2xl hover:shadow-accent/20 transition-all">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600"
              >
                {product.name}
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2"
              >
                Deskripsi produk singkat.
              </CardItem>
              <CardItem
                translateZ="100"
                rotateX={10}
                rotateZ={-5}
                className="w-full mt-4"
              >
                <img
                  src={product.img}
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt={product.name}
                />
              </CardItem>
              <div className="flex justify-between items-center mt-20">
                <CardItem
                  translateZ={20}
                  translateX={-40}
                  as={NavLink}
                  to={product.link}
                  className="px-4 py-2 rounded-xl text-xs font-normal text-accent hover:text-amber-700"
                >
                  Lihat Detail →
                </CardItem>
                <CardItem
                  translateZ={20}
                  translateX={40}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-amber-600"
                >
                  Beli Sekarang
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;