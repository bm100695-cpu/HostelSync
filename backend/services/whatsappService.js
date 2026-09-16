// WhatsApp Cloud API & Simulation Notification Engine
const { v4: uuidv4 } = require('uuid');
const mockStore = require('../data/mockDbStore');

async function sendWhatsAppNotification({ to, recipientName, type, message, details = {} }) {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  const logEntry = {
    id: `WA-${uuidv4().substring(0, 8).toUpperCase()}`,
    recipientPhone: to || '+91 98765 00000',
    recipientName: recipientName || 'Parent / Student',
    messageType: type,
    content: message,
    details,
    status: 'DELIVERED',
    timestamp: new Date().toISOString()
  };

  mockStore.whatsappLogs.unshift(logEntry);

  // If real WhatsApp Cloud API credentials are configured:
  if (token && phoneId && !token.includes('demo') && !phoneId.includes('demo')) {
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { body: message }
        })
      });
      const data = await response.json();
      console.log('✅ WhatsApp Cloud API Response:', data);
    } catch (err) {
      console.warn('⚠️ WhatsApp API Gateway Error:', err.message);
    }
  } else {
    console.log(`📱 [WhatsApp Simulator] Sent to ${to} (${recipientName}):\n"${message}"`);
  }

  return logEntry;
}

module.exports = {
  sendWhatsAppNotification
};
