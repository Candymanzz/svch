const fs = require('fs').promises;
const path = require('path');

async function deleteRecord(id) {
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

        // Delete the record file
        const filePath = path.join(dataDir, record.filename);
        await fs.unlink(filePath);

        // Update index by removing the record
        const updatedIndex = indexData.filter(r => r.id !== id);
        await fs.writeFile(indexFile, JSON.stringify(updatedIndex, null, 2));

        console.log(`Successfully deleted record with ID: ${id}`);
    } catch (error) {
        console.error('Error deleting record:', error.message);
        throw error;
    }
}

// Handle command line arguments
if (require.main === module) {
    const [id] = process.argv.slice(2);

    if (!id) {
        console.error('Usage: node delete.js <record_id>');
        process.exit(1);
    }

    deleteRecord(id)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = deleteRecord; 