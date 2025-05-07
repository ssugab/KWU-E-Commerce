// src/components/Footer.js
import React from 'react';
import { FaInstagram, FaTiktok, FaYoutube, FaEnvelope } from 'react-icons/fa';
import { assets } from '../assets/assets';

function Footer() {
  return (
    <footer className="footer flex flex-col items-center bg-accent border-t-3 ">
      <div className="footer-top flex justify-evenly w-full">
        <div className="footer-left border-r-3 p-4">
          <img src={assets.kwulogo} className='ml-0' alt="" />
          <p className='md:text-lg sm:text-sm' >KWU DESIGN INC. | © {new Date().getFullYear()}</p>
        </div>
        <div className="footer-middle items-center gap-2 border-r-3 font-display">
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Wholesale Requests</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-right flex items-center p-4">
         <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="TikTok"><FaTiktok /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
          <a href="#" aria-label="Email"><FaEnvelope /></a> 
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