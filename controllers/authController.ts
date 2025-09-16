import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';
import Joi from 'joi';
import { generateOTP, getOTPExpiry, isOTPExpired, sendOTPEmail } from '../utils/otp';

const prisma = new PrismaClient();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().optional(),
  role: Joi.string().valid('USER', 'ADMIN', 'PREMIUM').optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Register request body:', req.body);
    const { error, value } = registerSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
      return;
    }
    const { email, password, name, role } = value;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({ 
        success: false, 
        message: 'User already exists' 
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role || 'USER',
        otp,
        otpExpiry
      }
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for OTP verification.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
      return;
    }

    const { email, password } = value;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      return;
    }

    if (!user.isVerified) {
      res.status(401).json({ 
        success: false, 
        message: 'Please verify your email with OTP before logging in' 
      });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = verifyOTPSchema.validate(req.body);
    
    if (error) {
      res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
      return;
    }

    const { email, otp } = value;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ 
        success: false, 
        message: 'User is already verified' 
      });
      return;
    }

    if (!user.otp || !user.otpExpiry) {
      res.status(400).json({ 
        success: false, 
        message: 'No OTP found. Please request a new one.' 
      });
      return;
    }

    if (isOTPExpired(user.otpExpiry)) {
      res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new one.' 
      });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
      return;
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ 
        success: false, 
        message: 'User is already verified' 
      });
      return;
    }

    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpiry
      }
    });

    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};
export const getUserProfileConnect = async (req:Request, res:Response): Promise<void>  => {
    try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
      return;
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

