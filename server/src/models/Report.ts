import mongoose, { Document, Schema, Types } from 'mongoose';

export const REPORT_REASONS = [
  'Inappropriate or Offensive',
  'Wrong Category',
  'Suspicious or Scam',
  'Already Sold',
  'Duplicate Listing',
  'Other',
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export interface IReport extends Document {
  _id: Types.ObjectId;
  listingId: Types.ObjectId;
  reporterId?: Types.ObjectId;
  reason: ReportReason;
  details?: string;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
    },
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    reason: {
      type: String,
      required: true,
      enum: REPORT_REASONS,
    },
    details: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
