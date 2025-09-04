import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../sequelize/index.js';
import '../sequelize/models/index.js';

async function main() {
    await sequelize.sync({ alter: true });
    // eslint-disable-next-line no-console
    console.log('Banco sincronizado');
    process.exit(0);
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});


