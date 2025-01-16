import express from 'express';
import { analyzeEventsWithStatusFilterAndLastStep } from '../controllers/eventAnalysisController.js';

const router = express.Router();

// Route to get event analysis by status and last step completion
router.get('/event', analyzeEventsWithStatusFilterAndLastStep);

export default router;
