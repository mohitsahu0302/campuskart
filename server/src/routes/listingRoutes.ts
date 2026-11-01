import { Router } from 'express';
import * as listingController from '../controllers/listingController.js';
import * as reportController from '../controllers/reportController.js';
import { requireAuth, optionalAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Public / optionally authenticated browse
router.get('/', optionalAuth, listingController.getListings);
router.get('/my', requireAuth, listingController.getMyListings);
router.get('/:id', optionalAuth, listingController.getListingById);

// Protected mutations
router.post('/', requireAuth, listingController.createListing);
router.put('/:id', requireAuth, listingController.updateListing);
router.delete('/:id', requireAuth, listingController.deleteListing);
router.patch('/:id/sold', requireAuth, listingController.toggleSoldStatus);

// Report listing
router.post('/:id/report', optionalAuth, reportController.createReportHandler);

export default router;
