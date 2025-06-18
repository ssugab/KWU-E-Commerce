import kwulogo from './img/KWU LOGO.svg';
import shopping_bag_icon from './icons/shopping-bag-svgrepo-com.svg';
import profile from './icons/profile-1341-svgrepo-com.svg';
import return_icon from './icons/arrow-return-svgrepo-com.svg'
import admin_icon from './icons/admin_icon.png'

//IMG
import product2 from './img/tshirtmockup.avif';
import ospekkit from './img/ospek_kit.png';
import menu_icon from './icons/menu.png';
import imagePromo from './img/Tote-Bag-Mockup-1-1536x1152.jpg';
import product1 from './img/surreal-tshirt-mockup.jpg'
import qrCode from './img/KWU-QRIS.png'

export const assets = {
  kwulogo,
  menu_icon,
  shopping_bag_icon,
  profile,
  return_icon,
  admin_icon,
  product2,
  imagePromo,
  product1,
  ospekkit,
  qrCode,

}

export const products = [
  {
    id: 1,
    name: 'OSPEK Kit',
    price: 120000,
    image: 'ospekkit',
    description: 'Kit OSPEK yang berisi berbagai perlengkapan esensial untuk OSPEK Fasilkom 2025'
  },
  {
    id: 2,
    name: 'Kaos Fasilkom 2022',
    price: 50000,
    image: 'product2',
    description: 'kaos Fasilkom yang menandakan kamu adalah bagian dari KM Fasilkom UPN Veteran Jawa Timur'
  },
  {
    id: 3,
    name: 'Kaos Fasilkom 2025',
    price: 50000,
    image: 'imagePromo',
    description: 'kaos Fasilkom yang menandakan kamu adalah bagian dari KM Fasilkom UPN Veteran Jawa Timur'
  },
  {
    id: 4,
    name: 'Kaos Fasilkom 2023',
    price: 50000,
    image: 'product2',
    description: 'kaos Fasilkom yang menandakan kamu adalah bagian dari KM Fasilkom UPN Veteran Jawa Timur'
  },
  {
    id: 5,
    name: 'Kaos Fasilkom 2024',
    price: 50000,
    image: 'product2',
    description: 'kaos Fasilkom yang menandakan kamu adalah bagian dari KM Fasilkom UPN Veteran Jawa Timur'
  }
]

export const howToOrder = {
  step1: '1. Login',
  step2: '2. Choose Product & Quantity',
  step3: '3. Add to Cart',
  step4: '4. Checkout',
  step5: '5. Payment',
  step6: '6. Wait for Confirmation',
  step7: '7. Pickup',
  step8: '8. Confirm order and enjoy your product!'
}