import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black text-[var(--color-brand-light)] py-20 px-6 md:px-12 border-t border-white/5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        
        <div className="col-span-1 md:col-span-2">
          <div className="text-4xl font-serif tracking-widest uppercase mb-6">
            Halc.
          </div>
          <p className="text-[var(--color-brand-muted)] max-w-sm font-light">
            A sanctuary of tranquility where time stands still. Discover uncompromised luxury harmonized with nature.
          </p>
        </div>

        <div>
          <h4 className="text-[var(--color-brand-accent)] text-xs tracking-widest uppercase mb-6">Explore</h4>
          <ul className="flex flex-col gap-4 text-sm text-white/70">
            <li><a href="#villas" className="hover:text-white transition-colors">Villas & Suites</a></li>
            <li><a href="#experiences" className="hover:text-white transition-colors">Experiences</a></li>
            <li><a href="#dining" className="hover:text-white transition-colors">Culinary</a></li>
            <li><a href="#wellness" className="hover:text-white transition-colors">Wellness Spa</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[var(--color-brand-accent)] text-xs tracking-widest uppercase mb-6">Contact</h4>
          <ul className="flex flex-col gap-4 text-sm text-white/70">
            <li>reservations@halc.site</li>
            <li>+1 (800) 123-4567</li>
            <li className="mt-4 text-xs">
              123 Coastal Drive, <br/>
              Emerald Bay, 90210
            </li>
          </ul>
        </div>

      </div>
      
      <div className="container mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
        <p>&copy; {new Date().getFullYear()} Halc Resort. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
