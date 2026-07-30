import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const rooms = [
  {
    id: 1,
    title: 'The Sanctuary Villa',
    desc: 'An intimate escape nestled in nature with a private plunge pool and endless ocean views.',
    img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    price: '$850 / night'
  },
  {
    id: 2,
    title: 'The Ocean Pavilion',
    desc: 'Hovering over the crystal clear waters, providing direct access to the vibrant marine life below.',
    img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    price: '$1,200 / night'
  },
  {
    id: 3,
    title: 'The Cliffside Suite',
    desc: 'Perched high above the coastline, offering breathtaking panoramic vistas and ultimate privacy.',
    img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    price: '$1,500 / night'
  }
];

export default function Rooms({ onBook }: { onBook: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'end start']
  });

  return (
    <section id="villas" ref={container} className="relative w-full bg-[var(--color-brand-dark)] py-32 px-4 sm:px-8 md:px-16 overflow-hidden">
      
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-24 md:w-2/3"
        >
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Sanctuaries of <br/> Tranquility</h2>
          <p className="text-[var(--color-brand-muted)] text-lg md:text-xl font-light max-w-lg">
            Experience uncompromised luxury and unparalleled comfort in our carefully curated spaces, designed to harmonize with the natural beauty around you.
          </p>
        </motion.div>

        <div className="flex flex-col gap-32">
          {rooms.map((room, i) => {
            const isEven = i % 2 === 0;
            return (
              <div key={room.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}>
                
                {/* Image Reveal */}
                <div className="w-full md:w-1/2 overflow-hidden rounded-sm group relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700 z-10" />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full aspect-[4/5] md:aspect-[3/4]"
                  >
                    <img 
                      src={room.img} 
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                {/* Text Content */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="w-full md:w-1/2 flex flex-col justify-center"
                >
                  <span className="text-[var(--color-brand-accent)] text-xs tracking-[0.2em] uppercase mb-4 block">0{i + 1}</span>
                  <h3 className="text-3xl md:text-5xl font-serif mb-6">{room.title}</h3>
                  <p className="text-[var(--color-brand-muted)] mb-10 text-lg font-light leading-relaxed max-w-md">
                    {room.desc}
                  </p>
                  
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={onBook}
                      className="px-8 py-4 border border-white/20 hover:border-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent)] hover:text-black transition-all duration-300 rounded-sm uppercase tracking-widest text-xs"
                    >
                      Book Now
                    </button>
                    <span className="text-sm text-white/50">{room.price}</span>
                  </div>
                </motion.div>

              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
