import { Types } from 'mongoose';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { AppError } from '../middlewares/errorMiddleware.js';

export const toggleSavedListing = async (userId: string, listingId: string) => {
  if (!Types.ObjectId.isValid(listingId)) {
    throw new AppError('Invalid listing ID format', 400);
  }

  const listingExists = await Listing.findById(listingId);
  if (!listingExists) {
    throw new AppError('Listing not found', 404);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const listIdObj = new Types.ObjectId(listingId);
  const index = user.savedListings.findIndex((id) => id.toString() === listingId);

  let isSaved = false;
  if (index > -1) {
    user.savedListings.splice(index, 1);
    isSaved = false;
  } else {
    user.savedListings.push(listIdObj);
    isSaved = true;
  }

  await user.save();
  return {
    isSaved,
    savedListings: user.savedListings.map((id) => id.toString()),
  };
};

export const getSavedListings = async (userId: string) => {
  const user = await User.findById(userId).populate({
    path: 'savedListings',
    populate: { path: 'sellerId', select: 'name hostelArea' },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user.savedListings;
};

export const updateUserProfile = async (
  userId: string,
  data: {
    name?: string;
    hostelArea?: string;
    roomNumber?: string;
    phone?: string;
    whatsappNumber?: string;
    preferredContactMethod?: 'whatsapp' | 'email' | 'phone';
  }
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (data.name) user.name = data.name;
  if (data.hostelArea) user.hostelArea = data.hostelArea;
  if (data.roomNumber !== undefined) user.roomNumber = data.roomNumber;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.whatsappNumber !== undefined) user.whatsappNumber = data.whatsappNumber;
  if (data.preferredContactMethod) user.preferredContactMethod = data.preferredContactMethod;

  await user.save();
  return user;
};
