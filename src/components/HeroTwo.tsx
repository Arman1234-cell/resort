import React from 'react';

export default function HeroTwo() {
  return (
    <section id="hero-2" className="min-h-screen py-24 px-6 lg:px-12 flex items-center bg-neutral-950 border-t border-neutral-900 relative select-none">
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Column 1: Vertical editorial marker / section description (Col span: 3) */}
        <div className="md:col-span-3 flex flex-col gap-6 md:sticky md:top-32">
          <div>
            <span className="font-mono text-xs tracking-widest text-neutral-500 block mb-2">
              03 / PERSPECTIVE
            </span>
            <h2 className="font-serif text-3xl font-light text-neutral-100 italic leading-snug">
              A frame, sculpted in stone & light
            </h2>
          </div>
          
          <div className="hidden md:block">
            <span className="font-mono text-[9px] text-neutral-500 block mb-1">LAYOUT SPECS</span>
            <div className="border border-neutral-800 p-3 rounded-xs bg-neutral-900/50 text-neutral-500 font-mono text-[9px] space-y-1">
              <div>• Flex Direction: Column Stack</div>
              <div>• Typography: Serif Italic</div>
              <div>• Gap spacing: 24px (gap-6)</div>
            </div>
          </div>
        </div>

        {/* Column 2: Elegant portrait container (Col span: 5) */}
        <div className="md:col-span-5">
          <div className="w-full aspect-[3/4] rounded-xs flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 border border-neutral-800 bg-neutral-900/20 group">
            
            <img 
              src="/assets/hero2_resort.png" 
              alt="Seaside Resort Facade" 
              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent pointer-events-none" />

            <div className="absolute top-2 left-2 text-neutral-400 font-mono text-[10px] z-10">+</div >
            <div className="absolute top-2 right-2 text-neutral-400 font-mono text-[10px] z-10">+</div >
            <div className="absolute bottom-2 left-2 text-neutral-400 font-mono text-[10px] z-10">+</div >
            <div className="absolute bottom-2 right-2 text-neutral-400 font-mono text-[10px] z-10">+</div >
          </div>
        </div>

        {/* Column 3: Display heading & details stack (Col span: 4) */}
        <div className="md:col-span-4 flex flex-col justify-between self-stretch pt-4 md:pt-0">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-3">
              03_A / ESSENCE
            </span>
            <h3 className="font-display text-2xl lg:text-3xl font-medium tracking-tight text-white uppercase mb-6">
              Geometric harmony.
            </h3>
            <p className="font-sans text-neutral-400 text-sm leading-relaxed mb-8">
              The minimalist language of form allows the eye to wander. Natural stone meets floor-to-ceiling glass fronts—a dialogue of weight, transparency, and marine light.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col border-l-2 border-neutral-800 pl-4 py-1">
              <span className="font-mono text-[10px] text-neutral-500">
                EST. VOLUME
              </span>
              <span className="font-sans text-sm font-medium text-neutral-350">
                450m² of private panoramic terrace
              </span>
            </div>

            <button className="w-full md:w-auto self-start px-6 py-3 border border-neutral-700 text-[11px] font-display tracking-widest uppercase hover:bg-white hover:text-black hover:border-white text-white transition-all cursor-pointer">
              VIEW DETAILS
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
