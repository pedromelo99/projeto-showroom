import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Lead } from '../sequelize/models/index.js';

const router = Router();

router.post(
    '/',
    body('name').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('phone').isString().isLength({ min: 8 }),
    body('carId').isInt(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        const { name, email, phone, carId, message } = req.body;
        const lead = await Lead.create({ name, email, phone, carId, message });
        res.status(201).json(lead);
    }
);

export default router;


