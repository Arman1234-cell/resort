import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Amenities from './pages/Amenities';
import Contact from './pages/Contact';

import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Chatbot from './components/Chatbot';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

gsap.registerPlugin(ScrollTrigger);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero-1');
  const [preselectedRoomIndex, setPreselectedRoomIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const onNavigate = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setCurrentSection(id);
  };

  // Global Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--color-brand-dark)] text-[var(--color-brand-light)] font-sans selection:bg-[var(--color-brand-accent)] selection:text-[var(--color-brand-dark)] flex flex-col">
      {/* Grain noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[60] h-full w-full opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      <Header
        onNavigate={onNavigate}
        currentSection={currentSection}
        onBookNow={() => setIsBookingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCustomer={() => setIsCustomerOpen(true)}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home onBookNow={(idx) => { setPreselectedRoomIndex(idx); setIsBookingOpen(true); }} />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedRoomIndex={preselectedRoomIndex}
      />

      {/* Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}

      {/* Customer Dashboard */}
      {isCustomerOpen && (
        <CustomerDashboard onClose={() => setIsCustomerOpen(false)} />
      )}

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
