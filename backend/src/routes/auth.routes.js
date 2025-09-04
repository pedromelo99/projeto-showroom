import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../sequelize/models/index.js';
import { requireAuth } from '../security/requireAuth.js';

const router = Router();

router.post(
    '/register',
    body('name').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(409).json({ message: 'Email já registrado' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash, role: 'user' });
        return res.status(201).json({ id: user.id, name: user.name, email: user.email });
    }
);

router.post(
    '/login',
    body('email').isEmail(),
    body('password').isString(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });
        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }
);

export default router;

// Retorna dados do usuário autenticado
router.get('/me', requireAuth(), async (req, res) => {
    const user = await User.findByPk(req.user.sub, {
        attributes: ['id', 'name', 'email', 'role']
    });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json({ user });
});

// Logout stateless (opcionalmente invalidar tokens via blacklist em store externa)
router.post('/logout', requireAuth(), async (_req, res) => {
    res.status(204).end();
});


