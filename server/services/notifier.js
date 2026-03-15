const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send email notification
 * @param {string} to - Recipient email
 * @param {string} url - The ticket URL
 * @param {string} matchName - The name of the match
 */
const sendNotification = async (to, url, matchName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: `🔥 Tickets Now Available: ${matchName}!`,
        text: `Great news! Tickets are now available for booking for "${matchName}".\n\nBook now: ${url}\n\nHappy watching!`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #4caf50; border-radius: 10px;">
                <h2 style="color: #2e7d32;">🔥 Tickets Now Available!</h2>
                <p>Great news! Tickets for <strong>${matchName}</strong> are now available for booking.</p>
                <div style="margin: 20px 0;">
                    <a href="${url}" style="background-color: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">BOOK NOW ON BOOKMYSHOW</a>
                </div>
                <p style="font-size: 0.9em; color: #666;">This is an automated notification from your Cricket Ticket Notifier.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${to} for ${matchName}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

/**
 * Send OTP via Email
 * @param {string} to - Recipient email
 * @param {string} otp - The OTP code
 */
const sendEmailOTP = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Your OTP for Cricket Notifier',
        text: `Your OTP for Cricket Notifier is ${otp}. It will expire in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #1976d2; border-radius: 10px;">
                <h2 style="color: #1976d2;">Verification Code</h2>
                <p>Hello,</p>
                <p>Your one-time password (OTP) for Cricket Notifier is:</p>
                <div style="margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1976d2; text-align: center;">
                    ${otp}
                </div>
                <p>This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
                <p style="font-size: 0.9em; color: #666;">This is an automated message from your Cricket Ticket Notifier.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email OTP sent to ${to}`);
    } catch (error) {
        console.error('Error sending email OTP:', error);
    }
};

/**
 * Send OTP via WhatsApp
 * @param {string} mobile - Recipient mobile number
 * @param {string} otp - The OTP code
 */
const sendWhatsAppOTP = async (mobile, otp) => {
    // Placeholder for WhatsApp API (e.g., Twilio)
    console.log(`[WHATSAPP MOCK] Sending OTP ${otp} to ${mobile}`);
    
    // Example Twilio Implementation (commented out):
    /*
    try {
        const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: `Your Cricket Notifier OTP is ${otp}. Valid for 10 mins.`,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${mobile}`
        });
        console.log(`WhatsApp OTP sent to ${mobile}`);
    } catch (error) {
        console.error('Error sending WhatsApp OTP:', error);
    }
    */
};

/**
 * Send OTP via both Email and WhatsApp
 * @param {string} email 
 * @param {string} mobile 
 * @param {string} otp 
 */
const sendOTP = async (email, mobile, otp) => {
    await Promise.all([
        sendEmailOTP(email, otp),
        sendWhatsAppOTP(mobile, otp)
    ]);
};

module.exports = { 
    sendNotification,
    sendEmailOTP,
    sendWhatsAppOTP,
    sendOTP
};
