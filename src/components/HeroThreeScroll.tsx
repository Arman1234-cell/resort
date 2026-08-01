import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface SimpleSlide {
  id: string;
  number: string;
  title: string;
  description: string;
  ratio: string;
}

interface HeroThreeScrollProps {
  onBookRoom: (idx: number) => void;
}

export default function HeroThreeScroll({ onBookRoom }: HeroThreeScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const slides: SimpleSlide[] = [
    {
      id: 'slide-1',
      number: '02-A',
      title: 'The Ocean Pavilion',
      description: 'Oriented directly toward the shore. Experience the rhythm of the waves from your private wooden deck, featuring direct coastal access and expansive panoramic views.',
      ratio: 'ASPECT_16:9_WIDE',
    },
    {
      id: 'slide-2',
      number: '02-B',
      title: 'The Horizon Loft',
      description: 'Sleek, double-height architectural lofts where raw sand-colored concrete meets custom warm teak wood. A minimalist frame crafted to celebrate absolute coastal stillness.',
      ratio: 'ASPECT_4:5_AND_1:1',
    },
    {
      id: 'slide-3',
      number: '02-C',
      title: 'The Cliffside Pool Suite',
      description: 'Perched high on the cliffs, featuring a private heated infinity pool that visually merges into the sea, offering a direct dialogue with the horizon.',
      ratio: 'ASPECT_3:4_TALL',
    },
    {
      id: 'slide-4',
      number: '02-D',
      title: 'The Sanctuary Villa',
      description: 'An exclusive, secluded beachside sanctuary surrounded by natural stone walls. Includes private garden terrace, outdoor fireplace, and 180° views of the ocean.',
      ratio: 'ASPECT_CIRCLE_FOCAL',
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    
    if (!section || !track) return;

    const getScrollAmount = () => {
      const trackWidth = track.scrollWidth;
      return -(trackWidth - window.innerWidth);
    };

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Greatly reduced scroll distance so one wheel scroll moves to the next image
          end: () => `+=${window.innerHeight}`,
          pin: true,
          scrub: 0.5,
          snap: 1 / (slides.length - 1),
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress * 100);
          }
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Proximity-based scale for active slide zoom
  const getScale = (idx: number) => {
    const targetProgress = idx * 33.33;
    const distance = Math.abs(scrollProgress - targetProgress);
    const threshold = 33.33;
    if (distance >= threshold) return 1.0;
    const factor = 1 - (distance / threshold);
    const easeFactor = Math.sin(factor * Math.PI / 2);
    return 1.0 + easeFactor * 0.15;
  };

  return (
    <section id="hero-3" ref={sectionRef} className="h-screen w-full relative select-none overflow-hidden bg-neutral-950 border-t border-b border-neutral-900 flex flex-col">

      {/* Top Header (Static within pinned section) */}
      <div className="pt-24 px-6 lg:px-12 w-full flex items-center justify-between z-20 shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
              02 / ROOM TYPES &amp; SUITES
            </span>
            <span className="font-mono text-[8px] bg-neutral-900 text-neutral-400 border border-neutral-800 px-1">ST_TRACK</span>
          </div>
          <h2 className="font-serif text-[clamp(1.25rem,3vw,1.5rem)] font-medium tracking-tight text-white mt-1">
            Exclusive Rooms &amp; Private Sanctuaries
          </h2>
        </div>

        {/* Scroll progress indicator */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-neutral-500 hidden sm:block">
            SCROLL PROGRESS
          </span>
          <div className="w-24 sm:w-32 h-1 bg-neutral-900 rounded-full overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-white transition-none"
              style={{ width: `${scrollProgress}%` }}
            ></div>
          </div>
          <span className="font-mono text-xs font-semibold w-8 text-right text-neutral-200">
            {Math.round(scrollProgress)}%
          </span>
        </div>
      </div>

      {/* Horizontal Track Wrapper */}
      <div className="flex-1 w-full relative">
        <div
          ref={trackRef}
          className="flex h-full items-center absolute top-0 left-0"
          style={{ width: `${slides.length * 100}vw` }}
        >
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className="w-screen h-full flex items-center px-6 lg:px-12 py-8 lg:py-16"
            >
              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

                {/* Left: text content */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="font-serif text-[clamp(2.5rem,6vw,4rem)] font-light text-neutral-800">
                      {slide.number}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                      CHAPTER {idx + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] font-medium text-white tracking-tight mb-4">
                    {slide.title}
                  </h3>

                  <p className="font-sans text-[clamp(0.85rem,3vw,1rem)] text-neutral-400 leading-relaxed mb-6 max-w-md">
                    {slide.description}
                  </p>

                  <button
                    onClick={() => onBookRoom(idx)}
                    className="mb-8 px-6 py-3 self-start border border-neutral-700 hover:border-white text-[10px] font-display tracking-widest uppercase bg-transparent text-white hover:bg-white hover:text-black transition-all cursor-pointer rounded-xs"
                  >
                    BOOK THIS ROOM
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-px bg-neutral-800"></span>
                    <span className="font-mono text-[9px] tracking-wider text-neutral-500 uppercase">
                      HORIZONTAL FLOW GRID
                    </span>
                  </div>
                </div>

                {/* Right: visual content per slide */}
                <div className="lg:col-span-7">

                  {idx === 0 && (
                    <div className="w-full aspect-[16/9] rounded-xs overflow-hidden relative border border-neutral-850 bg-neutral-900/20 group">
                      <img
                        src="/assets/hero-cliff-villa.png"
                        alt="Coastline Panorama"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                        style={{
                          transform: `scale(${getScale(0)})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 to-transparent pointer-events-none" />
                    </div>
                  )}

                  {idx === 1 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="aspect-[4/5] rounded-xs overflow-hidden relative border border-neutral-850 bg-neutral-900/20 group">
                        <img
                          src="/assets/hero4_glazing.png"
                          alt="Horizon Loft Glazing"
                          className="absolute inset-0 w-full h-full object-cover opacity-90"
                          style={{
                            transform: `scale(${getScale(1)})`,
                          }}
                        />
                      </div>
                      <div className="aspect-[1/1] rounded-xs overflow-hidden relative self-center border border-neutral-850 bg-neutral-900/20 group">
                        <img
                          src="/assets/hero3_material_portrait.png"
                          alt="Horizon Loft Details"
                          className="absolute inset-0 w-full h-full object-cover opacity-90"
                          style={{
                            transform: `scale(${getScale(1)})`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {idx === 2 && (
                    <div className="max-w-md mx-auto relative">
                      <div className="w-full aspect-[3/4] rounded-xs overflow-hidden relative border border-neutral-850 bg-neutral-900/20 group">
                        <img
                          src="/assets/hero3_pool.png"
                          alt="Infinity Cliffside Pool"
                          className="absolute inset-0 w-full h-full object-cover opacity-90"
                          style={{
                            transform: `scale(${getScale(2)})`,
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/10 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {idx === 3 && (
                    <div className="flex flex-col gap-6 items-center">
                      <div className="w-48 h-48 rounded-full overflow-hidden relative border border-neutral-850 bg-neutral-900/20 group">
                        <img
                          src="/assets/hero-lobby-interior.png"
                          alt="Private Villa Sanctuary"
                          className="absolute inset-0 w-full h-full object-cover opacity-90"
                          style={{
                            transform: `scale(${getScale(3)})`,
                          }}
                        />
                      </div>

                      <div className="text-center">
                        <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
                          CHAPTER CONCLUSION
                        </span>
                        <span className="block font-sans text-xs text-neutral-500 mt-1">
                          Continue scrolling for Section 03
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom navigation dots */}
      <div className="pb-8 px-6 lg:px-12 w-full flex items-center justify-between z-20 shrink-0 border-t border-neutral-900 pt-6">
        <span className="font-mono text-[9px] text-neutral-500 uppercase">
          HORIZONTAL NAVIGATION COMPILATION
        </span>
        <div className="flex gap-2">
          {slides.map((_, i) => {
            const activeSlide = Math.min(3, Math.floor(scrollProgress / 25.1));
            return (
              <div
                key={i}
                className={`h-1.5 transition-all duration-200 rounded-full ${
                  i === activeSlide ? 'w-6 bg-white' : 'w-2 bg-neutral-800'
                }`}
              ></div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

