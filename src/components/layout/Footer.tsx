import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 py-12 px-5 sm:px-8 font-sans mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-xs">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-serif tracking-widest text-white uppercase font-bold text-sm">
            Green Coast Resort
          </span>
          <span className="text-[8px] tracking-[0.2em] mt-0.5">
            © {new Date().getFullYear()} GREEN COAST. ALL RIGHTS RESERVED.
          </span>
        </div>
        <div className="flex gap-6 sm:gap-8 flex-wrap justify-center">
          <Link to="/rooms" className="hover:text-white transition-colors duration-300">Accommodations</Link>
          <Link to="/amenities" className="hover:text-white transition-colors duration-300">Amenities</Link>
          <Link to="/contact" className="hover:text-white transition-colors duration-300">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
