import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { Outlet } from "react-router-dom"; // Agar halaman dinamis muncul di dalamnya

const MainLayout = () => {
  return (
    <div className="App">
      <Navbar />
      <Outlet /> {/* Semua halaman yang memakai MainLayout akan muncul di sini */}
      <Footer />
    </div>
  );
};

export default MainLayout;