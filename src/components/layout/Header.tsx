import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import MagneticButton from '../MagneticButton';

interface HeaderProps {
  onNavigate: (id: string) => void;
  currentSection: string;
  onBookNow: () => void;
  onOpenAdmin: () => void;
  onOpenCustomer: () => void;
}

export default function Header({ onNavigate, currentSection, onBookNow, onOpenAdmin, onOpenCustomer }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add frosted glass background when scrolled past top
      setIsScrolled(currentScrollY > 20);

      // Hide/Show logic with a small 5px threshold to prevent accidental triggering
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY.current + 5) {
          // Scrolling down
          setIsHidden(true);
        } else if (currentScrollY < lastScrollY.current - 5) {
          // Scrolling up
          setIsHidden(false);
        }
      } else {
        // Always show at top
        setIsHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-3 sm:py-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isHidden ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        } ${
          isScrolled ? 'bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900' : 'bg-transparent border-b-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Left: Logo and tagline */}
          <div className="flex flex-col select-none cursor-pointer" onClick={() => onNavigate('hero-1')}>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl lg:text-2xl font-semibold tracking-tight text-white">
                Green Coast
              </span>
            </div>
            <span className="font-sans text-[8px] lg:text-[9px] tracking-widest text-neutral-500 uppercase mt-0.5">
              a private coastal reserve
            </span>
          </div>

          {/* Center: Pill nav (desktop only) */}
          <div className="hidden md:flex items-center p-1 rounded-full bg-neutral-900/80 border border-neutral-800 transition-all">
            <button
              onClick={() => onNavigate('hero-3')}
              className="px-5 py-1.5 text-[11px] font-sans tracking-widest uppercase font-medium text-neutral-200 hover:text-white transition-colors rounded-full bg-neutral-800 shadow-xs cursor-pointer mr-1"
            >
              ROOMS
            </button>

            {user ? (
              <div className="flex items-center gap-3 px-3 py-1 rounded-full">
                <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full border border-neutral-700" referrerPolicy="no-referrer" />
                <span className="text-[11px] font-sans tracking-wide text-white truncate max-w-[100px]">{user.name}</span>
                {user.isAdmin ? (
                  <button onClick={onOpenAdmin} className="text-[9px] font-mono text-green-400 uppercase tracking-widest hover:text-green-300 cursor-pointer transition-colors border-l border-neutral-700 pl-3">
                    Admin Panel
                  </button>
                ) : (
                  <button onClick={onOpenCustomer} className="text-[9px] font-mono text-blue-400 uppercase tracking-widest hover:text-blue-300 cursor-pointer transition-colors border-l border-neutral-700 pl-3">
                    My Bookings
                  </button>
                )}
                <button onClick={logout} className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest hover:text-red-400 cursor-pointer transition-colors border-l border-neutral-700 pl-3">
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="px-5 py-1.5 text-[11px] font-sans tracking-widest uppercase font-medium text-neutral-500 hover:text-neutral-300 transition-colors rounded-full cursor-pointer"
              >
                LOGIN
              </button>
            )}
          </div>

          {/* Right: CTA + Menu Toggle */}
          <div className="flex items-center gap-4 lg:gap-6">
            <MagneticButton strength={40}>
              <button
                onClick={onBookNow}
                className="hidden sm:block px-4 py-2 text-[10px] lg:text-[11px] font-mono tracking-widest uppercase transition-all bg-white text-neutral-950 hover:bg-neutral-200 cursor-pointer border-0"
              >
                BOOK NOW
              </button>
            </MagneticButton>

            <MagneticButton strength={20}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="group flex items-center gap-3 px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              >
                <span className="font-sans text-[11px] font-medium tracking-widest uppercase text-neutral-300">
                  {isMenuOpen ? 'CLOSE' : 'MENU'}
                </span>
                <div className="flex flex-col gap-1 w-5">
                  <div className={`h-0.5 w-full bg-neutral-200 transition-all ${isMenuOpen ? 'rotate-45 translate-y-[3px]' : 'group-hover:translate-y-[1px]'}`}></div>
                  <div className={`h-0.5 bg-neutral-200 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-[3px] w-full' : 'w-4 ml-auto group-hover:w-full'}`}></div>
                </div>
              </button>
            </MagneticButton>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Down Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[57px] sm:top-[65px] z-40 bg-neutral-950/97 backdrop-blur-xl border-t border-neutral-900 flex flex-col justify-start p-8 animate-in fade-in slide-in-from-top-5 duration-300 md:hidden">
          <nav className="flex flex-col gap-6 text-left">
            <button
              onClick={() => { onNavigate('hero-3'); setIsMenuOpen(false); }}
              className="text-left font-serif text-3xl text-neutral-300 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              Rooms
            </button>

            <button
              onClick={() => { onBookNow(); setIsMenuOpen(false); }}
              className="w-full py-4 bg-white text-neutral-950 font-mono text-xs tracking-widest uppercase hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              BOOK NOW
            </button>

            {user ? (
              <div className="flex flex-col gap-6 border-t border-neutral-900 pt-6 mt-4">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-neutral-800" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-sm font-sans text-white font-medium">{user.name}</span>
                    <span className="text-[10px] font-mono text-neutral-500">{user.email}</span>
                  </div>
                </div>

                {user.isAdmin ? (
                  <button
                    onClick={() => { onOpenAdmin(); setIsMenuOpen(false); }}
                    className="text-left font-mono text-xs text-green-400 uppercase tracking-widest hover:text-green-300 cursor-pointer"
                  >
                    Admin Panel
                  </button>
                ) : (
                  <button
                    onClick={() => { onOpenCustomer(); setIsMenuOpen(false); }}
                    className="text-left font-mono text-xs text-blue-400 uppercase tracking-widest hover:text-blue-300 cursor-pointer"
                  >
                    My Bookings
                  </button>
                )}

                <button
                  onClick={async () => { await logout(); setIsMenuOpen(false); }}
                  className="text-left font-mono text-xs text-neutral-500 uppercase tracking-widest hover:text-red-400 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onOpenAdmin(); setIsMenuOpen(false); }}
                className="text-left font-serif text-3xl text-neutral-300 hover:text-white uppercase tracking-wider transition-colors cursor-pointer border-t border-neutral-900 pt-6 mt-4"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
