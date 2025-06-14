import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Outlet } from "react-router-dom"; // Outlet untuk menampilkan halaman dinamis

const MainLayout = () => {
  return (
    <div className="main-content">
      <Navbar />
      <Outlet /> {/* Semua halaman yang memakai MainLayout akan muncul di sini */}
      <Footer />
    </div>
  );
};

export default MainLayout;