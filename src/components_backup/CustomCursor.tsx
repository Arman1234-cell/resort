import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorOutline = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on fine-pointer devices (not touch screens)
    if (window.matchMedia('(pointer: fine)').matches) {
      const onMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        
        // Instant follow for the dot
        gsap.to(cursorDot.current, {
          x: clientX,
          y: clientY,
          duration: 0,
        });

        // Smooth trailing for the outline
        gsap.to(cursorOutline.current, {
          x: clientX,
          y: clientY,
          duration: 0.15,
          ease: "power2.out"
        });
      };

      const onMouseEnterLink = () => {
        gsap.to(cursorOutline.current, {
          scale: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          duration: 0.3,
          ease: "back.out(1.7)"
        });
        gsap.to(cursorDot.current, {
          scale: 0,
          duration: 0.3
        });
      };

      const onMouseLeaveLink = () => {
        gsap.to(cursorOutline.current, {
          scale: 1,
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(cursorDot.current, {
          scale: 1,
          duration: 0.3
        });
      };

      window.addEventListener('mousemove', onMouseMove);

      // Attach hover listeners to interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', onMouseEnterLink);
          el.removeEventListener('mouseleave', onMouseLeaveLink);
        });
      };
    }
  }, []);

  return (
    <>
      <div 
        ref={cursorDot}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        ref={cursorOutline}
        className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9998] mix-blend-difference hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}
