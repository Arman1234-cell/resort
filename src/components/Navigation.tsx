import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  onBook: () => void;
}

export default function Navigation({ onBook }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
          isScrolled 
            ? 'glass border-white/5 py-4' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="text-2xl font-serif tracking-widest uppercase">
            Halc.
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            {['Villas', 'Experiences', 'Dining', 'Wellness'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sm tracking-widest uppercase text-[var(--color-brand-light)]/70 hover:text-[var(--color-brand-accent)] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={onBook}
              className="hidden md:inline-block px-6 py-2.5 border border-[var(--color-brand-accent)] text-[var(--color-brand-accent)] text-xs tracking-[0.2em] uppercase hover:bg-[var(--color-brand-accent)] hover:text-black transition-colors rounded-sm"
            >
              Reserve
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden flex flex-col gap-1.5 p-2"
            >
              <span className="block w-6 h-[1px] bg-white"></span>
              <span className="block w-6 h-[1px] bg-white"></span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[var(--color-brand-dark)] flex flex-col p-6"
          >
            <div className="flex justify-between items-center py-4 border-b border-white/10">
              <div className="text-2xl font-serif tracking-widest uppercase">Halc.</div>
              <button onClick={() => setIsMenuOpen(false)} className="text-sm tracking-widest uppercase">Close</button>
            </div>
            
            <div className="flex flex-col gap-8 mt-20 px-4">
              {['Villas', 'Experiences', 'Dining', 'Wellness'].map((item, i) => (
                <motion.a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1), duration: 0.5 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-serif"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <motion.button 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              onClick={() => { setIsMenuOpen(false); onBook(); }}
              className="mt-auto mb-10 mx-4 py-4 bg-[var(--color-brand-accent)] text-black tracking-[0.2em] uppercase text-sm font-semibold rounded-sm"
            >
              Reserve Stay
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
