const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: "Ospek Kit 2024",
    description: "Paket lengkap untuk ospek mahasiswa baru",
    price: 150000,
    image: "/images/ospekkit.jpg",
    category: "Kit",
    stock: 100
  },
  {
    name: "Merchandise KWU",
    description: "Merchandise resmi KWU",
    price: 75000,
    image: "/images/merchandise.jpg",
    category: "Merchandise",
    stock: 50
  },
  {
    name: "Notebook KWU",
    description: "Notebook dengan desain eksklusif KWU",
    price: 45000,
    image: "/images/notebook.jpg",
    category: "Stationery",
    stock: 200
  }
];

mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(() => {
    console.log('Terhubung ke MongoDB');
    return Product.insertMany(products);
  })
  .then(() => {
    console.log('Data produk berhasil ditambahkan');
    process.exit();
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  }); 