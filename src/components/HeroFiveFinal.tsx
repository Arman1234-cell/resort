import React from 'react';

interface HeroFiveFinalProps {
  onBookRoom: () => void;
}

export default function HeroFiveFinal({ onBookRoom }: HeroFiveFinalProps) {
  const containerBorder = 'border border-neutral-850 bg-neutral-900/10';

  return (
    <section id="hero-5" className="min-h-screen py-24 px-6 lg:px-12 bg-neutral-950 border-t border-neutral-900 flex flex-col justify-center select-none relative overflow-hidden">
      
      {/* Symmetrical Grid Guideline Centerline */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-neutral-850 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full text-center flex flex-col items-center z-10">
        
        {/* Category Index Tag */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
            05 / THE PRIVACY
          </span>
        </div>

        {/* Display Serif Headings */}
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-tight mb-8">
          Find your place on the coast.
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl mb-12">
          Reservations for the upcoming season are now open. Experience absolute privacy within our private coastal reserve.
        </p>

        {/* Massive Centered Archway / Gateway Media */}
        <div className={`w-full max-w-2xl aspect-[16/7] rounded-t-full overflow-hidden mb-12 relative transition-all duration-300 ${containerBorder} group`}>
          <img 
            src="/assets/hero5_arch.png" 
            alt="Arched Sunset Portal" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-700 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent pointer-events-none" />
        </div>

        {/* Dynamic Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button 
            onClick={onBookRoom}
            className="w-full sm:w-auto px-8 py-4 bg-white text-neutral-950 font-display text-xs tracking-widest uppercase hover:bg-neutral-250 transition-colors cursor-pointer border-0 rounded-xs"
          >
            START RESERVATION INQUIRY
          </button>
          <button className="w-full sm:w-auto px-8 py-4 border border-neutral-850 bg-neutral-900 text-neutral-300 font-display text-xs tracking-widest uppercase hover:border-neutral-700 hover:text-white transition-colors cursor-pointer rounded-xs">
            ORDER BROCHURE
          </button>
        </div>

        {/* Tiny footnote alignment */}
        <div className="mt-16 flex flex-col items-center gap-1">
          <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
            GREEN COAST PALASË — ALBANIAN RIVIERA
          </span>
          <span className="w-6 h-px bg-neutral-850 mt-2"></span>
        </div>

      </div>

    </section>
  );
}
