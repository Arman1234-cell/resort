import React from 'react';

export default function HeroFourBento() {
  const containerBorder = 'border border-neutral-850 bg-neutral-900/10';

  return (
    <section id="hero-4" className="min-h-screen py-24 px-6 lg:px-12 bg-neutral-950 border-t border-neutral-900 select-none">

      <div className="max-w-7xl mx-auto w-full">

        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
              04 / DETAILED RESOLUTION
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          </div>
          <h2 className="font-serif text-[clamp(2rem,7vw,4.5rem)] leading-[1.05] font-light text-white tracking-tight">
            Structured Angles.
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">

          {/* Card 1: Stat block (col span 4) */}
          <div className={`md:col-span-4 p-8 flex flex-col justify-between min-h-[250px] transition-all duration-300 ${containerBorder}`}>
            <div>
              <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                04-A / DIMENSION
              </span>
              <div className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-light text-white mt-4">
                180°
              </div>
            </div>

            <div>
              <h3 className="font-sans text-xs tracking-wider uppercase font-semibold text-neutral-200 mb-2">
                PANORAMA EFFECT
              </h3>
              <p className="font-sans text-neutral-400 text-[clamp(0.8rem,2.5vw,0.9rem)] leading-relaxed">
                All residential suites feature an uninterrupted, wide-angle southwest orientation that guarantees maximum sunlight and coastal exposure.
              </p>
            </div>
          </div>

          {/* Card 2: Landscape image (col span 8) */}
          <div className={`md:col-span-8 aspect-[16/8] rounded-xs overflow-hidden transition-all duration-300 ${containerBorder} relative group`}>
            <img
              src="/assets/hero-balcony-sunset.png"
              alt="Terrace Landscape View"
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 to-transparent pointer-events-none" />
          </div>

          {/* Card 3: Tall vertical image (col span 6) */}
          <div className={`md:col-span-6 aspect-[4/3] md:aspect-[3/4] rounded-xs overflow-hidden transition-all duration-300 ${containerBorder} relative group`}>
            <img
              src="/assets/hero4_glazing.png"
              alt="Architectural Glazing Detail"
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 to-transparent pointer-events-none" />
          </div>

          {/* Card 4: Specifications list (col span 6) */}
          <div className={`md:col-span-6 p-8 lg:p-12 flex flex-col justify-between transition-all duration-300 ${containerBorder}`}>
            <div>
              <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                04-D / SPECIFICATIONS
              </span>

              <h3 className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] leading-[1.05] font-light text-white tracking-tight mt-4 mb-6">
                Architectural Details
              </h3>

              <div className="space-y-4">
                {[
                  { label: '01 / STRUCTURE', desc: 'Exposed concrete and hot-dip galvanized steel.' },
                  { label: '02 / GLAZING', desc: 'Triple insulating glass with an integrated reflection layer.' },
                  { label: '03 / CLIMATE', desc: 'Geothermal underfloor cooling and passive ventilation.' }
                ].map((item, idx) => (
                  <div key={idx} className="border-b border-neutral-900 pb-3 flex justify-between items-baseline gap-4">
                    <span className="font-mono text-[10px] text-neutral-200 font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                    <span className="font-sans text-neutral-400 text-xs text-right">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <p className="font-sans text-neutral-500 text-[11px] leading-relaxed mb-4">
                * All woods used are sourced from sustainable, European forestry and are sealed to withstand sea-water.
              </p>

              <button className="px-6 py-3 bg-white text-neutral-950 font-display text-[10px] tracking-widest uppercase hover:bg-neutral-200 transition-colors w-full cursor-pointer">
                DOWNLOAD TECHNICAL SPECIFICATIONS
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
