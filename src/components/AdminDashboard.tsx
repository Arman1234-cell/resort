import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  IndianRupee,
  Lock,
  LogOut,
  Mail,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X
} from 'lucide-react';
import { ROOMS } from './BookingModal';
import GoogleLoginButton from './GoogleLoginButton';
import { useAuth } from '../context/AuthContext';

interface BookingRecord {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  amount: number;
  status: string;
  gateway?: string;
  transactionId?: string;
  timestamp: string;
}

interface AdminDashboardProps {
  onClose: () => void;
}

const OWNER_EMAIL = 'sayedarmanullah@gmail.com';

const formatInr = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));

const isSameDate = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export default function AdminDashboard({ onClose }: AdminDashboardProps) {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Close the modal automatically if a normal user logs in from here.
  useEffect(() => {
    if (user && !user.isAdmin) {
      onClose();
    }
  }, [user, onClose]);

  const isLoggedIn = user?.isAdmin;

  useEffect(() => {
    const data = localStorage.getItem('greencoast_bookings') || '[]';
    setBookings(JSON.parse(data));
  }, [isLoggedIn]);

  const handleCancelBooking = (id: string) => {
    if (window.confirm(`Are you sure you want to cancel booking ${id}?`)) {
      const updated = bookings.filter((b) => b.id !== id);
      setBookings(updated);
      localStorage.setItem('greencoast_bookings', JSON.stringify(updated));
    }
  };

  const today = new Date();

  const metrics = useMemo(() => {
    const totalRevenue = bookings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const todaysBookings = bookings.filter((b) => isSameDate(new Date(b.timestamp), today));
    const todaysRevenue = todaysBookings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const upcomingCheckIns = bookings.filter((b) => {
      const checkIn = new Date(b.checkIn);
      return checkIn >= new Date(today.toDateString());
    });
    const inHouseGuests = bookings.filter((b) => {
      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      return checkIn <= today && checkOut >= today;
    });

    const roomCounts = bookings.reduce((acc: Record<string, number>, curr) => {
      acc[curr.roomName] = (acc[curr.roomName] || 0) + 1;
      return acc;
    }, {});

    const mostPopularRoom =
      (Object.entries(roomCounts) as [string, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      'No bookings yet';

    const occupancyRate = Math.min(
      100,
      Math.round((inHouseGuests.length / Math.max(ROOMS.length, 1)) * 100)
    );

    return {
      totalRevenue,
      todaysBookings: todaysBookings.length,
      todaysRevenue,
      totalBookings: bookings.length,
      upcomingCheckIns: upcomingCheckIns.length,
      inHouseGuests: inHouseGuests.length,
      mostPopularRoom,
      occupancyRate
    };
  }, [bookings]);

  const chartData = ROOMS.map((room) => {
    const roomBookings = bookings.filter((b) => b.roomName === room.name);
    const revenue = roomBookings.reduce((sum, b) => sum + Number(b.amount || 0), 0);
    return { name: room.name, count: roomBookings.length, revenue };
  });

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4);

  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.name.toLowerCase().includes(term) ||
      b.email.toLowerCase().includes(term) ||
      b.roomName.toLowerCase().includes(term) ||
      b.id.toLowerCase().includes(term)
    );
  });

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030303] text-neutral-200 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_28%)]" />
        <div className="max-w-lg w-full bg-neutral-950 border border-neutral-850 p-8 shadow-2xl relative rounded-xs overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-white" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-8">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xs flex items-center justify-center mb-5">
              <Lock className="w-5 h-5 text-neutral-300" />
            </div>
            <span className="font-mono text-[9px] text-green-400 uppercase tracking-widest">
              Guest Access
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-white mt-2">
              Login / Sign Up
            </h2>
            <p className="font-sans text-xs text-neutral-500 mt-3 leading-relaxed max-w-sm">
              Sign in to manage your bookings or book a new stay.
            </p>
          </div>

          <div className="mt-8">
            <GoogleLoginButton />
          </div>

          <div className="mt-5 p-3 border border-neutral-900 bg-neutral-900/40 text-[10px] text-neutral-500 leading-relaxed text-center">
            Guest sign up and owner login is powered by Google Authentication.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#030303] text-neutral-200 flex flex-col select-none overflow-y-auto">
      <header className="border-b border-neutral-900 bg-neutral-950/90 sticky top-0 backdrop-blur-md px-6 lg:px-12 py-4 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[9px] text-green-400 uppercase tracking-widest">
              Green Coast Owner Portal
            </span>
            <h1 className="font-serif text-2xl text-white font-medium mt-1">Booking Command Center</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:block font-mono text-[9px] text-neutral-500 border border-neutral-850 px-3 py-2">
              {user?.email}
            </span>
            <button
              onClick={async () => {
                await logout();
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all font-display text-[10px] tracking-widest uppercase cursor-pointer rounded-xs bg-transparent"
            >
              <LogOut className="w-3.5 h-3.5" />
              Lock
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-neutral-950 hover:bg-neutral-200 font-display text-[10px] tracking-widest uppercase font-semibold transition-all cursor-pointer border-0 rounded-xs"
            >
              Site
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 border border-neutral-900 bg-neutral-950 p-6 rounded-xs">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                  Today
                </span>
                <h2 className="font-serif text-4xl text-white font-medium mt-2">
                  {metrics.todaysBookings} bookings
                </h2>
                <p className="text-xs text-neutral-500 mt-2">
                  {formatInr(metrics.todaysRevenue)} collected from bookings created today.
                </p>
              </div>
              <div className="p-3 bg-green-950/30 border border-green-900/40 rounded-xs">
                <Sparkles className="w-5 h-5 text-green-300" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="border border-neutral-900 bg-neutral-900/30 p-3 rounded-xs">
                <span className="font-mono text-[8px] text-neutral-500 uppercase">In House</span>
                <strong className="block text-xl text-white mt-1">{metrics.inHouseGuests}</strong>
              </div>
              <div className="border border-neutral-900 bg-neutral-900/30 p-3 rounded-xs">
                <span className="font-mono text-[8px] text-neutral-500 uppercase">Upcoming</span>
                <strong className="block text-xl text-white mt-1">{metrics.upcomingCheckIns}</strong>
              </div>
              <div className="border border-neutral-900 bg-neutral-900/30 p-3 rounded-xs">
                <span className="font-mono text-[8px] text-neutral-500 uppercase">Occupancy</span>
                <strong className="block text-xl text-white mt-1">{metrics.occupancyRate}%</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: 'Total Revenue', value: formatInr(metrics.totalRevenue), icon: IndianRupee },
              { label: 'Total Bookings', value: metrics.totalBookings.toString(), icon: Calendar },
              { label: 'Guests Recorded', value: bookings.length.toString(), icon: Users },
              { label: 'Top Room', value: metrics.mostPopularRoom, icon: TrendingUp }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-neutral-950 border border-neutral-900 p-5 rounded-xs flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">
                      {item.label}
                    </span>
                    <div className="text-xl font-mono text-white font-semibold mt-2 truncate">
                      {item.value}
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xs">
                    <Icon className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-neutral-950 border border-neutral-900 p-6 rounded-xs">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                  Room Performance
                </span>
                <h3 className="font-serif text-base text-white font-medium mt-1">
                  Revenue and bookings by room
                </h3>
              </div>
              <span className="font-mono text-[9px] text-neutral-500">
                {new Date().toLocaleDateString('en-IN')}
              </span>
            </div>

            <div className="space-y-5">
              {chartData.map((data) => {
                const percent = Math.max(4, Math.round((data.revenue / maxRevenue) * 100));
                return (
                  <div key={data.name} className="space-y-2">
                    <div className="flex justify-between gap-4 text-xs font-sans">
                      <span className="text-neutral-300">{data.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-500 font-mono">{data.count} bookings</span>
                        <span className="text-white font-mono font-semibold">{formatInr(data.revenue)}</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-neutral-900 border border-neutral-850 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 bg-neutral-950 border border-neutral-900 p-6 rounded-xs">
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
              Latest Activity
            </span>
            <h3 className="font-serif text-base text-white font-medium mt-1 mb-5">
              Recent bookings
            </h3>

            <div className="space-y-3">
              {recentBookings.length === 0 ? (
                <p className="text-xs text-neutral-500 border border-dashed border-neutral-900 p-5 text-center">
                  No recent booking activity.
                </p>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="border border-neutral-900 bg-neutral-900/20 p-3 rounded-xs">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-white font-medium truncate">{booking.name}</span>
                      <span className="font-mono text-[9px] text-green-400">{booking.status}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">
                      {booking.roomName} - {formatInr(booking.amount)}
                    </div>
                    <div className="text-[10px] text-neutral-600 mt-1">
                      {formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="bg-neutral-950 border border-neutral-900 p-6 rounded-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
                Booking Ledger
              </span>
              <h3 className="font-serif text-base text-white font-medium mt-1">
                Guest reservations
              </h3>
            </div>

            <div className="relative max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-neutral-500" />
              </div>
              <input
                type="text"
                placeholder="Search guest, email, room, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-850 pl-9 pr-3 py-2 rounded-xs text-xs font-sans text-neutral-100 outline-hidden focus:border-neutral-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-neutral-900">
                <p className="font-sans text-xs text-neutral-500">
                  {searchTerm ? 'No search results match your criteria.' : 'No bookings recorded yet.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500 uppercase font-mono text-[9px] tracking-wider">
                    <th className="py-3 px-4 font-normal">Booking ID</th>
                    <th className="py-3 px-4 font-normal">Guest</th>
                    <th className="py-3 px-4 font-normal">Room</th>
                    <th className="py-3 px-4 font-normal">Stay</th>
                    <th className="py-3 px-4 font-normal text-right">Amount</th>
                    <th className="py-3 px-4 font-normal text-center">Payment</th>
                    <th className="py-3 px-4 font-normal text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-neutral-300 font-sans">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-900/20 transition-colors">
                      <td className="py-4 px-4 font-mono text-neutral-400 font-semibold">{b.id}</td>
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-medium text-white">{b.name}</div>
                        <div className="text-neutral-500 text-[10px]">{b.email}</div>
                        <div className="text-neutral-500 text-[10px]">WA: {b.whatsapp}</div>
                      </td>
                      <td className="py-4 px-4 space-y-0.5">
                        <div>{b.roomName}</div>
                        <div className="text-neutral-500 text-[10px]">
                          {b.nights} {b.nights === 1 ? 'night' : 'nights'}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[10px] text-neutral-400">
                        {formatDate(b.checkIn)} <span className="text-neutral-600">to</span> {formatDate(b.checkOut)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-white font-medium">
                        {formatInr(b.amount)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] bg-green-950/40 text-green-400 border border-green-900/50 font-mono font-medium">
                          <CheckCircle className="w-3 h-3" />
                          {b.gateway || b.status}
                        </span>
                        {b.transactionId && (
                          <div className="font-mono text-[9px] text-neutral-500 mt-1">{b.transactionId}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-900 transition-colors cursor-pointer rounded-xs bg-transparent border-0"
                          title="Cancel Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-900 bg-neutral-950/30 py-6 text-center text-neutral-600 font-mono text-[9px] tracking-widest mt-12">
        OWNER EMAIL VERIFIED - LOCAL BOOKING DASHBOARD - CONNECT GOOGLE AUTH BEFORE PUBLIC LAUNCH
      </footer>
    </div>
  );
}
