import React from 'react';

export default function Rooms() {
  return (
    <div className="pt-32 pb-24 min-h-screen container mx-auto px-6">
      <h1 className="text-4xl md:text-5xl font-serif mb-4 text-center">Our Accommodations</h1>
      <p className="text-center text-[var(--color-brand-muted)] mb-16 max-w-xl mx-auto">
        Carefully designed spaces that blend modern luxury with breathtaking natural surroundings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Ocean Suite */}
        <div className="border border-white/5 bg-white/5 group">
          <div className="aspect-video bg-white/10 w-full"></div>
          <div className="p-8">
            <h2 className="text-2xl font-serif mb-2">Ocean Suite</h2>
            <p className="text-[var(--color-brand-muted)] mb-6">Panoramic views and unparalleled comfort for the ultimate retreat.</p>
            <button className="text-[var(--color-brand-accent)] text-sm tracking-widest uppercase border-b border-[var(--color-brand-accent)] pb-1 hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>

        {/* Garden Villa */}
        <div className="border border-white/5 bg-white/5 group">
          <div className="aspect-video bg-white/10 w-full"></div>
          <div className="p-8">
            <h2 className="text-2xl font-serif mb-2">Garden Villa</h2>
            <p className="text-[var(--color-brand-muted)] mb-6">A secluded haven surrounded by lush tropical flora and private plunge pool.</p>
            <button className="text-[var(--color-brand-accent)] text-sm tracking-widest uppercase border-b border-[var(--color-brand-accent)] pb-1 hover:text-white transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
