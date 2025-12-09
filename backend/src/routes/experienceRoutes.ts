import express from 'express';
import { createExperience, getExperience } from '../controllers/experienceController';
import upload from '../middleware/upload';

const router = express.Router();

// Create experience with file uploads
router.post(
  '/create',
  upload.fields([
    { name: 'photos', maxCount: 15 },
    { name: 'music', maxCount: 1 },
  ]),
  createExperience
);

// Get experience by unique ID
router.get('/:uniqueId', getExperience);

export default router;
