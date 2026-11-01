import { Request, Response, NextFunction } from 'express';
import {
  createListingSchema,
  updateListingSchema,
  queryListingSchema,
} from '../validations/listingValidation.js';
import * as listingService from '../services/listingService.js';

export const getListings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = queryListingSchema.parse(req.query);
    const result = await listingService.getListings(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const listingId = req.params.id as string;
    const listing = await listingService.getListingById(
      listingId,
      req.user?.userId
    );

    res.status(200).json({
      success: true,
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
};

export const createListing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = createListingSchema.parse(req.body);
    const listing = await listingService.createListing(
      req.user!.userId,
      validatedData
    );

    res.status(201).json({
      success: true,
      message: 'Listing pinned successfully!',
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = updateListingSchema.parse(req.body);
    const listingId = req.params.id as string;
    const listing = await listingService.updateListing(
      listingId,
      req.user!.userId,
      validatedData
    );

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const listingId = req.params.id as string;
    const result = await listingService.deleteListing(
      listingId,
      req.user!.userId
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSoldStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const listingId = req.params.id as string;
    const listing = await listingService.toggleSoldStatus(
      listingId,
      req.user!.userId
    );

    res.status(200).json({
      success: true,
      message: `Listing marked as ${listing.status}`,
      data: { listing },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const listings = await listingService.getUserListings(req.user!.userId);

    res.status(200).json({
      success: true,
      data: { listings },
    });
  } catch (error) {
    next(error);
  }
};
