import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { sequelize } from '../sequelize/index.js';
import { User } from '../sequelize/models/index.js';

async function main() {
    await sequelize.sync();
    const email = process.env.ADMIN_EMAIL || 'admin@showroom.local';
    const name = process.env.ADMIN_NAME || 'Admin';
    const password = process.env.ADMIN_PASSWORD || 'changeme';
    const existing = await User.findOne({ where: { email } });
    if (existing) {
        // eslint-disable-next-line no-console
        console.log('Admin já existe:', email);
        return process.exit(0);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, passwordHash, role: 'admin' });
    // eslint-disable-next-line no-console
    console.log('Admin criado:', email);
    process.exit(0);
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});


