const fs = require('fs').promises;
const path = require('path');

async function renameRecord(oldFilename, newFilename) {
    try {
        const dataDir = path.join(__dirname, 'data');
        const oldPath = path.join(dataDir, oldFilename);
        const newPath = path.join(dataDir, newFilename);

        // Check if old file exists
        try {
            await fs.access(oldPath);
        } catch (error) {
            throw new Error(`File not found: ${oldFilename}`);
        }

        // Check if new filename already exists
        try {
            await fs.access(newPath);
            throw new Error(`File already exists: ${newFilename}`);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        // Rename the file
        await fs.rename(oldPath, newPath);

        // Update index file
        const indexFile = path.join(dataDir, 'book_index.json');
        try {
            const indexContent = await fs.readFile(indexFile, 'utf8');
            const indexData = JSON.parse(indexContent);

            // Update filename in index
            const recordIndex = indexData.findIndex(record => record.filename === oldFilename);
            if (recordIndex !== -1) {
                indexData[recordIndex].filename = newFilename;
                await fs.writeFile(indexFile, JSON.stringify(indexData, null, 2));
            }

            console.log(`Successfully renamed ${oldFilename} to ${newFilename}`);
        } catch (error) {
            console.warn('Warning: Could not update index file:', error.message);
        }
    } catch (error) {
        console.error('Error renaming record:', error.message);
        throw error;
    }
}

// Handle command line arguments
if (require.main === module) {
    const [oldFilename, newFilename] = process.argv.slice(2);

    if (!oldFilename || !newFilename) {
        console.error('Usage: node rename.js <old_filename> <new_filename>');
        process.exit(1);
    }

    renameRecord(oldFilename, newFilename)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = renameRecord; 