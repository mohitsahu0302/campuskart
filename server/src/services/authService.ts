import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { SignupInput, LoginInput } from '../validations/authValidation.js';
import { AuthUserPayload } from '../middlewares/authMiddleware.js';

export const generateToken = (user: IUser): string => {
  const payload: AuthUserPayload = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    hostelArea: user.hostelArea,
  };
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const sanitizeUser = (user: IUser) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    hostelArea: user.hostelArea,
    roomNumber: user.roomNumber,
    phone: user.phone,
    whatsappNumber: user.whatsappNumber,
    preferredContactMethod: user.preferredContactMethod,
    savedListings: user.savedListings || [],
    createdAt: user.createdAt,
  };
};

export const registerUser = async (data: SignupInput) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new AppError('An account with this campus email already exists.', 409);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
    hostelArea: data.hostelArea,
    roomNumber: data.roomNumber,
    phone: data.phone,
    whatsappNumber: data.whatsappNumber || data.phone,
    preferredContactMethod: data.preferredContactMethod || 'whatsapp',
    savedListings: [],
  });

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

export const authenticateUser = async (data: LoginInput) => {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    throw new AppError('Invalid campus email or password.', 401);
  }

  const isMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid campus email or password.', 401);
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return sanitizeUser(user);
};
