import React from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigate: (id: string) => void;
  currentSection: string;
  onBookNow: () => void;
  onOpenAdmin: () => void;
  onOpenCustomer: () => void;
}

export default function Header({ onNavigate, currentSection, onBookNow, onOpenAdmin, onOpenCustomer }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 px-6 lg:px-12 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Area: Logo & Tagline */}
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

        {/* Center Area: Pill Switch (Inspired by reference layout) */}
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

        {/* Right Area: CTA & Menu */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={onBookNow}
            className="px-4 py-2 text-[10px] lg:text-[11px] font-mono tracking-widest uppercase transition-all bg-white text-neutral-950 hover:bg-neutral-200 cursor-pointer border-0"
          >
            BOOK NOW
          </button>

          {/* Styled CSS-only Menu Trigger */}
          <button className="group flex items-center gap-3 px-3 py-2 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 transition-colors cursor-pointer">
            <span className="font-sans text-[11px] font-medium tracking-widest uppercase text-neutral-300">
              MENU
            </span>
            {/* 2-bar menu icon built via HTML elements */}
            <div className="flex flex-col gap-1 w-5">
              <div className="h-0.5 w-full bg-neutral-200 transition-all group-hover:translate-y-[1px]"></div>
              <div className="h-0.5 w-4 bg-neutral-200 ml-auto transition-all group-hover:w-full"></div>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
}
