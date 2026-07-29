import React, { useEffect, useState } from 'react';
import { X, Calendar, Clock, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Booking {
  id: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: string;
  timestamp: string;
}

export default function CustomerDashboard({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch('/api/bookings')
        .then(res => res.json())
        .then((data: Booking[]) => {
          const userBookings = (data as any[]).filter(b => b.email === user.email);
          setBookings(userBookings);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#030303] border border-neutral-900 rounded-sm shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-neutral-900">
          <div>
            <h2 className="text-xl font-serif text-white">My Bookings</h2>
            <p className="text-xs text-neutral-500 font-sans mt-1">
              Welcome back, {user?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-neutral-800 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
              <h3 className="text-neutral-300 font-serif text-lg">No Bookings Yet</h3>
              <p className="text-neutral-500 text-xs mt-2 font-sans">You have not made any bookings at Green Coast Resort.</p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors"
              >
                Browse Rooms
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-neutral-950 border border-neutral-900 p-4 lg:p-6 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-white font-serif text-lg mb-2">{booking.roomName}</h3>
                    <div className="flex flex-col gap-2 text-xs text-neutral-400 font-sans">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-500" />
                        <span>Check-in: {booking.checkIn} | Check-out: {booking.checkOut}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-neutral-500" />
                        <span>Amount Paid: ₹{booking.amount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-start md:items-end">
                    <span className="px-3 py-1 bg-green-950/30 text-green-400 text-[10px] tracking-wider uppercase border border-green-900/30">
                      Confirmed
                    </span>
                    <span className="text-[10px] font-mono text-neutral-600 mt-4 md:mt-0">
                      Ref: {booking.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
