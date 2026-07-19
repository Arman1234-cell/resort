import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 3002);

app.use(express.json({ limit: '1mb' }));

const normalizePhone = (value = '') => value.replace(/\D/g, '');

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

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Green Coast server running on http://localhost:${port}`);
});
