import { Sequelize } from 'sequelize';

const databaseUrl = process.env.DATABASE_URL || 'sqlite:./data/showroom.sqlite';

export const sequelize = new Sequelize(databaseUrl, {
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});


