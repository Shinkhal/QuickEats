import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendWhatsApp = async (to, message) => {
    try {
        const response = await client.messages.create({
            from: 'whatsapp:+14155238886', // Twilio sandbox number
            to: `whatsapp:${to}`, // User's phone number with country code
            body: message,
        });
        console.log('WhatsApp message sent:', response.sid);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
    }
};
