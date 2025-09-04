import { DataTypes } from 'sequelize';
import { sequelize } from '../index.js';

export const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
});

export const Car = sequelize.define('Car', {
    brand: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    fuel: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('available', 'sold', 'reserved'), defaultValue: 'available' },
});

export const Image = sequelize.define('Image', {
    url: { type: DataTypes.STRING, allowNull: false },
});

export const Lead = sequelize.define('Lead', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT },
});

Car.hasMany(Image, { as: 'images', foreignKey: 'carId', onDelete: 'CASCADE' });
Image.belongsTo(Car, { foreignKey: 'carId' });

Car.hasMany(Lead, { as: 'leads', foreignKey: 'carId', onDelete: 'SET NULL' });
Lead.belongsTo(Car, { foreignKey: 'carId' });


