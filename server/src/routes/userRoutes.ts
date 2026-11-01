import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/saved', userController.getSavedListings);
router.post('/saved/:id', userController.toggleSavedListing);
router.patch('/profile', userController.updateProfile);

export default router;
