const fs = require('fs').promises;
const path = require('path');

async function searchBooks(searchTerm) {
    try {
        const dataDir = path.join(__dirname, '..', 'fs', 'data');
        const indexFile = path.join(dataDir, 'book_index.json');

        // Read the index file
        const indexContent = await fs.readFile(indexFile, 'utf8');
        const indexData = JSON.parse(indexContent);

        // Perform search
        const results = [];
        for (const record of indexData) {
            const filePath = path.join(dataDir, record.filename);
            const fileContent = await fs.readFile(filePath, 'utf8');
            const bookData = JSON.parse(fileContent);

            // Search in title and author
            if (
                bookData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                bookData.author.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                results.push(bookData);
            }
        }

        // Output results as JSON
        console.log(JSON.stringify(results));
    } catch (error) {
        console.error('Error in search worker:', error.message);
        process.exit(1);
    }
}

// Handle command line arguments
if (require.main === module) {
    const [searchTerm] = process.argv.slice(2);

    if (!searchTerm) {
        console.error('Usage: node search-worker.js <search_term>');
        process.exit(1);
    }

    searchBooks(searchTerm)
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
} 