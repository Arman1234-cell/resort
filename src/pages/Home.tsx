import React, { useState, useEffect } from 'react';

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

export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Auto slide every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans">
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

      {/* Dark vignette gradient overlay for typography readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-0" />

      {/* Main Content Layout */}
      <div className="relative h-full flex flex-col justify-between px-6 md:px-12 pt-32 pb-12 z-10 max-w-[1440px] mx-auto w-full">
        
        {/* Middle Text: Heading & Description */}
        <div className="flex flex-col gap-3 mt-12 md:mt-24 max-w-2xl text-left">
          <span className="text-[10px] md:text-xs tracking-[0.3em] text-white/60 uppercase font-light">
            HERO SECTION {slides[activeIdx].id} / PERSPECTIVE
          </span>
          <h1 className="text-5xl md:text-8xl font-serif mt-2 text-white font-normal tracking-wide transition-all duration-500 leading-[1.1]">
            {slides[activeIdx].heading}
          </h1>
          <p className="text-sm md:text-base text-white/70 font-sans max-w-md mt-6 leading-relaxed font-light">
            {slides[activeIdx].description}
          </p>
        </div>

        {/* Bottom Area: Slider progress and text */}
        <div className="w-full mt-auto">
          {/* Scroll to explore indicator */}
          <div className="flex justify-between items-end mb-4 text-[9px] md:text-[10px] tracking-[0.25em] text-white/50 uppercase font-light">
            <div></div>
            <div className="flex items-center gap-2">
              <span>SCROLL TO EXPLORE</span>
              <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-ping"></span>
            </div>
          </div>

          {/* Slider Steps & Line */}
          <div className="relative w-full border-t border-white/20 pt-5">
            {/* Smooth Indicator line overlay */}
            <div 
              className="absolute top-0 h-[1.5px] bg-white transition-all duration-700 ease-out"
              style={{ 
                width: '20%', 
                left: `${activeIdx * 20}%` 
              }}
            />

            {/* Step Grid Buttons */}
            <div className="grid grid-cols-5 gap-3 md:gap-6">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveIdx(idx)}
                  className="flex flex-col text-left group cursor-pointer focus:outline-none"
                >
                  {/* Circle Dot overlaying the line */}
                  <div className="relative -mt-[25px] mb-4 flex items-center justify-start">
                    <span className={`w-[7px] h-[7px] rounded-full border border-white/50 transition-all duration-300 ${
                      idx === activeIdx 
                        ? 'bg-white scale-125 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                        : 'bg-transparent group-hover:bg-white/40'
                    }`} />
                  </div>

                  {/* ID */}
                  <span className={`text-[9px] md:text-[10px] font-sans font-bold transition-colors duration-300 ${
                    idx === activeIdx ? 'text-white' : 'text-white/40'
                  }`}>
                    {slide.id}
                  </span>

                  {/* Label */}
                  <span className={`text-[10px] md:text-xs font-sans tracking-widest uppercase font-semibold mt-1 transition-colors duration-300 ${
                    idx === activeIdx ? 'text-white' : 'text-white/40 group-hover:text-white'
                  }`}>
                    {slide.label}
                  </span>

                  {/* Subtitle */}
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

      {/* Floating Chat Button to replicate screenshot */}
      <button className="fixed bottom-8 right-8 z-40 bg-[#00e676] hover:bg-[#00c853] text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-all duration-300 group">
        <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
        {/* Red notification badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 border-2 border-black rounded-full"></span>
      </button>
    </div>
  );
}
