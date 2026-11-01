import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService.js';

export const toggleSavedListing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const listingId = req.params.id as string;
    const result = await userService.toggleSavedListing(
      req.user!.userId,
      listingId
    );

    res.status(200).json({
      success: true,
      message: result.isSaved
        ? 'Pinned to your saved items'
        : 'Removed from saved items',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedListings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const saved = await userService.getSavedListings(req.user!.userId);

    res.status(200).json({
      success: true,
      data: { savedListings: saved },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.user!.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};
