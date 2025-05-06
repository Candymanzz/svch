const Customer = require('./Customer');
const Contract = require('./Contract');
const Furniture = require('./Furniture');
const Sale = require('./Sale');

// Customer - Contract (One-to-Many)
Customer.hasMany(Contract, { foreignKey: 'customerId' });
Contract.belongsTo(Customer, { foreignKey: 'customerId' });

// Contract - Sale (One-to-Many)
Contract.hasMany(Sale, { foreignKey: 'contractId' });
Sale.belongsTo(Contract, { foreignKey: 'contractId' });

// Furniture - Sale (One-to-Many)
Furniture.hasMany(Sale, { foreignKey: 'furnitureId' });
Sale.belongsTo(Furniture, { foreignKey: 'furnitureId' });

module.exports = {
    Customer,
    Contract,
    Furniture,
    Sale
}; 