import { Router } from 'express';
import { Op } from 'sequelize';
import { Car, Image } from '../sequelize/models/index.js';
import { requireAuth } from '../security/requireAuth.js';
import { upload, buildPublicUrl } from '../uploads/storage.js';

const router = Router();

router.get('/', async (req, res) => {
    const { page = 1, perPage = 12, q, brand, fuel, minPrice, maxPrice, year } = req.query;
    const where = {};
    if (q) where.model = { [Op.like]: `%${q}%` };
    if (brand) where.brand = brand;
    if (fuel) where.fuel = fuel;
    if (year) where.year = Number(year);
    if (minPrice || maxPrice) where.price = { ...(minPrice && { [Op.gte]: Number(minPrice) }), ...(maxPrice && { [Op.lte]: Number(maxPrice) }) };

    const result = await Car.findAndCountAll({
        where,
        include: [{ model: Image, as: 'images', attributes: ['id', 'url'] }],
        offset: (Number(page) - 1) * Number(perPage),
        limit: Number(perPage),
        order: [['createdAt', 'DESC']]
    });
    res.json({ items: result.rows, total: result.count, page: Number(page), perPage: Number(perPage) });
});

router.get('/:id', async (req, res) => {
    const car = await Car.findByPk(req.params.id, { include: [{ model: Image, as: 'images' }] });
    if (!car) return res.status(404).json({ message: 'Carro não encontrado' });
    res.json(car);
});

router.post('/', requireAuth('admin'), async (req, res) => {
    const car = await Car.create(req.body);
    res.status(201).json(car);
});

router.put('/:id', requireAuth('admin'), async (req, res) => {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ message: 'Carro não encontrado' });
    await car.update(req.body);
    res.json(car);
});

router.delete('/:id', requireAuth('admin'), async (req, res) => {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ message: 'Carro não encontrado' });
    await car.destroy();
    res.status(204).end();
});

export default router;

// Upload de imagens para um carro específico
router.post('/:id/images', requireAuth('admin'), upload.array('images', 10), async (req, res) => {
    const car = await Car.findByPk(req.params.id);
    if (!car) return res.status(404).json({ message: 'Carro não encontrado' });
    const files = req.files || [];
    const created = await Promise.all(
        files.map((f) => Image.create({ carId: car.id, url: buildPublicUrl(f.filename) }))
    );
    res.status(201).json(created);
});


