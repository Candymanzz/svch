const { Customer, Furniture, Contract, Sale } = require('../models');

const seedDatabase = async () => {
    try {
        // Создаем клиентов
        const customers = await Customer.bulkCreate([
            {
                name: 'Иван Иванов',
                email: 'ivan@example.com',
                phone: '+7 (999) 123-45-67',
                address: 'ул. Ленина, 10'
            },
            {
                name: 'Петр Петров',
                email: 'petr@example.com',
                phone: '+7 (999) 765-43-21',
                address: 'ул. Пушкина, 15'
            },
            {
                name: 'Мария Сидорова',
                email: 'maria@example.com',
                phone: '+7 (999) 111-22-33',
                address: 'пр. Мира, 20'
            }
        ]);

        // Создаем мебель
        const furniture = await Furniture.bulkCreate([
            {
                name: 'Диван "Комфорт"',
                model: 'DC-2023',
                characteristics: 'Размеры: 200x90x80 см, Материал: ткань, Цвет: серый',
                price: 25000,
                image: 'sofa.jpg'
            },
            {
                name: 'Стол обеденный',
                model: 'ST-2023',
                characteristics: 'Размеры: 160x90x75 см, Материал: дерево, Цвет: белый',
                price: 15000,
                image: 'table.jpg'
            },
            {
                name: 'Шкаф-купе',
                model: 'SK-2023',
                characteristics: 'Размеры: 200x60x220 см, Материал: ЛДСП, Цвет: венге',
                price: 35000,
                image: 'wardrobe.jpg'
            },
            {
                name: 'Кровать "Ортопедия"',
                model: 'KB-2023',
                characteristics: 'Размеры: 200x160x50 см, Материал: дерево, Цвет: бежевый',
                price: 30000,
                image: 'bed.jpg'
            }
        ]);

        // Создаем контракты
        const contracts = await Contract.bulkCreate([
            {
                number: 'CON-2023-001',
                customerId: customers[0].id,
                date: new Date('2023-01-01'),
                executionDate: new Date('2023-12-31'),
                totalAmount: 60000,
                status: 'active'
            },
            {
                number: 'CON-2023-002',
                customerId: customers[1].id,
                date: new Date('2023-02-01'),
                executionDate: new Date('2023-11-30'),
                totalAmount: 45000,
                status: 'active'
            },
            {
                number: 'CON-2023-003',
                customerId: customers[2].id,
                date: new Date('2023-03-01'),
                executionDate: new Date('2023-10-31'),
                totalAmount: 70000,
                status: 'completed'
            }
        ]);

        // Создаем продажи
        await Sale.bulkCreate([
            {
                contractId: contracts[0].id,
                furnitureId: furniture[0].id,
                quantity: 1,
                price: 25000,
                date: new Date('2023-01-15')
            },
            {
                contractId: contracts[0].id,
                furnitureId: furniture[1].id,
                quantity: 1,
                price: 15000,
                date: new Date('2023-01-15')
            },
            {
                contractId: contracts[1].id,
                furnitureId: furniture[2].id,
                quantity: 1,
                price: 35000,
                date: new Date('2023-02-10')
            },
            {
                contractId: contracts[2].id,
                furnitureId: furniture[3].id,
                quantity: 1,
                price: 30000,
                date: new Date('2023-03-05')
            }
        ]);

        console.log('База данных успешно заполнена начальными данными');
    } catch (error) {
        console.error('Ошибка при заполнении базы данных:', error);
    }
};

module.exports = seedDatabase; 