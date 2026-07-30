import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
      <div className="max-w-[1440px] mx-auto px-8 py-6 flex justify-between items-center">
        {/* Left Side: Logo */}
        <Link to="/" className="flex flex-col group">
          <span className="text-xl md:text-2xl font-serif tracking-widest text-white uppercase font-bold transition-colors duration-300">
            Halc Resort
          </span>
          <span className="text-[8px] md:text-[9px] tracking-[0.25em] text-white/50 uppercase mt-0.5 font-sans font-light">
            A PRIVATE SANCTUARY
          </span>
        </Link>

        {/* Center: Glassmorphism Pill */}
        <div className="hidden md:flex items-center gap-1 bg-black/30 backdrop-blur-md border border-white/10 rounded-full p-1">
          <Link 
            to="/rooms" 
            className="text-[10px] tracking-widest uppercase px-5 py-2 rounded-full text-white bg-white/10 font-medium hover:bg-white/15 transition-all duration-300"
          >
            Rooms
          </Link>
          <Link 
            to="/login" 
            className="text-[10px] tracking-widest uppercase px-5 py-2 rounded-full text-white/60 hover:text-white font-medium transition-all duration-300"
          >
            Login
          </Link>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="bg-white text-black px-5 py-2.5 text-[10px] tracking-widest uppercase font-semibold hover:bg-white/90 transition-all duration-300">
            Book Now
          </button>
          
          <button className="flex items-center gap-3 border border-white/20 bg-black/20 backdrop-blur-sm text-white px-4 py-2.5 text-[10px] tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300">
            <span>Menu</span>
            <div className="flex flex-col gap-1 w-4">
              <span className="h-[1.5px] w-full bg-current"></span>
              <span className="h-[1.5px] w-full bg-current"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
