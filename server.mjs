import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs/promises';
import { Redis } from '@upstash/redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3002);

const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');
const PRICES_FILE = path.join(__dirname, 'prices.json');

// Initialize Redis if env vars are present
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const redis = (redisUrl && redisToken) ? new Redis({ url: redisUrl, token: redisToken }) : null;

// Helper to manage prices
const getPrices = async () => {
  if (redis) {
    const data = await redis.get('prices');
    return data || {};
  }
  try {
    const data = await fs.readFile(PRICES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
};

const savePrices = async (prices) => {
  if (redis) {
    await redis.set('prices', prices);
    return;
  }
  await fs.writeFile(PRICES_FILE, JSON.stringify(prices, null, 2));
};

// Ensure files exist (only needed for local fallback)
async function ensureFilesExist() {
  if (redis) return;
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify([]));
  }
  try {
    await fs.access(PRICES_FILE);
  } catch {
    await fs.writeFile(PRICES_FILE, JSON.stringify({}));
  }
}
ensureFilesExist();

async function getBookings() {
  if (redis) {
    const data = await redis.get('bookings');
    return data || [];
  }
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveBookings(bookings) {
  if (redis) {
    await redis.set('bookings', bookings);
    return;
  }
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
}

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const RAZORPAY_ORDERS_URL = 'https://api.razorpay.com/v1/orders';
const MIN_RAZORPAY_AMOUNT = 100;

const normalizePhone = (value = '') => value.replace(/\D/g, '');

const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return { keyId, keySecret };
};

const sendWhatsappText = async ({ to, message }) => {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId || !to) {
    return 'skipped';
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: false,
        body: message
      }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('WhatsApp send failed:', detail);
    return 'failed';
  }

  return 'sent';
};

const sendEmail = async ({ to, guestName, subject, message, htmlContent }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.MAIL_FROM_EMAIL;
  const senderName = process.env.MAIL_FROM_NAME || 'Green Coast Resort';

  if (!apiKey || !senderEmail || !to) {
    return 'skipped';
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to, name: guestName }],
      subject,
      textContent: message,
      ...(htmlContent && { htmlContent })
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('Email send failed:', detail);
    return 'failed';
  }

  return 'sent';
};

app.post('/api/booking-notifications', async (req, res) => {
  const { booking, message } = req.body || {};

  if (!booking?.id || !booking?.guestName || !booking?.email || !booking?.whatsapp || !message) {
    return res.status(400).json({ message: 'Missing booking notification details.' });
  }

  const guestPhone = normalizePhone(booking.whatsapp);
  const resortPhone = normalizePhone(process.env.RESORT_WHATSAPP || '919387528621');
  const subject = `${booking.resortName || 'Resort'} booking confirmed - ${booking.id}`;
  
  // Custom message for guest as requested
  const customMessage = `Hi this is your check in: ${booking.checkIn} and check out time: ${booking.checkOut}, type: ${booking.roomName} and number of rooms you book: ${booking.roomsCount || 1}.`;
  const finalMessage = message || customMessage;
  
  const resortMessage = `New paid booking received:\n${finalMessage}`;

  const htmlEmail = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #111;">Booking Confirmed</h2>
      <p style="color: #444; font-size: 16px;">Hi ${booking.guestName || 'Guest'},</p>
      <p style="color: #444; font-size: 16px;">Thank you for booking with <strong>${booking.resortName || 'Green Coast Resort'}</strong>. Your payment was successful.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #f1f1f1;">
        <h3 style="margin-top: 0; color: #333;">Your Booking Details</h3>
        <p style="margin: 8px 0; color: #555;"><strong>Booking Ref:</strong> ${booking.id}</p>
        <p style="margin: 8px 0; color: #555;"><strong>Room Type:</strong> ${booking.roomName}</p>
        <p style="margin: 8px 0; color: #555;"><strong>Rooms Booked:</strong> ${booking.roomsCount || 1}</p>
        <p style="margin: 8px 0; color: #555;"><strong>Check-in:</strong> ${booking.checkIn}</p>
        <p style="margin: 8px 0; color: #555;"><strong>Check-out:</strong> ${booking.checkOut}</p>
        <p style="margin: 8px 0; color: #555;"><strong>Amount Paid:</strong> ${booking.amountText}</p>
      </div>
      <p style="color: #444; font-size: 14px; margin-top: 20px;">We look forward to hosting you!</p>
    </div>
  `;

  const [whatsapp, resortWhatsapp, email] = await Promise.all([
    sendWhatsappText({ to: guestPhone, message: finalMessage }),
    sendWhatsappText({ to: resortPhone, message: resortMessage }),
    sendEmail({ to: booking.email, guestName: booking.guestName, subject, message: finalMessage, htmlContent: htmlEmail })
  ]);

  const sentCount = [whatsapp, resortWhatsapp, email].filter((status) => status === 'sent').length;
  const skippedCount = [whatsapp, resortWhatsapp, email].filter((status) => status === 'skipped').length;
  const failedCount = [whatsapp, resortWhatsapp, email].filter((status) => status === 'failed').length;

  const statusMessage =
    sentCount > 0
      ? `Sent ${sentCount} automatic notification${sentCount === 1 ? '' : 's'}.`
      : skippedCount === 3
        ? 'Automatic notifications are not configured. Add WhatsApp and email API keys in .env.'
        : `Notification attempt finished with ${failedCount} failure${failedCount === 1 ? '' : 's'}.`;

  return res.json({
    whatsapp,
    resortWhatsapp,
    email,
    message: statusMessage
  });
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await getBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
});

app.post('/api/book', async (req, res) => {
  try {
    const booking = req.body;
    if (!booking.id || !booking.roomName || !booking.checkIn || !booking.checkOut) {
      return res.status(400).json({ message: 'Invalid booking data.' });
    }
    
    const bookings = await getBookings();
    
    // Inventory Validation: max 2 rooms per type
    const MAX_ROOMS_OF_TYPE = 2;
    const requestedRoomsCount = Number(booking.roomsCount) || 1;
    let valid = true;
    
    const dateCounts = {};
    bookings.forEach((b) => {
      if (b.roomName === booking.roomName && b.status === 'Paid') {
        const count = Number(b.roomsCount) || 1;
        let d = new Date(b.checkIn);
        const end = new Date(b.checkOut);
        while (d < end) {
          const s = d.toISOString().split('T')[0];
          dateCounts[s] = (dateCounts[s] || 0) + count;
          d.setDate(d.getDate() + 1);
        }
      }
    });

    let checkD = new Date(booking.checkIn);
    const checkEnd = new Date(booking.checkOut);
    while (checkD < checkEnd) {
      const s = checkD.toISOString().split('T')[0];
      const existingCount = dateCounts[s] || 0;
      if (existingCount + requestedRoomsCount > MAX_ROOMS_OF_TYPE) {
        valid = false;
        break;
      }
      checkD.setDate(checkD.getDate() + 1);
    }

    if (!valid) {
      return res.status(409).json({ message: 'The selected dates are no longer available for this room type.' });
    }

    bookings.unshift(booking);
    await saveBookings(bookings);

    try {
      const webhookResponse = await fetch('https://arman10101.app.n8n.cloud/webhook/booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guestName: booking.name,
          email: booking.email,
          bookingId: booking.id,
          roomType: booking.roomName,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: Number(booking.roomsCount || 1) * 2,
          amount: Number(booking.amount)
        })
      });

      if (webhookResponse.ok) {
        console.log("n8n webhook sent successfully");
      } else {
        console.log("Failed to send n8n webhook");
      }
    } catch (error) {
      console.log("Failed to send n8n webhook");
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save booking.' });
  }
});

app.get('/api/daily-report', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bookings = await getBookings();
    
    let totalRoomsBookedToday = 0;
    let totalIncomeToday = 0;
    let totalGuestsToday = 0; // Estimated 2 per room
    
    // Count bookings created today
    const todaysBookings = bookings.filter(b => b.timestamp && b.timestamp.startsWith(today));
    
    for (const b of todaysBookings) {
      const rooms = Number(b.roomsCount) || 1;
      totalRoomsBookedToday += rooms;
      totalIncomeToday += (Number(b.amount) || 0);
      totalGuestsToday += rooms * 2; 
    }
    
    // Total rooms occupied today (where today is between check-in and check-out)
    const occupiedBookings = bookings.filter(b => {
      return today >= b.checkIn && today < b.checkOut;
    });
    
    let occupiedRooms = 0;
    for (const b of occupiedBookings) {
      occupiedRooms += (Number(b.roomsCount) || 1);
    }
    
    res.json({
      date: today,
      newBookingsMadeToday: totalRoomsBookedToday,
      totalIncomeToday: totalIncomeToday,
      estimatedGuestsArrivingOrStayingToday: occupiedRooms * 2,
      occupiedRoomsToday: occupiedRooms
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report.' });
  }
});

import Razorpay from 'razorpay';

app.post('/api/create-order', async (req, res) => {
  const credentials = getRazorpayCredentials();

  if (!credentials) {
    return res.status(500).json({ message: 'Razorpay credentials are not configured.' });
  }

  const amount = Number(req.body?.amount);
  const currency = String(req.body?.currency || 'INR').toUpperCase();
  const receipt = String(req.body?.receipt || `receipt_${Date.now()}`).slice(0, 40);

  if (!Number.isInteger(amount) || amount < MIN_RAZORPAY_AMOUNT) {
    return res.status(400).json({ message: 'Amount must be at least 100 paise.' });
  }

  try {
    const instance = new Razorpay({
      key_id: credentials.keyId,
      key_secret: credentials.keySecret,
    });

    const order = await instance.orders.create({
      amount,
      currency,
      receipt
    });

    return res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay order request failed:', error);
    
    // Check for authentication failure specifically
    if (error && error.statusCode === 401) {
      return res.status(401).json({ message: 'Razorpay authentication failed.' });
    }
    
    return res.status(500).json({ message: 'Unable to create Razorpay order.' });
  }
});

app.post('/api/verify-payment', (req, res) => {
  const credentials = getRazorpayCredentials();

  if (!credentials) {
    return res.status(500).json({ message: 'Razorpay credentials are not configured.' });
  }

  const {
    razorpay_payment_id: paymentId,
    razorpay_order_id: orderId,
    razorpay_signature: signature
  } = req.body || {};

  if (!paymentId || !orderId || !signature) {
    return res.status(400).json({ message: 'Missing Razorpay payment verification fields.' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', credentials.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const signatureBuffer = Buffer.from(String(signature), 'hex');
  const generatedBuffer = Buffer.from(generatedSignature, 'hex');
  const isValid =
    signatureBuffer.length === generatedBuffer.length &&
    crypto.timingSafeEqual(signatureBuffer, generatedBuffer);

  if (!isValid) {
    return res.status(400).json({ message: 'Razorpay signature verification failed.' });
  }

  return res.json({
    success: true,
    payment_id: paymentId,
    order_id: orderId
  });
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'sayedarmanullah@gmail.com';

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: 'Google credential missing.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: [process.env.GOOGLE_CLIENT_ID, process.env.VITE_GOOGLE_CLIENT_ID]
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ message: 'Invalid Google token payload.' });
    }

    const { sub, name, email, picture } = payload;
    const isAdmin = email.toLowerCase() === OWNER_EMAIL.toLowerCase();

    const user = {
      id: sub,
      name,
      email,
      avatar: picture,
      isAdmin,
      loginTime: new Date().toISOString()
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send login notification (Awaited for Serverless)
    await sendEmail({
      to: email,
      guestName: name,
      subject: 'Security Alert: New Login to Green Coast Resort',
      message: `Hi ${name},\n\nYou have successfully logged in to Green Coast Resort on ${new Date().toLocaleString()}.\n\nIf this was not you, please secure your account.`,
      htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Login Alert</h2>
        <p>Hi ${name},</p>
        <p>You have successfully logged in to Green Coast Resort.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">If this was not you, please contact support immediately.</p>
      </div>`
    }).catch(console.error);

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Google verification failed:', error);
    return res.status(401).json({ message: 'Google authentication failed.' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid session.' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.email) {
        await sendEmail({
          to: decoded.email,
          guestName: decoded.name,
          subject: 'Security Alert: Logged Out of Green Coast Resort',
          message: `Hi ${decoded.name},\n\nYou have successfully logged out of Green Coast Resort.`,
          htmlContent: `<div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">Logout Alert</h2>
            <p>Hi ${decoded.name},</p>
            <p>You have successfully logged out of Green Coast Resort.</p>
          </div>`
        }).catch(console.error);
      }
    } catch (e) {
      // Ignore token errors on logout
    }
  }

  res.clearCookie('token');
  return res.json({ success: true });
});

// -- Dynamic Pricing API --
app.get('/api/pricing', async (req, res) => {
  try {
    const prices = await getPrices();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch prices.' });
  }
});

app.post('/api/pricing', async (req, res) => {
  try {
    const { roomName, date, price } = req.body;
    if (!roomName || !date || typeof price !== 'number') {
      return res.status(400).json({ message: 'Invalid pricing data.' });
    }
    const prices = await getPrices();
    if (!prices[roomName]) prices[roomName] = {};
    prices[roomName][date] = price;
    await savePrices(prices);
    res.json({ success: true, prices });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save prices.' });
  }
});

// -- Notifications API --
app.post('/api/booking-notifications', async (req, res) => {
  try {
    const { booking, message } = req.body;
    
    if (!booking || !message) {
      return res.status(400).json({ message: 'Missing booking or message.' });
    }

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    let whatsappStatus = 'skipped';
    let resortWhatsappStatus = 'skipped';
    
    if (token && phoneId) {
       // Send to customer
       const customerPhone = String(booking.whatsapp).replace(/\D/g, '');
       if (customerPhone) {
         try {
           const waRes = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
             method: 'POST',
             headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json'
             },
             body: JSON.stringify({
               messaging_product: 'whatsapp',
               to: customerPhone,
               type: 'text',
               text: { body: message }
             })
           });
           whatsappStatus = waRes.ok ? 'sent' : 'failed';
           if (!waRes.ok) console.error('Customer WhatsApp failed:', await waRes.text());
         } catch (e) {
           console.error(e);
           whatsappStatus = 'failed';
         }
       }
       
       // Send to resort owner
       const ownerPhone = process.env.WHATSAPP_RESORT_PHONE;
       if (ownerPhone) {
         try {
           const waRes2 = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
             method: 'POST',
             headers: {
               'Authorization': `Bearer ${token}`,
               'Content-Type': 'application/json'
             },
             body: JSON.stringify({
               messaging_product: 'whatsapp',
               to: ownerPhone,
               type: 'text',
               text: { body: `New Booking Paid!\n\n${message}` }
             })
           });
           resortWhatsappStatus = waRes2.ok ? 'sent' : 'failed';
           if (!waRes2.ok) console.error('Owner WhatsApp failed:', await waRes2.text());
         } catch (e) {
           console.error(e);
           resortWhatsappStatus = 'failed';
         }
       }
    }
    
    res.json({
      success: true,
      whatsapp: whatsappStatus,
      resortWhatsapp: resortWhatsappStatus,
      email: 'skipped',
      message: (whatsappStatus === 'sent' || resortWhatsappStatus === 'sent') ? 'Notifications sent.' : 'No notifications configured.'
    });
    
  } catch (error) {
    console.error('Booking notifications error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// -- Marketing API --
app.post('/api/marketing', async (req, res) => {
  try {
    const { message, audience } = req.body; // audience: 'all' or 'recent'
    if (!message) {
      return res.status(400).json({ message: 'Message content is required.' });
    }

    const bookings = await getBookings();
    
    // Extract unique phone numbers
    const uniquePhones = [...new Set(bookings.map(b => b.whatsapp).filter(Boolean))];
    
    // In a real application with WhatsApp Cloud API, you would loop through uniquePhones
    // and send the template message to each one via fetch to https://graph.facebook.com/v17.0/...
    
    // For this prototype, we will just simulate it
    console.log(`Sending marketing message to ${uniquePhones.length} customers: ${message}`);

    res.json({ 
      success: true, 
      sentCount: uniquePhones.length,
      message: `Successfully simulated sending marketing messages to ${uniquePhones.length} customers.` 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send marketing messages.' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

export default app;

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Green Coast server running on http://localhost:${port}`);
  });
}
