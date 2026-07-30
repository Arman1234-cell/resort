import React from 'react';

export default function Contact() {
  return (
    <div className="pt-32 pb-24 min-h-screen container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif mb-8 text-center">Get in Touch</h1>
      <p className="text-center text-[var(--color-brand-muted)] mb-16">
        We are here to assist you with any inquiries or reservation requests.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-serif mb-6">Contact Information</h2>
          <div className="space-y-4 text-[var(--color-brand-muted)]">
            <p><strong className="text-white font-sans uppercase text-sm tracking-wider block mb-1">Address</strong> 123 Paradise Cove, Halc Island, HC 12345</p>
            <p><strong className="text-white font-sans uppercase text-sm tracking-wider block mb-1">Phone</strong> +1 (800) 123-4567</p>
            <p><strong className="text-white font-sans uppercase text-sm tracking-wider block mb-1">Email</strong> contact@halcresort.com</p>
          </div>
        </div>
        
        <div>
          <form className="space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 text-[var(--color-brand-muted)]">Name</label>
              <input type="text" className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-[var(--color-brand-accent)] transition-colors" />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 text-[var(--color-brand-muted)]">Email</label>
              <input type="email" className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-[var(--color-brand-accent)] transition-colors" />
            </div>
            <div>
              <label className="block text-sm uppercase tracking-wider mb-2 text-[var(--color-brand-muted)]">Message</label>
              <textarea rows={4} className="w-full bg-transparent border-b border-white/20 pb-2 focus:outline-none focus:border-[var(--color-brand-accent)] transition-colors resize-none"></textarea>
            </div>
            <button className="w-full py-3 bg-white text-black font-semibold uppercase tracking-wider text-sm hover:bg-[var(--color-brand-accent)] transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
