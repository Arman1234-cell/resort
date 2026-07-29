import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function HeroOne() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  // Preload and metadata handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkDuration = () => {
      if (video.duration && !isNaN(video.duration) && video.duration !== Infinity) {
        setIsLoaded(true);
        setTimeout(() => {
          setFadeLoader(true);
          setTimeout(() => {
            setShowLoader(false);
          }, 800);
        }, 300);
      } else {
        setTimeout(checkDuration, 200);
      }
    };

    if (video.readyState >= 2) {
      checkDuration();
    } else {
      video.addEventListener('loadeddata', checkDuration);
    }

    return () => {
      video.removeEventListener('loadeddata', checkDuration);
    };
  }, []);

  // GSAP ScrollTrigger setup
  useEffect(() => {
    if (!isLoaded) return;

    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const ctx = gsap.context(() => {
      // Ensure video is playing at a cinematic speed
      video.playbackRate = 0.6;
      video.loop = true;
      video.muted = true;
      video.play().catch(e => console.warn('Video autoplay blocked:', e));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const stage = Math.min(4, Math.floor(progress * 5));
            setActiveStage(stage);
          },
        },
      });

      // Parallax & Scale Effect
      tl.fromTo(video,
        { scale: 1.0, y: 0 },
        { scale: 1.05, y: 30, ease: 'none', duration: 10 },
        0
      );

      // Text block 1 (Intro)
      tl.to('.text-block-1', {
        opacity: 0,
        y: -40,
        pointerEvents: 'none',
        ease: 'power2.inOut',
        duration: 2.0,
      }, 1.5);

      // Text block 2 (Middle)
      tl.fromTo('.text-block-2', {
        opacity: 0,
        y: 40,
      }, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 2.0,
      }, 3.5);

      tl.to('.text-block-2', {
        opacity: 0,
        y: -40,
        pointerEvents: 'none',
        ease: 'power2.inOut',
        duration: 2.0,
      }, 6.0);

      // Text block 3 (Outro / CTA)
      tl.fromTo('.text-block-3', {
        opacity: 0,
        y: 40,
      }, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: 2.0,
      }, 7.8);

      tl.to('.text-block-3', {
        opacity: 0,
        y: -20,
        ease: 'power2.inOut',
        duration: 1.0,
      }, 9.4);

    }, container);

    // Initial fade in for video and Text block 1
    gsap.fromTo(video,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' }
    );

    gsap.to('.text-block-1', { opacity: 1, duration: 0.1 });
    gsap.fromTo('.text-block-1 > *', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.6, ease: 'power3.out', stagger: 0.2 }
    );

    return () => {
      ctx.revert();
    };
  }, [isLoaded]);


  return (
    <div 
      ref={containerRef} 
      id="hero-1" 
      className="relative w-full h-[400vh] bg-neutral-950 text-neutral-100 select-none"
    >
      {/* Sticky Frame Viewer */}
      <div 
        ref={stickyRef} 
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* Cinematic Video Background */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload"
          autoPlay
          loop
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-0"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* User Required Overlay: linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.40)) */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.40))' }}
        />

        {/* Original Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/80 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10" />

        {/* Header Offset Spacing */}
        <div className="pt-28 z-20 pointer-events-none" />

        {/* Cinematic Content Stack */}
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 flex-grow flex items-center justify-start z-20">
          
          <div className="relative grid max-w-2xl w-full">
            {/* Text Block 1: Arrival / Intro */}
            <div className="text-block-1 col-start-1 row-start-1 flex flex-col items-start text-left opacity-0 pointer-events-none">
              <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-4">
                HERO SECTION 01 / PERSPECTIVE
              </span>
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white leading-none tracking-tight font-medium mb-6">
                The Ocean
                <br />First
              </h1>
              <p className="font-sans text-neutral-300 text-sm sm:text-base leading-relaxed max-w-md">
                Even upon arrival, the day loses its weight. Behind you rests the rock, before you lies this blue, which instantly quietens everything else.
              </p>
            </div>

            {/* Text Block 2: Middle Transition */}
            <div className="text-block-2 col-start-1 row-start-1 flex flex-col items-start text-left opacity-0 pointer-events-none">
              <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-4">
                MOMENT 02 / ARRIVAL
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white leading-none tracking-tight font-light italic mb-6">
                Sensing the Breeze
              </h2>
              <p className="font-sans text-neutral-300 text-sm sm:text-base leading-relaxed max-w-md">
                An arrival that feels less like a destination, and more like an unfolding transition of light, air, and minimalist geometry.
              </p>
            </div>

            {/* Text Block 3: Outro / Call To Action */}
            <div className="text-block-3 col-start-1 row-start-1 flex flex-col items-start text-left opacity-0 pointer-events-none">
              <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400 uppercase mb-4">
                EXCLUSIVE SEASIDE RETREAT
              </span>
              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white leading-none tracking-tight font-medium mb-8">
                Palasë Coast
              </h2>
              <p className="font-sans text-neutral-300 text-sm sm:text-base leading-relaxed max-w-md mb-8">
                A private ocean-facing sanctuary where architecture respects the shoreline and luxury finds its quietest expression.
              </p>
              <div className="pointer-events-auto">
                <MagneticButton strength={40}>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('hero-3');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 border border-neutral-300 text-[11px] font-display tracking-[0.15em] uppercase hover:bg-white hover:text-black hover:border-white text-white transition-all duration-300 cursor-pointer"
                  >
                    DISCOVER THE SPACES
                  </button>
                </MagneticButton>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Timeline Track (Sticky inside hero-1 wrapper) */}
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pb-12 z-20 pointer-events-none">
          <div className="w-full pt-6 border-t border-neutral-900/60 flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between text-neutral-500">
              <span className="font-mono text-[10px] tracking-widest uppercase">
                FROM ROCK TO WATER | ARRIVAL / STILLNESS / RETREAT
              </span>
              <span className="font-mono text-[9px] uppercase animate-pulse">
                SCROLL TO EXPLORE
              </span>
            </div>

            {/* 5-Stage Step Indicators linking scroll progress */}
            <div className="grid grid-cols-5 gap-3 pointer-events-auto">
              {[
                { num: '01', title: 'ARRIVAL', desc: 'First contact view' },
                { num: '02', title: 'THRESHOLD', desc: 'Sensing the sea breeze' },
                { num: '03', title: 'LOBBY', desc: 'The architectural frame' },
                { num: '04', title: 'CONCIERGE', desc: 'Bespoke coastal access' },
                { num: '05', title: 'ROOMS', desc: 'Private ocean-facing sanctuary' }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    const scrollHeight = containerRef.current?.offsetHeight || 0;
                    const scrollTop = containerRef.current?.offsetTop || 0;
                    // Scroll to corresponding percentage zone
                    const targetScroll = scrollTop + (idx * 0.22) * scrollHeight;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }}
                  className={`flex flex-col pt-3 relative group border-t transition-all duration-350 cursor-pointer ${
                    activeStage === idx 
                      ? 'border-white text-white' 
                      : 'border-neutral-800 hover:border-neutral-500 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {/* Active Indicator Dot */}
                  {activeStage === idx && (
                    <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-white animate-ping" />
                  )}
                  {activeStage === idx && (
                    <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-white" />
                  )}
                  <span className="font-mono text-[9px]">
                    {item.num}
                  </span>
                  <span className="font-sans text-[11px] font-medium tracking-wider uppercase mt-1 leading-none">
                    {item.title}
                  </span>
                  <span className="hidden md:block font-sans text-[9px] text-neutral-500 mt-1 leading-tight group-hover:text-neutral-400 transition-colors">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Premium Dark Preloader Overlay */}
      {showLoader && (
        <div 
          className={`fixed inset-0 bg-neutral-950 flex flex-col items-center justify-center z-50 transition-opacity duration-700 ease-in-out ${
            fadeLoader ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col items-center max-w-xs w-full px-6">
            {/* Visual branding dot sequence */}
            <div className="flex items-center gap-1.5 mb-8">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" 
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>

            <span className="font-mono text-[9px] tracking-[0.3em] text-neutral-500 uppercase mb-2">
              PALASË COASTAL RETREAT
            </span>
            <h2 className="font-serif text-sm text-neutral-300 font-light italic mb-6">
              Preloading Cinematic Sequence
            </h2>

            {/* Custom high-end linear progress bar */}
            <div className="w-full h-[1px] bg-neutral-900 rounded-full overflow-hidden mb-3 relative">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out" 
                style={{ width: isLoaded ? '100%' : '50%' }}
              />
            </div>

            <span className="font-mono text-[10px] text-neutral-400">
              {isLoaded ? '100%' : 'Loading...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
