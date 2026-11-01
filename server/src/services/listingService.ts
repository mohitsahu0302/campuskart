import { Types } from 'mongoose';
import { Listing, IListing } from '../models/Listing.js';
import { User } from '../models/User.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import {
  CreateListingInput,
  UpdateListingInput,
  QueryListingInput,
} from '../validations/listingValidation.js';

export const getListings = async (query: QueryListingInput) => {
  const filter: any = {};

  // Status filter (defaults to active unless specified)
  if (query.status && query.status !== 'all') {
    filter.status = query.status;
  } else if (!query.status) {
    filter.status = 'active';
  }

  // Text / Query Search (supports both exact keyword and regex substring)
  if (query.q && query.q.trim()) {
    const term = query.q.trim();
    filter.$or = [
      { title: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { hostelArea: { $regex: term, $options: 'i' } },
    ];
  }

  // Category filter
  if (query.category && query.category !== 'All') {
    filter.category = query.category;
  }

  // Condition filter
  if (query.condition && query.condition !== 'All') {
    filter.condition = query.condition;
  }

  // Hostel / Campus Area filter
  if (query.hostelArea && query.hostelArea !== 'All') {
    filter.hostelArea = { $regex: query.hostelArea, $options: 'i' };
  }

  // Price range filter
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {};
    if (query.minPrice !== undefined) {
      filter.price.$gte = query.minPrice;
    }
    if (query.maxPrice !== undefined) {
      filter.price.$lte = query.maxPrice;
    }
  }

  // Sorting
  let sortOption: any = { createdAt: -1 };
  switch (query.sort) {
    case 'price_asc':
      sortOption = { price: 1, createdAt: -1 };
      break;
    case 'price_desc':
      sortOption = { price: -1, createdAt: -1 };
      break;
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case 'newest':
    default:
      sortOption = { createdAt: -1 };
      break;
  }

  const page = query.page || 1;
  const limit = query.limit || 12;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Listing.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
    Listing.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page * limit < total,
    },
  };
};

export const getListingById = async (id: string, currentUserId?: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid listing ID format', 400);
  }

  const listing = await Listing.findByIdAndUpdate(
    id,
    { $inc: { viewsCount: 1 } },
    { new: true }
  ).populate('sellerId', 'name email hostelArea phone whatsappNumber preferredContactMethod');

  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  const listingObj = listing.toObject();

  // If user is not authenticated, mask contact details
  const isOwner = currentUserId && listing.sellerId && (listing.sellerId as any)._id?.toString() === currentUserId;
  const isLoggedIn = !!currentUserId;

  return {
    ...listingObj,
    isOwner: !!isOwner,
    canViewContact: isLoggedIn,
    contactInfo: isLoggedIn ? listingObj.contactInfo : null,
    contactMethod: isLoggedIn ? listingObj.contactMethod : null,
  };
};

export const createListing = async (
  userId: string,
  data: CreateListingInput
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const listing = await Listing.create({
    ...data,
    sellerId: user._id,
    sellerName: user.name,
    status: 'active',
  });

  return listing;
};

export const updateListing = async (
  listingId: string,
  userId: string,
  data: UpdateListingInput
) => {
  if (!Types.ObjectId.isValid(listingId)) {
    throw new AppError('Invalid listing ID format', 400);
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  if (listing.sellerId.toString() !== userId) {
    throw new AppError('You are not authorized to update this listing.', 403);
  }

  Object.assign(listing, data);
  await listing.save();

  return listing;
};

export const deleteListing = async (listingId: string, userId: string) => {
  if (!Types.ObjectId.isValid(listingId)) {
    throw new AppError('Invalid listing ID format', 400);
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  if (listing.sellerId.toString() !== userId) {
    throw new AppError('You are not authorized to delete this listing.', 403);
  }

  await Listing.findByIdAndDelete(listingId);
  // Also remove from any saved listings
  await User.updateMany(
    { savedListings: listingId },
    { $pull: { savedListings: listingId } }
  );

  return { message: 'Listing deleted successfully' };
};

export const toggleSoldStatus = async (listingId: string, userId: string) => {
  if (!Types.ObjectId.isValid(listingId)) {
    throw new AppError('Invalid listing ID format', 400);
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  if (listing.sellerId.toString() !== userId) {
    throw new AppError('You are not authorized to modify this listing.', 403);
  }

  listing.status = listing.status === 'active' ? 'sold' : 'active';
  await listing.save();

  return listing;
};

export const getUserListings = async (userId: string) => {
  const listings = await Listing.find({ sellerId: userId })
    .sort({ createdAt: -1 })
    .lean();
  return listings;
};
