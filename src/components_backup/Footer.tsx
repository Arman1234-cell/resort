import React from 'react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps) {
  const containerBorder = 'border border-neutral-850 bg-neutral-900/10';

  return (
    <footer id="footer" className="bg-[#030303] border-t border-neutral-900 text-neutral-300 py-16 px-6 lg:px-12 select-none relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Top Segment: Brand & Newsletter (Split into 2 main zones) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-neutral-900">
          
          {/* Brand Col (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-white">
                Green Coast
              </span>
              <p className="font-sans text-neutral-400 text-xs mt-3 leading-relaxed max-w-sm">
                A private coastal reserve on the Albanian Riviera. Timeless architecture merges harmoniously with wild, untouched nature.
              </p>
            </div>

            <div className="mt-8">
              <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block mb-1">
                PROJECT DEVELOPMENT
              </span>
              <span className="font-sans text-xs text-neutral-300">
                BALFIN Group & Green Coast Engineering
              </span>
            </div>
          </div>

          {/* Newsletter Col (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="max-w-md lg:ml-auto w-full">
              <span className="font-mono text-[10px] tracking-widest text-neutral-500 uppercase block mb-3">
                EXCLUSIVE UPDATES
              </span>
              <h3 className="font-serif text-lg font-light text-white mb-4">
                Stay informed about release phases.
              </h3>

              {/* Wireframe Symmetrical Form */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <div className="relative flex-grow">
                  <input 
                    type="text" 
                    readOnly
                    placeholder="Your email address" 
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 px-4 py-3 text-xs tracking-wider rounded-xs focus:outline-hidden"
                  />
                </div>
                <button className="bg-white hover:bg-neutral-200 text-neutral-900 px-6 py-3 text-xs tracking-widest uppercase font-display font-medium transition-colors cursor-pointer">
                  SUBSCRIBE
                </button>
              </div>

              <span className="text-[10px] text-neutral-500 block mt-2 font-sans">
                By submitting, you agree to our privacy policy.
              </span>
            </div>
          </div>

        </div>

        {/* Middle Segment: Link Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-neutral-900 text-neutral-400">
          
          {/* Column 1: Navigation Links */}
          <div>
            <span className="font-mono text-[10px] tracking-widest text-white uppercase block mb-4">
              NAVIGATION
            </span>
            <ul className="space-y-2 text-xs">
              {['The Vision', 'Architecture & Design', 'The Reserve', 'Location & Surroundings', 'Availabilities'].map((link, i) => (
                <li key={i} className="hover:text-white transition-colors cursor-pointer">
                  {link}
                </li>
              ))}
              <li 
                onClick={onOpenAdmin}
                className="hover:text-white transition-colors cursor-pointer border-t border-neutral-900 pt-2 mt-2 text-neutral-500 font-semibold"
              >
                Owner Portal Dashboard
              </li>
            </ul>
          </div>

          {/* Column 2: Legal links */}
          <div>
            <span className="font-mono text-[10px] tracking-widest text-white uppercase block mb-4">
              LEGAL
            </span>
            <ul className="space-y-2 text-xs">
              {['Imprint', 'Privacy Policy', 'Terms of Use', 'Cookie Guidelines', 'Purchase Process'].map((link, i) => (
                <li key={i} className="hover:text-white transition-colors cursor-pointer">
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Information */}
          <div>
            <span className="font-mono text-[10px] tracking-widest text-white uppercase block mb-4">
              CONTACT
            </span>
            <ul className="space-y-3 text-xs font-sans">
              <li>
                <span className="block font-mono text-[9px] text-neutral-500">ADDRESS_PLACEHOLDER</span>
                <span className="text-neutral-300">Rruga Riviera, Palasë, Albania</span>
              </li>
              <li>
                <span className="block font-mono text-[9px] text-neutral-500">EMAIL_PLACEHOLDER</span>
                <span className="text-neutral-300">inquire@greencoast-reserve.com</span>
              </li>
              <li>
                <span className="block font-mono text-[9px] text-neutral-500">PHONE_PLACEHOLDER</span>
                <span className="text-neutral-300">+355 (0) 4 222 5555</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social media & Coordinates */}
          <div>
            <span className="font-mono text-[10px] tracking-widest text-white uppercase block mb-4">
              CONNECTIONS
            </span>
            <ul className="space-y-2 text-xs">
              {['Instagram', 'Vimeo', 'LinkedIn', 'Pinterest'].map((link, i) => (
                <li key={i} className="hover:text-white transition-colors cursor-pointer">
                  {link}
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-4 border-t border-neutral-900">
              <span className="font-mono text-[9px] text-neutral-500 block">GEOLOCATION COORD</span>
              <span className="font-mono text-[10px] text-neutral-300">40.1692° N, 19.6139° E</span>
            </div>
          </div>

        </div>

        {/* Bottom Segment: Copyright & Tech Details */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] text-neutral-500">
              © 2026 GREEN COAST COASTAL RESERVED PROJECT SKELETON. ALL RIGHTS RESERVED.
            </span>
            <span className="font-sans text-[9px] text-neutral-500">
              This website is a layout skeleton/wireframe for aligning hierarchy, spacing, and proportions.
            </span>
          </div>

          {/* Dynamic Wireframe Indicator */}
          <div className={`p-3 rounded-xs font-mono text-[9px] text-neutral-400 max-w-xs ${containerBorder} flex items-center justify-between gap-6`}>
            <span>STYLE: MINIMAL</span>
            <span>LABELS: ENGLISH</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
