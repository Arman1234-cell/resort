import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 glass">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif tracking-widest text-[var(--color-brand-accent)] uppercase">
          Halc Resort
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link to="/rooms" className="text-sm tracking-widest uppercase hover:text-[var(--color-brand-accent)] transition-colors">Accommodations</Link>
          <Link to="/amenities" className="text-sm tracking-widest uppercase hover:text-[var(--color-brand-accent)] transition-colors">Amenities</Link>
          <Link to="/contact" className="text-sm tracking-widest uppercase hover:text-[var(--color-brand-accent)] transition-colors">Contact</Link>
        </nav>
        <button className="border border-[var(--color-brand-accent)] text-[var(--color-brand-accent)] px-6 py-2 rounded-sm text-sm tracking-widest uppercase hover:bg-[var(--color-brand-accent)] hover:text-black transition-colors">
          Book Now
        </button>
      </div>
    </header>
  );
}
