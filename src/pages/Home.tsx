import React, { useState, useEffect } from 'react';
import HeroTwo from '../components/HeroTwo';
import HeroThreeScroll from '../components/HeroThreeScroll';
import HeroFourBento from '../components/HeroFourBento';
import HeroFiveFinal from '../components/HeroFiveFinal';

interface HomeProps {
  onBookNow: (roomIndex: number) => void;
}

const slides = [
  {
    id: '01',
    label: 'THE POOL',
    heading: 'Infinite Horizons',
    description: 'Immerse yourself in our signature infinity pool. As the sun sets, the water seamlessly merges with the vibrant ocean horizon, creating absolute serenity.',
    image: '/hero-images-v2/hero_green_coast.jpeg',
    subtitle: 'Signature infinity pool'
  },
  {
    id: '02',
    label: 'THE RESORT',
    heading: 'Cliffside Luxury',
    description: 'Carved into the rugged coastline, our multi-level resort offers an unprecedented blend of modern architectural elegance and raw natural beauty.',
    image: '/hero-images-v2/hero3_panorama.jpeg',
    subtitle: 'Aerial coastal view'
  },
  {
    id: '03',
    label: 'ARCHITECTURE',
    heading: 'Framing the Sun',
    description: 'Monumental stone archways frame the breathtaking sunset. Light and shadow dance on rough-hewn travertine, creating a living masterpiece of coastal design.',
    image: '/hero-images-v2/hero5_arch.jpeg',
    subtitle: 'The architectural portal'
  },
  {
    id: '04',
    label: 'THE LOBBY',
    heading: 'Indoor Elegance',
    description: 'Step into a space where indoor comfort meets the raw expanse of nature. Floor-to-ceiling glass doors invite the gentle coastal breeze inside.',
    image: '/hero-images-v2/hero3_sanctuary.jpeg',
    subtitle: 'Panoramic living space'
  },
  {
    id: '05',
    label: 'THE TERRACE',
    heading: 'Private Sanctuary',
    description: 'Retreat into absolute privacy on your personal terrace. Experience uninterrupted views of the shifting tides and dramatic mountain sunsets.',
    image: '/hero-images-v2/hero4_terrace.jpeg',
    subtitle: 'Private ocean-facing terrace'
  }
];

export default function Home({ onBookNow }: HomeProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-advance slides every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full bg-black text-white font-sans">

      {/* SECTION 1: Auto-sliding fullscreen hero */}
      <section id="hero-1" className="relative h-screen w-full overflow-hidden bg-black">
        {/* Background images with crossfade */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
              idx === activeIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        {/* Gradient vignettes - reduced darkness to maintain image vibrancy */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 z-0" />

        {/* Main Hero Content */}
        <div className="relative h-full flex flex-col justify-between px-8 sm:px-10 md:px-12 pt-28 sm:pt-32 pb-10 sm:pb-12 z-10 max-w-[1440px] mx-auto w-full">

          {/* Headline and description */}
          <div className="flex flex-col gap-2 sm:gap-4 lg:gap-3 my-auto lg:my-0 lg:mt-24 max-w-[75%] sm:max-w-xl md:max-w-2xl text-left">
            <span className="text-[9px] md:text-[10px] lg:text-xs tracking-[0.25em] lg:tracking-[0.3em] text-white/60 uppercase font-light mb-1 lg:mb-0">
              HERO SECTION {slides[activeIdx].id} / PERSPECTIVE
            </span>
            <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] lg:text-8xl font-serif text-white font-normal tracking-wide transition-all duration-500 leading-[1.05] lg:leading-[1.1] lg:mt-2">
              {slides[activeIdx].heading}
            </h1>
            <p className="text-[clamp(0.85rem,3vw,1rem)] lg:text-base text-white/70 font-sans max-w-md mt-2 sm:mt-4 lg:mt-6 leading-relaxed font-light">
              {slides[activeIdx].description}
            </p>
          </div>

          {/* Bottom slide navigation */}
          <div className="w-full mt-auto">
            <div className="flex justify-end items-center mb-4 text-[9px] md:text-[10px] tracking-[0.25em] text-white/50 uppercase font-light">
              <div className="flex items-center gap-2">
                <span>SCROLL TO EXPLORE</span>
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-ping"></span>
              </div>
            </div>

            <div className="relative w-full border-t border-white/20 pt-5">
              {/* Animated progress line */}
              <div
                className="absolute top-0 h-[1.5px] bg-white transition-all duration-700 ease-out"
                style={{ width: '20%', left: `${activeIdx * 20}%` }}
              />

              {/* Step buttons */}
              <div className="grid grid-cols-5 gap-2 sm:gap-4 md:gap-6">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveIdx(idx)}
                    className="flex flex-col text-left group cursor-pointer focus:outline-none"
                  >
                    <div className="relative -mt-[25px] mb-4 flex items-center justify-start">
                      <span className={`w-[7px] h-[7px] rounded-full border border-white/50 transition-all duration-300 ${
                        idx === activeIdx
                          ? 'bg-white scale-125 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                          : 'bg-transparent group-hover:bg-white/40'
                      }`} />
                    </div>
                    <span className={`text-[9px] md:text-[10px] font-sans font-bold transition-colors duration-300 ${
                      idx === activeIdx ? 'text-white' : 'text-white/40'
                    }`}>
                      {slide.id}
                    </span>
                    <span className={`hidden sm:block text-[9px] sm:text-[10px] md:text-xs font-sans tracking-widest uppercase font-semibold mt-1 transition-colors duration-300 ${
                      idx === activeIdx ? 'text-white' : 'text-white/40 group-hover:text-white'
                    }`}>
                      {slide.label}
                    </span>
                    <span className={`hidden md:inline text-[9px] tracking-wide mt-1 transition-colors duration-300 font-light ${
                      idx === activeIdx ? 'text-white/50' : 'text-white/20 group-hover:text-white/40'
                    }`}>
                      {slide.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Seamless transition gradient to match HeroTwo background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent z-20 pointer-events-none" />
      </section>

      {/* SECTION 2: Editorial split layout */}
      <HeroTwo />

      {/* SECTION 3: Horizontal room scroll gallery */}
      <HeroThreeScroll onBookRoom={onBookNow} />

      {/* Breathing Room Spacer */}
      <section className="w-full py-32 md:py-48 bg-neutral-950 flex flex-col items-center justify-center text-center px-6 border-b border-neutral-900">
        <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase mb-4">04 / THE LIFESTYLE</span>
        <h2 className="font-serif text-3xl md:text-5xl font-light text-white italic max-w-2xl">
          "Where time slows down, and every detail feels designed for absolute serenity."
        </h2>
        <div className="w-px h-16 bg-neutral-800 mt-12"></div>
      </section>

      {/* SECTION 4: Bento feature grid */}
      <HeroFourBento />

      {/* SECTION 5: CTA arch section */}
      <HeroFiveFinal onBookRoom={() => onBookNow(0)} />

    </div>
  );
}
