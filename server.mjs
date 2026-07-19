import 'dotenv/config';
import crypto from 'crypto';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3002);

app.use(express.json({ limit: '1mb' }));

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

const sendEmail = async ({ to, guestName, subject, message }) => {
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
      textContent: message
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
  const resortMessage = `New paid booking received:\n${message}`;

  const [whatsapp, resortWhatsapp, email] = await Promise.all([
    sendWhatsappText({ to: guestPhone, message }),
    sendWhatsappText({ to: resortPhone, message: resortMessage }),
    sendEmail({ to: booking.email, guestName: booking.guestName, subject, message })
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
    const auth = Buffer.from(`${credentials.keyId}:${credentials.keySecret}`).toString('base64');
    const response = await fetch(RAZORPAY_ORDERS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt
      })
    });

    const order = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('Razorpay order creation failed:', order || response.statusText);
      return res.status(response.status === 401 ? 401 : 500).json({
        message:
          response.status === 401
            ? 'Razorpay authentication failed.'
            : 'Unable to create Razorpay order.'
      });
    }

    return res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay order request failed:', error);
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

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Green Coast server running on http://localhost:${port}`);
});
