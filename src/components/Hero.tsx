import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0vh', '50vh']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden bg-black">
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        {/* Placeholder image for a luxury resort. Using a high-quality Unsplash image */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=3200&q=80" 
          alt="Halc Resort" 
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[var(--color-brand-accent)] tracking-[0.4em] uppercase text-xs sm:text-sm mb-6">
            Welcome to the extraordinary
          </h2>
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-8 leading-none tracking-tighter">
            Where time <br className="hidden md:block"/> stands still.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll to explore</span>
          <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
            <motion.div 
              animate={{ y: [0, 64] }} 
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="absolute top-0 left-0 w-full h-1/2 bg-[var(--color-brand-accent)]" 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
