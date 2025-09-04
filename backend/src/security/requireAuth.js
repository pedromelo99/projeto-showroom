import jwt from 'jsonwebtoken';

export function requireAuth(requiredRole) {
    return (req, res, next) => {
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
        if (!token) return res.status(401).json({ message: 'Token ausente' });
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev');
            req.user = payload;
            if (requiredRole && payload.role !== requiredRole) {
                return res.status(403).json({ message: 'Acesso negado' });
            }
            next();
        } catch (_e) {
            return res.status(401).json({ message: 'Token inválido' });
        }
    };
}


