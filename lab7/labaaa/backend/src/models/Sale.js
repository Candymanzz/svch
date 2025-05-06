const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sale = sequelize.define('Sale', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contractId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Contracts',
            key: 'id'
        }
    },
    furnitureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Furniture',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
}, {
    timestamps: true
});

module.exports = Sale; 