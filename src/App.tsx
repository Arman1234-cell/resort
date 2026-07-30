import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Rooms from './components/Rooms';
import Footer from './components/Footer';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Global Lenis Setup for Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--color-brand-dark)] text-[var(--color-brand-light)] font-sans selection:bg-[var(--color-brand-accent)] selection:text-[var(--color-brand-dark)]">
      
      {/* Background Noise for Texture */}
      <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      <Navigation onBook={() => setIsBookingOpen(true)} />

      <main>
        <Hero />
        <Rooms onBook={() => setIsBookingOpen(true)} />
      </main>

      <Footer />

      {/* Booking Modal Placeholder - We will build this later */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-[var(--color-brand-dark)] border border-white/10 p-8 rounded-2xl max-w-lg w-full">
            <h2 className="text-3xl font-serif mb-4">Reserve Your Stay</h2>
            <p className="text-[var(--color-brand-muted)] mb-8">The booking system is currently being upgraded for an enhanced experience.</p>
            <button 
              onClick={() => setIsBookingOpen(false)}
              className="w-full py-3 border border-[var(--color-brand-accent)] text-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)] hover:text-black transition-colors rounded-sm tracking-wider uppercase text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
