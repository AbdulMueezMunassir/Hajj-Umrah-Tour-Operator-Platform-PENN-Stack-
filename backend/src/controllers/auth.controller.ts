import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../config/database';
import { generateToken } from '../config/jwt';
import { AuthRequest } from '../middleware/auth';
import { sendEmail, escapeHtml } from '../services/email.service';



// ==========================================
// REGISTER
// ==========================================
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone, whatsapp, address } =
      req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        whatsapp,
        address,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user,
        token,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user.',
      error: error.message,
    });
  }
};

// ==========================================
// LOGIN
// ==========================================
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login.',
      error: error.message,
    });
  }
};

// ==========================================
// GET CURRENT USER (ME)
// ==========================================
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        whatsapp: true,
        address: true,
        role: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user.',
      error: error.message,
    });
  }
};

// ==========================================
// CHANGE PASSWORD
// ==========================================
export const changePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Current and new password are required.',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      res.status(401).json({
        success: false,
        message: 'Current password is incorrect.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password.',
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { firstName, lastName, phone, whatsapp, address } = req.body;

    if (
      !firstName ||
      !String(firstName).trim() ||
      !lastName ||
      !String(lastName).trim()
    ) {
      res.status(400).json({
        success: false,
        message: 'First name and last name are required.',
      });
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        phone: phone ? String(phone).trim() : null,
        whatsapp: whatsapp ? String(whatsapp).trim() : null,
        address: address ? String(address).trim() : null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        whatsapp: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message,
    });
  }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Same response whether or not the email exists (prevents user enumeration)
  const genericResponse = {
    success: true,
    message:
      'If an account exists for that email, a reset link has been sent.',
  };

  try {
    const email = String(req.body.email || '')
      .trim()
      .toLowerCase();

    if (!email) {
      res
        .status(400)
        .json({ success: false, message: 'Email is required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(200).json(genericResponse);
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your MHK Travels password',
      text: `Reset link (valid for 1 hour): ${resetLink}`,
      html: `
        <p>Assalamu Alaikum ${escapeHtml(user.firstName)},</p>
        <p>We received a request to reset your MHK Travels password.</p>
        <p><a href="${resetLink}">Click here to choose a new password</a></p>
        <p>This link is valid for 1 hour. If you did not request this, you can ignore this email.</p>
      `,
    });

    res.status(200).json(genericResponse);
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

// ==========================================
// RESET PASSWORD
// ==========================================
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Token and new password are required.',
      });
      return;
    }

    if (String(newPassword).length < 6) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
      return;
    }

    const tokenHash = crypto
      .createHash('sha256')
      .update(String(token))
      .digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'This reset link is invalid or has expired.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(newPassword), salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetTokenHash: null,
        resetTokenExpires: null,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password.',
    });
  }
};