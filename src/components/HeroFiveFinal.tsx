import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroFiveFinalProps {
  onBookRoom: () => void;
}

export default function HeroFiveFinal({ onBookRoom }: HeroFiveFinalProps) {
  const containerRef = useRef<HTMLElement>(null);
  const containerBorder = 'border border-neutral-850 bg-neutral-900/10';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Parallax reveal effect
      gsap.fromTo(el, 
        { yPercent: -30 }, 
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="hero-5" className="min-h-screen py-24 px-6 lg:px-12 bg-neutral-950 border-t border-neutral-900 flex flex-col justify-center select-none relative overflow-hidden">

      {/* Centered dashed guideline */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-neutral-850 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full text-center flex flex-col items-center z-10">

        {/* Section index */}
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
            05 / THE PRIVACY
          </span>
        </div>

        {/* Main headline */}
        <h2 className="font-serif text-[clamp(2.5rem,8vw,5.5rem)] font-light text-white tracking-tight leading-[1.05] mb-8">
          Find your place on the coast.
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-[clamp(0.85rem,3vw,1rem)] text-neutral-400 leading-relaxed max-w-xl mb-12">
          Reservations for the upcoming season are now open. Experience absolute privacy within our private coastal reserve.
        </p>

        {/* Arch gateway image */}
        <div className={`w-full max-w-2xl aspect-[16/7] rounded-t-full overflow-hidden mb-12 relative transition-all duration-300 ${containerBorder} group`}>
          <img
            src="/assets/hero-arch-sunset.png"
            alt="Arched Sunset Portal"
            className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-103 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 to-transparent pointer-events-none" />
        </div>

        {/* Dual CTA buttons */}
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

        {/* Footer note */}
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
