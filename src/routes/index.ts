import express from 'express';
import { createProfile, getProfile, getProfiles } from '../controllers/profile';

const router = express.Router();

router.get('/user', getProfiles);
router.get('/user/:id', getProfile);
router.post('/user', createProfile);

export default router;
