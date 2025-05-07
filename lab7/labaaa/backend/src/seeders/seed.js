const { Customer, Furniture, Contract, Sale } = require('../models');

const seedDatabase = async () => {
    try {
        // Create customers
        const customers = await Customer.create([
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

        // Create furniture
        const furniture = await Furniture.create([
            {
                name: 'Диван "Комфорт"',
                model: 'DK-2023',
                characteristics: 'Трехместный диван с механизмом трансформации',
                price: 25000,
                image: 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fanisola-mebel.ru%2Fu%2F2022%2F08%2Fnog3.jpg&sp=1746653691T0026d3b65d62c11bb32eaca855b3ddfb6d471721b6088d8253892799ac58b096'
            },
            {
                name: 'Стол обеденный',
                model: 'ST-2023',
                characteristics: 'Деревянный стол на 6 персон',
                price: 15000,
                image: 'https://www.startpage.com/av/proxy-image?piurl=http%3A%2F%2Fwww.elw.ru%2Fwp-content%2Fuploads%2F2017%2F01%2FSovremennyie-modulnyie-stenki-dlya-gostinoy-kak-osnova-interera.jpg&sp=1746653691Tf480789e9e47bad53d3a21315f06a4c6d798797ba9d075bded5cd97552b0ec79'
            },
            {
                name: 'Шкаф-купе',
                model: 'SK-2023',
                characteristics: 'Шкаф-купе с зеркальными дверями',
                price: 35000,
                image: 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fwww.maplewood.ru%2Fupload%2Fiblock%2F89a%2F89ade4f6b69cdc647c91907010925609.jpg&sp=1746653691T08e49630414e5d8f5b550c0908f9452e8af928dfca6ae4f8d81a591962f16656'
            },
            {
                name: 'Кровать двуспальная',
                model: 'KB-2023',
                characteristics: 'Двуспальная кровать с ортопедическим матрасом',
                price: 30000,
                image: 'https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fpusan-mebel.ru%2Fcontent%2Fcatalog%2Fgoods%2F2018%2Ffull_banner.jpg&sp=1746653691Tee60b55c3ed0c77ff93611f5613e59b88535b1c2734755035753212a06c050df'
            }
        ]);

        // Create contracts
        const contracts = await Contract.create([
            {
                number: 'CON-2023-001',
                customerId: customers[0]._id,
                date: new Date('2023-01-01'),
                executionDate: new Date('2023-12-31'),
                totalAmount: 60000,
                status: 'active'
            },
            {
                number: 'CON-2023-002',
                customerId: customers[1]._id,
                date: new Date('2023-02-01'),
                executionDate: new Date('2023-11-30'),
                totalAmount: 45000,
                status: 'active'
            },
            {
                number: 'CON-2023-003',
                customerId: customers[2]._id,
                date: new Date('2023-03-01'),
                executionDate: new Date('2023-10-31'),
                totalAmount: 70000,
                status: 'completed'
            }
        ]);

        // Create sales
        await Sale.create([
            {
                contractId: contracts[0]._id,
                furnitureId: furniture[0]._id,
                quantity: 1,
                price: 25000,
                date: new Date('2023-01-15')
            },
            {
                contractId: contracts[0]._id,
                furnitureId: furniture[1]._id,
                quantity: 1,
                price: 15000,
                date: new Date('2023-01-15')
            },
            {
                contractId: contracts[1]._id,
                furnitureId: furniture[2]._id,
                quantity: 1,
                price: 35000,
                date: new Date('2023-02-10')
            },
            {
                contractId: contracts[2]._id,
                furnitureId: furniture[3]._id,
                quantity: 1,
                price: 30000,
                date: new Date('2023-03-05')
            }
        ]);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

module.exports = seedDatabase; 