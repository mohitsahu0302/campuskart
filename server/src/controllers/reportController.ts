import { Request, Response, NextFunction } from 'express';
import { reportListingSchema } from '../validations/listingValidation.js';
import * as reportService from '../services/reportService.js';

export const createReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reason, details } = reportListingSchema.parse(req.body);
    const listingId = req.params.id as string;
    const report = await reportService.createReport(
      listingId,
      reason,
      details,
      req.user?.userId
    );

    res.status(201).json({
      success: true,
      message: 'Notice reported. The campus moderators will inspect it.',
      data: { report },
    });
  } catch (error) {
    next(error);
  }
};
