import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function HeroOne() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [activeStage, setActiveStage] = useState(0);

  // Preload and metadata handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkDuration = () => {
      if (video.duration && !isNaN(video.duration) && video.duration !== Infinity) {
        setIsLoaded(true);
        setTimeout(() => {
          setShowLoader(false);
        }, 1500); // Wait for the loading animation to feel intentional
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
    if (showLoader || !containerRef.current || !videoRef.current) return;

    const container = containerRef.current;
    const video = videoRef.current;

    const ctx = gsap.context(() => {
      video.playbackRate = 0.7; // Cinematic slow motion
      video.loop = true;
      video.muted = true;
      video.play().catch(e => console.warn('Video autoplay blocked:', e));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5, // Smoother scrub for premium feel
          onUpdate: (self) => {
            const progress = self.progress;
            const stage = Math.min(4, Math.floor(progress * 5));
            setActiveStage(stage);
          },
        },
      });

      // Parallax & Blur Effect for the video
      tl.fromTo(video,
        { scale: 1.05, y: 0, filter: 'blur(0px)' },
        { scale: 1.15, y: 50, filter: 'blur(8px)', ease: 'none', duration: 10 },
        0
      );

      // Text block 1 (Intro)
      tl.to('.text-block-1', {
        opacity: 0,
        y: -100,
        filter: 'blur(10px)',
        pointerEvents: 'none',
        ease: 'power3.inOut',
        duration: 2.5,
      }, 1.0);

      // Text block 2 (Middle)
      tl.fromTo('.text-block-2', {
        opacity: 0,
        y: 100,
        filter: 'blur(10px)'
      }, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power3.out',
        duration: 2.5,
      }, 3.0);

      tl.to('.text-block-2', {
        opacity: 0,
        y: -100,
        filter: 'blur(10px)',
        pointerEvents: 'none',
        ease: 'power3.inOut',
        duration: 2.5,
      }, 5.5);

      // Text block 3 (Outro / CTA)
      tl.fromTo('.text-block-3', {
        opacity: 0,
        y: 100,
        filter: 'blur(10px)'
      }, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power3.out',
        duration: 2.5,
      }, 7.5);

    }, container);

    // Initial entrance animations
    gsap.fromTo(video,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1.05, duration: 2.5, ease: 'power4.out' }
    );

    gsap.fromTo('.text-block-1 .reveal-text', 
      { opacity: 0, y: 80, rotateX: 20 },
      { opacity: 1, y: 0, rotateX: 0, duration: 1.8, delay: 0.4, ease: 'power4.out', stagger: 0.15 }
    );
    
    gsap.fromTo('.text-block-1 .reveal-fade', 
      { opacity: 0 },
      { opacity: 1, duration: 2, delay: 1.2, ease: 'power2.out' }
    );

    return () => {
      ctx.revert();
    };
  }, [showLoader]);

  // Loader variants
  const loaderVariants = {
    initial: { opacity: 1 },
    exit: { 
      opacity: 0, 
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
    }
  };

  const blindVariants = {
    initial: { y: '0%' },
    exit: (i: number) => ({
      y: '-100%',
      transition: { 
        duration: 1, 
        ease: [0.76, 0, 0.24, 1], 
        delay: i * 0.1 
      }
    })
  };

  return (
    <div 
      ref={containerRef} 
      id="hero-1" 
      className="relative w-full h-[400vh] bg-[#030303] text-neutral-100 select-none font-sans"
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

        {/* Premium Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/40 via-transparent to-[#030303]/80 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(3,3,3,0.7)_100%)] z-10 pointer-events-none" />

        {/* Header Offset Spacing */}
        <div className="pt-32 z-20 pointer-events-none" />

        {/* Cinematic Content Stack */}
        <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-16 flex-grow flex items-center justify-start z-20">
          
          <div className="relative grid w-full">
            {/* Text Block 1: Arrival / Intro */}
            <div className="text-block-1 col-start-1 row-start-1 flex flex-col items-start text-left perspective-1000">
              <div className="overflow-hidden mb-6 reveal-fade">
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#d4af37] uppercase flex items-center gap-4">
                  <div className="w-8 h-[1px] bg-[#d4af37]" />
                  Redefining Hospitality
                </span>
              </div>
              <h1 className="font-serif text-6xl sm:text-8xl lg:text-[9rem] text-white leading-[0.9] tracking-tighter font-light mb-8 -ml-2">
                <div className="overflow-hidden py-2"><div className="reveal-text">The Art of</div></div>
                <div className="overflow-hidden py-2"><div className="reveal-text italic text-neutral-400">Stillness</div></div>
              </h1>
              <p className="font-sans text-neutral-400 text-sm md:text-lg leading-relaxed max-w-xl font-light reveal-fade">
                Experience the first zero-friction resort. Seamless contactless check-in, personalized AI itineraries, and architectural harmony with the ocean.
              </p>
            </div>

            {/* Text Block 2: Middle Transition */}
            <div className="text-block-2 col-start-1 row-start-1 flex flex-col items-start text-left opacity-0 pointer-events-none">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#d4af37] uppercase mb-6 flex items-center gap-4">
                <div className="w-8 h-[1px] bg-[#d4af37]" />
                Zero Friction
              </span>
              <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tighter font-light mb-8">
                Your Time,<br/><span className="italic text-neutral-400">Uninterrupted.</span>
              </h2>
              <p className="font-sans text-neutral-400 text-sm md:text-lg leading-relaxed max-w-xl font-light">
                No queues. No paperwork. Just an effortless transition from arrival to total relaxation, powered by invisible technology.
              </p>
            </div>

            {/* Text Block 3: Outro / Call To Action */}
            <div className="text-block-3 col-start-1 row-start-1 flex flex-col items-start text-left opacity-0 pointer-events-none">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#d4af37] uppercase mb-6 flex items-center gap-4">
                <div className="w-8 h-[1px] bg-[#d4af37]" />
                Palasë Coast
              </span>
              <h2 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tighter font-light mb-10">
                Enter the<br/><span className="italic text-neutral-400">Sanctuary.</span>
              </h2>
              <div className="pointer-events-auto">
                <MagneticButton strength={50}>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('hero-3');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group relative px-10 py-4 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900/30 backdrop-blur-md transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]/10"
                  >
                    <span className="relative z-10 font-mono text-[11px] tracking-[0.2em] uppercase text-white group-hover:text-[#d4af37] transition-colors duration-500">
                      Explore Spaces
                    </span>
                    <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-[0.76,0,0.24,1] bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/10 to-[#d4af37]/0" />
                  </button>
                </MagneticButton>
              </div>
            </div>
          </div>

        </div>

        {/* Premium Glassmorphic Timeline Track */}
        <div className="relative w-full px-6 md:px-16 pb-12 z-30 pointer-events-none">
          <div className="w-full rounded-2xl bg-neutral-900/20 backdrop-blur-lg border border-white/5 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col text-left">
              <span className="font-mono text-[9px] tracking-[0.25em] text-neutral-500 uppercase mb-1">
                Currently Viewing
              </span>
              <span className="font-serif text-sm italic text-neutral-300">
                {['The Art of Stillness', 'Zero Friction', 'Lobby & Architecture', 'Concierge Services', 'Private Ocean Sanctuary'][activeStage]}
              </span>
            </div>

            {/* Custom high-end linear progress bar */}
            <div className="flex-1 w-full max-w-md mx-auto hidden md:flex items-center gap-4">
              <span className="font-mono text-[9px] text-neutral-500">01</span>
              <div className="flex-1 h-[1px] bg-white/10 relative">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#d4af37] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                  style={{ width: `${(activeStage / 4) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[9px] text-neutral-500">05</span>
            </div>
            
            <span className="font-mono text-[9px] tracking-[0.2em] text-[#d4af37] uppercase animate-pulse hidden md:block">
              Scroll to Explore
            </span>
          </div>
        </div>

      </div>

      {/* Cinematic Blinds Preloader */}
      <AnimatePresence>
        {showLoader && (
          <motion.div 
            variants={loaderVariants}
            initial="initial"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            {/* Split Blinds */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={blindVariants}
                className="w-1/5 h-full bg-[#030303] border-r border-white/5 last:border-r-0"
              />
            ))}
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                className="flex flex-col items-center"
              >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#d4af37] to-transparent mb-6 animate-pulse" />
                <h2 className="font-serif text-2xl text-white font-light italic mb-4">
                  Curating your experience...
                </h2>
                <div className="font-mono text-[10px] tracking-[0.3em] text-[#d4af37] uppercase">
                  {isLoaded ? 'Sequence Ready' : 'Loading Assets'}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
