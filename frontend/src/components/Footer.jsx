// src/components/Footer.js
import React from 'react';
import { FaInstagram, FaTiktok, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { assets } from '../assets/assets';

function Footer() {
  return (
    <footer className="footer flex flex-col items-center bg-accent border-t-3 ">
      <div className="footer-top flex w-full justify-between">
        <div className="footer-left flex-1 p-4 min-w-[200px] border-r-3">
          <img src={assets.kwulogo} className='ml-0' alt="" />
          <p className='md:text-lg sm:text-sm pl-3' >KWU DESIGN INC. | © {new Date().getFullYear()}</p>
        </div>
        <div className="footer-middle flex-1 p-4 min-w-[200px] items-center gap-2 border-r-3 font-display text-left justify-start ">
          <ul>
            <li><a href="#" className="hover:underline">FAQ</a></li>
            <li><a href="#" className="hover:underline">Return Policy</a></li>
            <li><a href="#" className="hover:underline">Wholesale Requests</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-right flex-1 flex justify-start gap-2 p-5 min-w-[200px] items-center">
         <a href="#" aria-label="Instagram" className='hover:bg-offwhite hover:rounded-full p-2'><FaInstagram /></a>
          <a href="#" aria-label="TikTok" className='hover:bg-offwhite hover:rounded-full p-2'><FaTiktok /></a>
          <a href="#" aria-label="YouTube" className='hover:bg-offwhite hover:rounded-full p-2  '><FaYoutube /></a>
          <a href="#" aria-label="Email" className='hover:bg-offwhite hover:rounded-full p-2'><FaEnvelope /></a> 
        </div>
      </div>
      <div className="footer-bottom flex border-t-3 w-full">
        <p className='m-5 font-display'>TERMS & CONDITIONS | PRIVACY POLICY</p>
        <div className="currency">
          <span>USD $</span>
          <span>▼</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;