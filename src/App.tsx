import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroOne from './components/HeroOne';
import HeroTwo from './components/HeroTwo';
import HeroThreeScroll from './components/HeroThreeScroll';
import HeroFourBento from './components/HeroFourBento';
import HeroFiveFinal from './components/HeroFiveFinal';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Chatbot from './components/Chatbot';
import CustomCursor from './components/CustomCursor';
import NoiseOverlay from './components/NoiseOverlay';
import AbstractSculpture from './components/AbstractSculpture';
import { SectionLink } from './types';
import { useAuth } from './context/AuthContext';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [currentSection, setCurrentSection] = useState<string>('hero-1');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.isAdmin) {
      setIsAdminOpen(true);
    }
  }, [user]);

  // Global Lenis Setup
  useEffect(() => {
    const lenis = new Lenis();

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

  // Define section navigation lists
  const sections: SectionLink[] = [
    { id: 'hero-1', name: '01 / First Hero (Inspiration)' },
    { id: 'hero-3', name: '02 / Rooms Gallery (Horizontal)' },
    { id: 'hero-2', name: '03 / Resort Perspective (Split)' },
    { id: 'hero-4', name: '04 / Fourth Hero (Bento Editorial)' },
    { id: 'hero-5', name: '05 / Fifth Hero (Arched Portal)' },
    { id: 'footer', name: '06 / Footer Structure' },
  ];

  // Seed default bookings in local storage if empty
  useEffect(() => {
    const key = 'greencoast_bookings';
    if (!localStorage.getItem(key)) {
      const mockBookings = [
        {
          id: 'GC-892401',
          name: 'Aarav Menon',
          email: 'aarav.menon@example.in',
          whatsapp: '+91 98765 43210',
          roomName: 'The Sanctuary Villa',
          checkIn: '2026-08-12',
          checkOut: '2026-08-18',
          nights: 6,
          amount: 538,
          status: 'Paid',
          gateway: 'Custom UPI',
          transactionId: 'UTR89240116',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'GC-102948',
          name: 'Priya Nair',
          email: 'priya.nair@example.in',
          whatsapp: '+91 91234 56780',
          roomName: 'The Ocean Pavilion',
          checkIn: '2026-07-28',
          checkOut: '2026-07-31',
          nights: 3,
          amount: 67,
          status: 'Paid',
          gateway: 'Custom UPI',
          transactionId: 'UTR10294831',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: 'GC-492019',
          name: 'Rohan Sharma',
          email: 'rohan.sharma@example.in',
          whatsapp: '+91 99887 76655',
          roomName: 'The Cliffside Pool Suite',
          checkIn: '2026-09-02',
          checkOut: '2026-09-07',
          nights: 5,
          amount: 336,
          status: 'Paid',
          gateway: 'Custom UPI',
          transactionId: 'UTR49201957',
          timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];
      localStorage.setItem(key, JSON.stringify(mockBookings));
    }
  }, []);

  // Monitor active section based on scroll offsets
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for trigger

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll navigate to section ID
  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = id === 'hero-1' ? 0 : -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setCurrentSection(id);
    }
  };

  const handleBookRoom = (roomIdx: number) => {
    setSelectedRoomIdx(roomIdx);
    setIsBookingOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-white selection:text-black transition-colors duration-300">
      
      {/* Aesthetic Overlays & 3D Background */}
      <AbstractSculpture />
      <CustomCursor />
      <NoiseOverlay />

      {/* Premium Navigation Header */}
      <Header 
        onNavigate={handleNavigate}
        currentSection={currentSection}
        onBookNow={() => handleBookRoom(0)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCustomer={() => setIsCustomerDashboardOpen(true)}
      />

      {/* Main Section Stacks */}
      <main className="relative">
        
        {/* Section 1: Hero One (Inspired by Reference Layout) */}
        <HeroOne />

        {/* Section 2: Hero Three (Horizontal Scrollytelling Vertically Controlled) */}
        <HeroThreeScroll onBookRoom={handleBookRoom} />

        {/* Section 3: Hero Two (Premium Asymmetrical Split) */}
        <HeroTwo />

        {/* Section 4: Hero Four (Editorial Bento Grid) */}
        <HeroFourBento />

        {/* Section 5: Fifth Hero (Arched Portal) */}
        <HeroFiveFinal onBookRoom={() => handleBookRoom(0)} />

      </main>

      {/* Footer Structure */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Pop-up Booking Modal */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        preselectedRoomIndex={selectedRoomIdx}
      />

      {/* Owner Dashboard Overlay */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}

      {/* Customer Dashboard Overlay */}
      {isCustomerDashboardOpen && (
        <CustomerDashboard onClose={() => setIsCustomerDashboardOpen(false)} />
      )}

      {/* Resort Chatbot */}
      <Chatbot />

    </div>
  );
}
