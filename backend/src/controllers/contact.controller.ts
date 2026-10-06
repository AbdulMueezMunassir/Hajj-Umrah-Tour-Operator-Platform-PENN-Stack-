import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendEmail, escapeHtml } from '../services/email.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================
// SUBMIT CONTACT FORM (Public)
// ==========================================
export const submitContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !String(name).trim()) {
      res.status(400).json({ success: false, message: 'Name is required.' });
      return;
    }
    if (!email || !EMAIL_REGEX.test(String(email).trim())) {
      res
        .status(400)
        .json({ success: false, message: 'A valid email is required.' });
      return;
    }
    if (!subject || !String(subject).trim()) {
      res.status(400).json({ success: false, message: 'Subject is required.' });
      return;
    }
    if (!message || String(message).trim().length < 10) {
      res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters.',
      });
      return;
    }

    const data = {
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().slice(0, 150),
      phone: phone ? String(phone).trim().slice(0, 30) : null,
      subject: String(subject).trim().slice(0, 150),
      message: String(message).trim().slice(0, 3000),
    };

    // Always store the message, even if email sending fails
    await prisma.contactMessage.create({ data });

    // Best-effort email to the MHK Travels inbox
    await sendEmail({
      to: process.env.CONTACT_EMAIL_TO || 'info@mhktravels.com',
      subject: `[Website Contact] ${data.subject}`,
      replyTo: data.email,
      text: `From: ${data.name} <${data.email}>\nPhone: ${data.phone || '-'}\n\n${data.message}`,
      html: `
        <h2>New website message</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone || '-')}</p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
    });
  } catch (error: any) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send your message. Please try again.',
    });
  }
};