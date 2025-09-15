
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
import { generateOTP, getOTPExpiry, isOTPExpired, sendOTPEmail } from '../utils/otp';
const prisma = new PrismaClient();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});

const resendOTPSchema = Joi.object({
  email: Joi.string().email().required()
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
    const { email, password, name } = value;

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
};export const login = () => {

}
export const logout = () => {

}
export const getProfile = () => {

}
export const verifyOTP = () => {

}
export const resendOTP = () => {

}
export const getUserProfileConnect = () => {

}
