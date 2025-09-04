import { Router } from 'express';
import authRoutes from './auth.routes.js';
import carRoutes from './cars.routes.js';
import leadRoutes from './leads.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/leads', leadRoutes);

export default router;


