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

module.exports = { sendNotification };
