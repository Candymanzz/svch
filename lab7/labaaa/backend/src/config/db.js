const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('furniture_store', 'postgres', 'root', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: false
});

module.exports = sequelize; 