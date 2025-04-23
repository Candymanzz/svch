const fs = require('fs').promises;
const path = require('path');

async function createRecord(title, author, isbn, year) {
    try {
        // Create data directory if it doesn't exist
        const dataDir = path.join(__dirname, 'data');
        await fs.mkdir(dataDir, { recursive: true });

        // Generate unique ID using timestamp
        const id = Date.now().toString();
        const filename = `book_${id}.json`;
        const filepath = path.join(dataDir, filename);

        // Check if file already exists
        try {
            await fs.access(filepath);
            throw new Error('Ошибка операции FS: Запись уже существует');
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        // Create book record
        const bookData = {
            id,
            title,
            author,
            isbn,
            year: parseInt(year)
        };

        // Write book data to file
        await fs.writeFile(filepath, JSON.stringify(bookData, null, 2));

        // Update index file
        const indexFile = path.join(dataDir, 'book_index.json');
        let indexData = [];

        try {
            const indexContent = await fs.readFile(indexFile, 'utf8');
            indexData = JSON.parse(indexContent);
        } catch (error) {
            // Index file doesn't exist yet, that's okay
        }

        // Add new entry to index
        indexData.push({
            id,
            title,
            author,
            filename
        });

        // Write updated index
        await fs.writeFile(indexFile, JSON.stringify(indexData, null, 2));

        console.log(`Successfully created new book record with ID: ${id}`);
        return id;
    } catch (error) {
        console.error('Error creating record:', error.message);
        throw error;
    }
}

// Handle command line arguments
if (require.main === module) {
    const [title, author, isbn, year] = process.argv.slice(2);

    if (!title || !author || !isbn || !year) {
        console.error('Usage: node create.js "Title" "Author" "ISBN" "Year"');
        process.exit(1);
    }

    createRecord(title, author, isbn, year)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = createRecord; 