import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

const isConfigured = (): boolean =>
  !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Sends an email through SMTP. Returns true if sent, false if SMTP is
 * not configured or sending failed. Never throws.
 */
export const sendEmail = async (
  options: SendEmailOptions
): Promise<boolean> => {
  if (!isConfigured()) {
    console.log(
      `📧 SMTP not configured - email NOT sent.\n   To: ${options.to}\n   Subject: ${options.subject}\n   ${options.text || ''}`
    );
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM || `MHK Travels <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    return true;
  } catch (error) {
    console.error('Send email error:', error);
    return false;
  }
};