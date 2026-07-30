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
    id: "01",
    label: "ARRIVAL",
    heading: "The Ocean First",
    description: "Even upon arrival, the day loses its weight. Behind you rests the rock, before you lies this blue, which instantly quietens everything else.",
    image: "/assets/hero_green_coast.png",
    subtitle: "First contact view"
  },
  {
    id: "02",
    label: "THRESHOLD",
    heading: "Sensing the Breeze",
    description: "Step across the threshold where indoor elegance meets the raw expanse of nature. Feel the gentle coastal winds carry the scent of salt and pine.",
    image: "/assets/hero3_panorama.png",
    subtitle: "Sensing the sea breeze"
  },
  {
    id: "03",
    label: "LOBBY",
    heading: "Architectural Frame",
    description: "Clean stone corridors open directly to the sky. Light and shadow dance on the rough-hewn travertine, guiding you towards the horizon.",
    image: "/assets/hero5_arch.png",
    subtitle: "The architectural frame"
  },
  {
    id: "04",
    label: "CONCIERGE",
    heading: "Bespoke Access",
    description: "Every request is anticipated. From hidden trails to private boat charters, our dedicated hosts weave the resort's magic into custom itineraries.",
    image: "/assets/hero3_sanctuary.png",
    subtitle: "Bespoke coastal access"
  },
  {
    id: "05",
    label: "ROOMS",
    heading: "Private Sanctuary",
    description: "Retreat into absolute privacy. Floor-to-ceiling glass reveals the shifting moods of the tide, while natural materials envelope you in warmth.",
    image: "/assets/hero4_terrace.png",
    subtitle: "Private ocean-facing sanctuary"
  }
];

export default function Home({ onBookNow }: HomeProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto slide every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full bg-black text-white font-sans overflow-x-hidden">

      {/* ── SECTION 1: Auto-Sliding Hero ─────────────────────────── */}
      <section id="hero-1" className="relative h-screen w-full overflow-hidden bg-black">
        {/* Background Images with Fade Effect */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
              idx === activeIdx ? 'opacity-80 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}

        {/* Dark vignette gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

        {/* Main Content */}
        <div className="relative h-full flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-28 sm:pt-32 pb-10 sm:pb-12 z-10 max-w-[1440px] mx-auto w-full">
          
          {/* Heading & Description */}
          <div className="flex flex-col gap-3 mt-8 sm:mt-12 md:mt-24 max-w-2xl text-left">
            <span className="text-[10px] md:text-xs tracking-[0.3em] text-white/60 uppercase font-light">
              HERO SECTION {slides[activeIdx].id} / PERSPECTIVE
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif mt-2 text-white font-normal tracking-wide transition-all duration-500 leading-[1.1]">
              {slides[activeIdx].heading}
            </h1>
            <p className="text-sm md:text-base text-white/70 font-sans max-w-md mt-4 sm:mt-6 leading-relaxed font-light">
              {slides[activeIdx].description}
            </p>
          </div>

          {/* Bottom: Slider steps */}
          <div className="w-full mt-auto">
            <div className="flex justify-end items-center mb-4 text-[9px] md:text-[10px] tracking-[0.25em] text-white/50 uppercase font-light">
              <div className="flex items-center gap-2">
                <span>SCROLL TO EXPLORE</span>
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-ping"></span>
              </div>
            </div>

            <div className="relative w-full border-t border-white/20 pt-5">
              {/* Smooth progress line */}
              <div
                className="absolute top-0 h-[1.5px] bg-white transition-all duration-700 ease-out"
                style={{ width: '20%', left: `${activeIdx * 20}%` }}
              />

              {/* Step Buttons */}
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
                    <span className={`text-[9px] sm:text-[10px] md:text-xs font-sans tracking-widest uppercase font-semibold mt-1 transition-colors duration-300 ${
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
      </section>

      {/* ── SECTION 2: Editorial Split Layout ────────────────────── */}
      <HeroTwo />

      {/* ── SECTION 3: Horizontal Room Scroll Gallery ────────────── */}
      <HeroThreeScroll onBookRoom={onBookNow} />

      {/* ── SECTION 4: Bento Features Grid ────── */}
      <HeroFourBento />

      {/* ── SECTION 5: Arch CTA / Call to Book ───────────────────── */}
      <HeroFiveFinal onBookRoom={() => onBookNow(0)} />

    </div>
  );
}
