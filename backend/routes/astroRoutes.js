import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getAstroData } from '../controllers/astroController.js';

const router = express.Router();

// router.get('/data', getAstroData);
router.post('/data', protect, getAstroData);

export default router;