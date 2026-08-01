import React from 'react';

export default function Amenities() {
  return (
    <div className="pt-32 pb-24 min-h-screen container mx-auto px-6">
      <h1 className="text-4xl md:text-5xl font-serif mb-16 text-center">Resort Amenities</h1>

      <div className="space-y-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square bg-white/5 border border-white/10"></div>
          <div>
            <h2 className="text-3xl font-serif mb-4 text-[var(--color-brand-accent)]">The Halc Spa</h2>
            <p className="text-[var(--color-brand-muted)] leading-relaxed">
              Rejuvenate your body and mind with our signature treatments using locally sourced organic ingredients.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-serif mb-4 text-[var(--color-brand-accent)]">Infinity Pools</h2>
            <p className="text-[var(--color-brand-muted)] leading-relaxed">
              Lounge by our temperature-controlled infinity pools overlooking the pristine coastline.
            </p>
          </div>
          <div className="aspect-square bg-white/5 border border-white/10 order-1 md:order-2"></div>
        </div>
      </div>
    </div>
  );
}
