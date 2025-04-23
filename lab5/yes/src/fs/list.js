const fs = require('fs').promises;
const path = require('path');

async function listRecords() {
    try {
        const dataDir = path.join(__dirname, 'data');
        const indexFile = path.join(dataDir, 'book_index.json');

        // Read index file
        const indexContent = await fs.readFile(indexFile, 'utf8');
        const indexData = JSON.parse(indexContent);

        if (indexData.length === 0) {
            console.log('No records found in the system.');
            return;
        }

        console.log('\nList of all records:');
        console.log('===================');
        indexData.forEach((record, index) => {
            console.log(`\n${index + 1}. Book Details:`);
            console.log(`   ID: ${record.id}`);
            console.log(`   Title: ${record.title}`);
            console.log(`   Author: ${record.author}`);
            console.log(`   File: ${record.filename}`);
        });
        console.log('\n===================');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('No records found in the system.');
        } else {
            console.error('Error listing records:', error.message);
            throw error;
        }
    }
}

// Handle command line arguments
if (require.main === module) {
    listRecords()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = listRecords; 