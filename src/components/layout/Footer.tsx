import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black py-16 border-t border-white/5">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-serif text-[var(--color-brand-accent)] mb-4">Halc Resort</h3>
          <p className="text-[var(--color-brand-muted)]">Experience luxury redefined.</p>
        </div>
        <div className="flex flex-col space-y-3">
          <Link to="/rooms" className="text-sm tracking-widest uppercase hover:text-[var(--color-brand-accent)] transition-colors">Accommodations</Link>
          <Link to="/amenities" className="text-sm tracking-widest uppercase hover:text-[var(--color-brand-accent)] transition-colors">Amenities</Link>
          <Link to="/contact" className="text-sm tracking-widest uppercase hover:text-[var(--color-brand-accent)] transition-colors">Contact</Link>
        </div>
        <div>
          <h4 className="text-sm tracking-widest uppercase mb-4">Contact Us</h4>
          <p className="text-[var(--color-brand-muted)]">contact@halcresort.com</p>
          <p className="text-[var(--color-brand-muted)]">+1 (800) 123-4567</p>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-xs text-[var(--color-brand-muted)]">
        &copy; {new Date().getFullYear()} Halc Resort. All rights reserved.
      </div>
    </footer>
  );
}
