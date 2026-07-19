import React, { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle, Copy, Mail, MessageSquare, QrCode, ShieldCheck, Smartphone, X } from 'lucide-react';

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
    reason?: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  handler: (response: RazorpaySuccessResponse) => void;
}

interface RazorpayCheckout {
  open: () => void;
  on: (event: 'payment.failed', handler: (response: RazorpayFailureResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedRoomIndex: number;
}

export const ROOMS = [
  { name: 'The Ocean Pavilion', price: 20 },
  { name: 'The Horizon Loft', price: 40 },
  { name: 'The Cliffside Pool Suite', price: 60 },
  { name: 'The Sanctuary Villa', price: 80 }
];

interface NotificationAlert {
  id: string;
  type: 'whatsapp' | 'email';
  title: string;
  message: string;
}

interface NotificationResult {
  whatsapp?: 'sent' | 'skipped' | 'failed';
  resortWhatsapp?: 'sent' | 'skipped' | 'failed';
  email?: 'sent' | 'skipped' | 'failed';
  message?: string;
}

const RESORT_NAME = 'Green Coast Resort';
const RESORT_UPI_ID = '9387528621@ptsbi';
const RESORT_WHATSAPP = '919387528621';
const RESORT_EMAIL = 'bookings@greencoastresort.in';

const formatInr = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);

const normalizeIndianPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith('91') && digits.length === 12) return digits;
  return digits;
};

export default function BookingModal({ isOpen, onClose, preselectedRoomIndex }: BookingModalProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'processing' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);
  const [paymentTxId, setPaymentTxId] = useState('');
  const [paymentGateway, setPaymentGateway] = useState('Razorpay Standard Checkout');
  const [paymentError, setPaymentError] = useState('');
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'sending' | 'sent' | 'skipped' | 'failed'>('idle');
  const [notificationMessage, setNotificationMessage] = useState('');

  const getFutureDate = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState(getFutureDate(1));
  const [checkOut, setCheckOut] = useState(getFutureDate(3));
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedRoomIndex(Math.max(0, Math.min(preselectedRoomIndex, ROOMS.length - 1)));
      setStep('form');
      setName('');
      setEmail('');
      setWhatsapp('');
      setBookingId('');
      setPaymentTxId('');
      setPaymentGateway('Razorpay Standard Checkout');
      setPaymentError('');
      setNotificationStatus('idle');
      setNotificationMessage('');
      setNotifications([]);
    }
  }, [isOpen, preselectedRoomIndex]);

  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  const roomPrice = ROOMS[selectedRoomIndex].price;
  const subtotal = roomPrice * nights;
  const gst = Math.round(subtotal * 0.12);
  const total = subtotal + gst;

  const bookingMessage = useMemo(() => {
    const id = bookingId || 'Pending';
    return buildBookingMessage(id, paymentTxId || 'Not available');
  }, [bookingId, name, selectedRoomIndex, checkIn, checkOut, nights, total, paymentTxId]);


  const customerWhatsappUrl = `https://wa.me/${normalizeIndianPhone(whatsapp)}?text=${encodeURIComponent(bookingMessage)}`;
  const resortWhatsappUrl = `https://wa.me/${RESORT_WHATSAPP}?text=${encodeURIComponent(`New paid booking received:\n${bookingMessage}`)}`;
  const mailUrl = `mailto:${email}?subject=${encodeURIComponent(`${RESORT_NAME} booking confirmed - ${bookingId}`)}&body=${encodeURIComponent(bookingMessage)}`;

  if (!isOpen) return null;

  function buildBookingMessage(id: string, txId: string) {
    return `Hello ${name}, your booking ${id} at ${RESORT_NAME} is confirmed.\nRoom: ${ROOMS[selectedRoomIndex].name}\nDates: ${checkIn} to ${checkOut} (${nights} ${nights === 1 ? 'night' : 'nights'})\nAmount paid: ${formatInr(total)}\nPayment reference: ${txId}\nThank you for booking with us.`;
  }

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !whatsapp) {
      alert('Please fill in all guest details.');
      return;
    }

    const normalizedPhone = normalizeIndianPhone(whatsapp);
    if (normalizedPhone.length < 10) {
      alert('Please enter a valid WhatsApp number.');
      return;
    }

    setStep('payment');
  };

  const saveConfirmedBooking = (
    id: string,
    transactionId: string,
    gateway: string,
    payerInfo = email
  ) => {
    setBookingId(id);
    setPaymentTxId(transactionId);
    setPaymentGateway(gateway);
    setStep('success');

    const existingBookingsStr = localStorage.getItem('greencoast_bookings') || '[]';
    const existingBookings = JSON.parse(existingBookingsStr);
    const newBooking = {
      id,
      name,
      email,
      whatsapp,
      roomName: ROOMS[selectedRoomIndex].name,
      checkIn,
      checkOut,
      nights,
      amount: total,
      currency: 'INR',
      status: 'Paid',
      gateway,
      transactionId,
      payerInfo,
      timestamp: new Date().toISOString()
    };

    existingBookings.unshift(newBooking);
    localStorage.setItem('greencoast_bookings', JSON.stringify(existingBookings));
    void sendAutomaticBookingNotification(id, transactionId);
  };

  const triggerBookingNotifications = (id: string, result?: NotificationResult) => {
    const autoSent = result?.whatsapp === 'sent' || result?.resortWhatsapp === 'sent' || result?.email === 'sent';
    const newNotifications: NotificationAlert[] = [
      {
        id: `nt-wa-${Date.now()}`,
        type: 'whatsapp',
        title: autoSent ? 'WhatsApp notification handled' : 'WhatsApp fallback ready',
        message:
          result?.whatsapp === 'sent'
            ? `Booking confirmation was sent automatically to ${whatsapp}.`
            : `Booking confirmation is ready for ${whatsapp}. Use the success page button if auto-send is not configured.`
      },
      {
        id: `nt-ml-${Date.now() + 1}`,
        type: 'email',
        title: result?.email === 'sent' ? 'Email receipt sent' : 'Email fallback ready',
        message:
          result?.email === 'sent'
            ? `Receipt email was sent automatically to ${email}.`
            : `Receipt email is ready for ${email} with booking reference ${id}.`
      }
    ];

    setNotifications(newNotifications);
    newNotifications.forEach((n, idx) => {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((item) => item.id !== n.id));
      }, 7000 + idx * 1000);
    });
  };

  const sendAutomaticBookingNotification = async (id: string, txId: string) => {
    setNotificationStatus('sending');
    setNotificationMessage('Sending WhatsApp and email notifications...');

    const message = buildBookingMessage(id, txId);

    try {
      const response = await fetch('/api/booking-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking: {
            id,
            guestName: name,
            email,
            whatsapp: normalizeIndianPhone(whatsapp),
            roomName: ROOMS[selectedRoomIndex].name,
            checkIn,
            checkOut,
            nights,
            amount: total,
            amountText: formatInr(total),
            transactionId: txId,
            resortName: RESORT_NAME
          },
          message
        })
      });

      if (!response.ok) {
        throw new Error(`Notification API failed with ${response.status}`);
      }

      const result = (await response.json()) as NotificationResult;
      const anySent = result.whatsapp === 'sent' || result.resortWhatsapp === 'sent' || result.email === 'sent';
      const allSkipped = result.whatsapp === 'skipped' && result.resortWhatsapp === 'skipped' && result.email === 'skipped';

      if (anySent) {
        setNotificationStatus('sent');
        setNotificationMessage(result.message || 'Automatic booking notifications were sent.');
      } else if (allSkipped) {
        setNotificationStatus('skipped');
        setNotificationMessage(result.message || 'Automatic notifications are not configured yet.');
      } else {
        setNotificationStatus('failed');
        setNotificationMessage(result.message || 'Automatic notification sending failed.');
      }

      triggerBookingNotifications(id, result);
    } catch (error) {
      console.error(error);
      setNotificationStatus('failed');
      setNotificationMessage('Automatic sending is unavailable. Use the WhatsApp and email buttons below.');
      triggerBookingNotifications(id);
    }
  };

  const handleRazorpayCheckout = async () => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!key) {
      setPaymentError('Razorpay public key is not configured. Add VITE_RAZORPAY_KEY_ID to .env.');
      return;
    }

    if (!window.Razorpay) {
      setPaymentError('Razorpay Checkout could not be loaded. Please refresh and try again.');
      return;
    }

    const generatedId = `GC-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    setPaymentError('');
    setBookingId(generatedId);
    setStep('processing');

    try {
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.max(100, Math.round(total * 100)),
          currency: 'INR',
          receipt: generatedId
        })
      });

      const order = await orderResponse.json().catch(() => null);

      if (!orderResponse.ok) {
        throw new Error(order?.message || 'Unable to create a Razorpay order.');
      }

      const checkout = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: RESORT_NAME,
        description: `${ROOMS[selectedRoomIndex].name} booking`,
        order_id: order.order_id,
        prefill: {
          name,
          email,
          contact: normalizeIndianPhone(whatsapp)
        },
        notes: {
          booking_id: generatedId,
          room: ROOMS[selectedRoomIndex].name,
          check_in: checkIn,
          check_out: checkOut
        },
        theme: {
          color: '#050505'
        },
        modal: {
          ondismiss: () => {
            setStep('payment');
            setPaymentError('Payment was cancelled before completion.');
          }
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            const verification = await verifyResponse.json().catch(() => null);

            if (!verifyResponse.ok || !verification?.success) {
              throw new Error(verification?.message || 'Payment verification failed.');
            }

            saveConfirmedBooking(
              generatedId,
              response.razorpay_payment_id,
              'Razorpay Standard Checkout',
              response.razorpay_order_id
            );
          } catch (error) {
            console.error(error);
            setStep('payment');
            setPaymentError(error instanceof Error ? error.message : 'Payment verification failed.');
          }
        }
      });

      checkout.on('payment.failed', (response) => {
        setStep('payment');
        setPaymentError(
          response.error?.description ||
            response.error?.reason ||
            'Razorpay payment failed. Please try again.'
        );
      });

      checkout.open();
    } catch (error) {
      console.error(error);
      setStep('payment');
      setPaymentError(error instanceof Error ? error.message : 'Unable to start Razorpay Checkout.');
    }
  };



  return (
    <>
      <div className="fixed top-24 right-6 z-55 flex flex-col gap-4 max-w-sm w-full pointer-events-none select-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 rounded-xs border shadow-2xl backdrop-blur-lg flex gap-3 text-white pointer-events-auto bg-neutral-900/95 border-neutral-800"
          >
            <div className="mt-0.5">
              {n.type === 'whatsapp' ? (
                <div className="p-1.5 bg-green-950/50 rounded-xs border border-green-800">
                  <MessageSquare className="w-4 h-4 text-green-400" />
                </div>
              ) : (
                <div className="p-1.5 bg-blue-950/50 rounded-xs border border-blue-800">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
              )}
            </div>
            <div className="flex-grow">
              <span className="font-mono text-[9px] tracking-wider text-neutral-400 uppercase block">
                {n.title}
              </span>
              <p className="font-sans text-xs text-neutral-200 mt-1 leading-relaxed whitespace-pre-line">
                {n.message}
              </p>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
              className="text-neutral-500 hover:text-neutral-300 pointer-events-auto h-fit"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs select-none">
        <div className="w-full max-w-xl bg-neutral-950 border border-neutral-900 shadow-2xl relative overflow-hidden flex flex-col text-neutral-200 rounded-xs max-h-[90vh]">
          <div className="p-5 border-b border-neutral-900 flex justify-between items-center bg-[#050505]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <h3 className="font-serif text-base font-medium tracking-tight text-white uppercase">
                {step === 'form' && 'Secure Resort Booking'}
                {step === 'payment' && 'Secure Payment'}
                {step === 'processing' && 'Processing Payment'}
                {step === 'success' && 'Payment Successful'}
              </h3>
            </div>

            {step !== 'processing' && (
              <button
                onClick={onClose}
                className="p-1 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {step === 'form' && (
            <form onSubmit={handleNextToPayment} className="p-6 overflow-y-auto space-y-5 flex-grow">
              <div>
                <label className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-1.5">
                  Select Room or Suite
                </label>
                <select
                  value={selectedRoomIndex}
                  onChange={(e) => setSelectedRoomIndex(parseInt(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-850 p-2.5 rounded-xs text-xs font-sans focus:border-neutral-500 text-neutral-100 outline-hidden"
                >
                  {ROOMS.map((room, i) => (
                    <option key={i} value={i}>
                      {room.name} - {formatInr(room.price)}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-1.5">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-850 p-2.5 rounded-xs text-xs font-mono text-neutral-100 outline-hidden focus:border-neutral-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] text-neutral-500 uppercase tracking-widest mb-1.5">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-850 p-2.5 rounded-xs text-xs font-mono text-neutral-100 outline-hidden focus:border-neutral-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-3 border-t border-neutral-900">
                <span className="font-mono text-[9px] text-neutral-500 tracking-widest block uppercase">
                  Guest Information
                </span>

                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-850 px-3.5 py-2.5 rounded-xs text-xs font-sans text-neutral-100 outline-hidden focus:border-neutral-500"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-850 px-3.5 py-2.5 rounded-xs text-xs font-sans text-neutral-100 outline-hidden focus:border-neutral-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Indian WhatsApp Number"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-850 px-3.5 py-2.5 rounded-xs text-xs font-sans text-neutral-100 outline-hidden focus:border-neutral-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-neutral-950 border border-neutral-900/80 rounded-xs space-y-2 mt-4">
                <div className="flex justify-between text-xs text-neutral-400 gap-4">
                  <span>
                    {ROOMS[selectedRoomIndex].name} ({nights} {nights === 1 ? 'night' : 'nights'})
                  </span>
                  <span>{formatInr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500 border-b border-neutral-900/60 pb-2">
                  <span>GST and resort charges (12%)</span>
                  <span>{formatInr(gst)}</span>
                </div>
                <div className="flex justify-between text-sm text-white font-medium pt-1">
                  <span>Estimated Total</span>
                  <span className="font-mono text-white">{formatInr(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-white text-neutral-950 font-display text-[10px] tracking-[0.2em] font-semibold uppercase hover:bg-neutral-200 transition-colors cursor-pointer rounded-xs"
              >
                Proceed To Payment
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="p-6 space-y-6 flex-grow overflow-y-auto">
              <div className="text-center bg-[#070707] py-4 border border-neutral-900">
                <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase">
                  Amount Payable
                </span>
                <div className="text-3xl font-mono text-white font-semibold mt-1">
                  {formatInr(total)}
                </div>
                <span className="text-[10px] text-neutral-400 font-sans mt-0.5 block">
                  Booking for {name} ({ROOMS[selectedRoomIndex].name})
                </span>
              </div>

              {paymentError && (
                <div className="border border-red-900/60 bg-red-950/20 p-3 rounded-xs">
                  <p className="font-sans text-xs text-red-200 leading-relaxed">{paymentError}</p>
                </div>
              )}

              <div className="border border-neutral-900 bg-[#030303] p-4 rounded-xs space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-neutral-900 border border-neutral-850 rounded-xs">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans text-xs text-neutral-200 font-semibold">
                      Razorpay Standard Checkout
                    </h4>
                    <p className="font-sans text-[11px] text-neutral-500 leading-relaxed">
                      Pay securely by card, UPI, netbanking, or wallet. Your booking is confirmed only after server verification.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRazorpayCheckout}
                  className="w-full py-3.5 bg-white text-neutral-950 font-display text-[10px] tracking-[0.2em] uppercase hover:bg-neutral-200 transition-all font-semibold cursor-pointer rounded-xs border-0"
                >
                  Pay Securely With Razorpay
                </button>
              </div>

              <div className="pt-3 border-t border-neutral-900 mt-6">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-full py-3 border border-neutral-850 text-neutral-400 font-display text-[9px] tracking-widest uppercase hover:text-white hover:border-neutral-750 transition-all cursor-pointer rounded-xs bg-transparent"
                >
                  Back To Form
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="p-12 flex flex-col items-center justify-center space-y-6 flex-grow min-h-[300px]">
              <div className="w-10 h-10 border-2 border-neutral-800 border-t-white rounded-full animate-spin" />

              <div className="text-center space-y-1">
                <h4 className="font-serif text-sm text-neutral-200 font-medium tracking-wide">
                  Verifying Payment...
                </h4>
                <p className="font-sans text-xs text-neutral-500 leading-relaxed max-w-xs">
                  Confirming your transaction and preparing booking messages.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="p-8 flex flex-col items-center justify-center text-center flex-grow space-y-6 overflow-y-auto">
              <div className="p-3 bg-green-950/30 rounded-full border border-green-800/50">
                <CheckCircle className="w-12 h-12 text-green-400" strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <h4 className="font-serif text-2xl text-white font-medium">
                  Payment Successful
                </h4>
                <p className="font-sans text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                  Your booking is confirmed. WhatsApp and email notifications are handled automatically when the server keys are configured.
                </p>
              </div>

              <div className="w-full max-w-sm border border-neutral-900 bg-neutral-950 p-3 rounded-xs text-left">
                <span className="font-mono text-[8px] text-neutral-500 tracking-widest uppercase block mb-1">
                  Notification Status
                </span>
                <p
                  className={`font-sans text-xs leading-relaxed ${
                    notificationStatus === 'sent'
                      ? 'text-green-400'
                      : notificationStatus === 'sending'
                        ? 'text-neutral-300'
                        : notificationStatus === 'failed'
                          ? 'text-amber-300'
                          : 'text-neutral-400'
                  }`}
                >
                  {notificationMessage || 'Preparing booking notifications...'}
                </p>
              </div>

              <div className="w-full bg-neutral-950 border border-neutral-900 p-4 rounded-xs text-left text-xs font-sans space-y-2 max-w-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Booking Reference</span>
                  <span className="font-mono text-neutral-200 font-semibold">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Gateway</span>
                  <span className="text-neutral-200 font-medium text-right">{paymentGateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Payment ID</span>
                  <span className="font-mono text-neutral-200 font-semibold truncate max-w-[180px]" title={paymentTxId}>
                    {paymentTxId}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500">Room Confirmed</span>
                  <span className="text-neutral-200 text-right">{ROOMS[selectedRoomIndex].name}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-neutral-500">Duration</span>
                  <span className="text-neutral-200 text-right">
                    {checkIn} to {checkOut} ({nights} {nights === 1 ? 'night' : 'nights'})
                  </span>
                </div>
                <div className="flex justify-between border-t border-neutral-900/60 pt-2 font-medium">
                  <span className="text-neutral-400">Total Paid</span>
                  <span className="font-mono text-white">{formatInr(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-sm">
                <a
                  href={customerWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 bg-green-500 text-neutral-950 font-display text-[9px] tracking-widest uppercase hover:bg-green-400 transition-colors cursor-pointer rounded-xs border-0 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  WhatsApp Guest
                </a>
                <a
                  href={mailUrl}
                  className="py-3 bg-white text-neutral-950 font-display text-[9px] tracking-widest uppercase hover:bg-neutral-200 transition-colors cursor-pointer rounded-xs border-0 flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email Guest
                </a>
                <a
                  href={resortWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="sm:col-span-2 py-3 border border-neutral-850 text-neutral-300 font-display text-[9px] tracking-widest uppercase hover:text-white hover:border-neutral-700 transition-colors cursor-pointer rounded-xs flex items-center justify-center gap-2"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  Send Booking To Resort WhatsApp
                </a>
              </div>

              <button
                onClick={onClose}
                className="w-full max-w-sm py-3 bg-neutral-900 text-neutral-200 font-display text-[10px] tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer rounded-xs border border-neutral-800"
              >
                Return To Resort Website
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
