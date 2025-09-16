
import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

export const getUserProfileConnect = () => {

}
export const getProfile = async (req:Request, res:Response): Promise<void>  => {
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

