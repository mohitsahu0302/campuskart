import { Types } from 'mongoose';
import { Report } from '../models/Report.js';
import { Listing } from '../models/Listing.js';
import { AppError } from '../middlewares/errorMiddleware.js';

export const createReport = async (
  listingId: string,
  reason: any,
  details?: string,
  reporterId?: string
) => {
  if (!Types.ObjectId.isValid(listingId)) {
    throw new AppError('Invalid listing ID format', 400);
  }

  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new AppError('Listing not found', 404);
  }

  const report = await Report.create({
    listingId,
    reason,
    details,
    reporterId: reporterId ? new Types.ObjectId(reporterId) : undefined,
  });

  return report;
};
