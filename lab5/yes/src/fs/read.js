const fs = require('fs').promises;
const path = require('path');

async function readRecord(id) {
    try {
        const dataDir = path.join(__dirname, 'data');
        const indexFile = path.join(dataDir, 'book_index.json');

        // Read index file
        const indexContent = await fs.readFile(indexFile, 'utf8');
        const indexData = JSON.parse(indexContent);

        // Find record in index
        const record = indexData.find(r => r.id === id);
        if (!record) {
            throw new Error(`Record with ID ${id} not found`);
        }

        // Read the record file
        const filePath = path.join(dataDir, record.filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const bookData = JSON.parse(fileContent);

        // Display detailed information
        console.log('\nDetailed Book Information:');
        console.log('=========================');
        console.log(`ID: ${bookData.id}`);
        console.log(`Title: ${bookData.title}`);
        console.log(`Author: ${bookData.author}`);
        console.log(`ISBN: ${bookData.isbn}`);
        console.log(`Year: ${bookData.year}`);
        console.log('=========================\n');

        return bookData;
    } catch (error) {
        console.error('Error reading record:', error.message);
        throw error;
    }
}

// Handle command line arguments
if (require.main === module) {
    const [id] = process.argv.slice(2);

    if (!id) {
        console.error('Usage: node read.js <record_id>');
        process.exit(1);
    }

    readRecord(id)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = readRecord; 