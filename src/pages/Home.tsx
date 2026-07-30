import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="pt-24 min-h-screen">
      <section className="relative h-[80vh] flex items-center justify-center border-b border-white/5">
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-gradient">Welcome to Halc</h1>
          <p className="text-lg md:text-xl text-[var(--color-brand-muted)] mb-10 max-w-2xl mx-auto">
            A sanctuary of tranquility and luxury. Escape the ordinary and immerse yourself in unparalleled elegance.
          </p>
          <Link to="/rooms" className="inline-block bg-[var(--color-brand-accent)] text-black px-8 py-3 rounded-sm text-sm tracking-widest uppercase hover:bg-white transition-colors">
            Discover Our Rooms
          </Link>
        </div>
      </section>
      <section className="py-24 container mx-auto px-6">
        <h2 className="text-3xl font-serif text-center mb-12">Featured Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="aspect-square bg-white/5 flex items-center justify-center p-6 text-center border border-white/5 hover:border-[var(--color-brand-accent)] transition-colors cursor-pointer">
              <h3 className="text-xl font-serif">Oceanview Dining</h3>
           </div>
           <div className="aspect-square bg-white/5 flex items-center justify-center p-6 text-center border border-white/5 hover:border-[var(--color-brand-accent)] transition-colors cursor-pointer">
              <h3 className="text-xl font-serif">Serenity Spa</h3>
           </div>
           <div className="aspect-square bg-white/5 flex items-center justify-center p-6 text-center border border-white/5 hover:border-[var(--color-brand-accent)] transition-colors cursor-pointer">
              <h3 className="text-xl font-serif">Private Excursions</h3>
           </div>
        </div>
      </section>
    </div>
  );
}
