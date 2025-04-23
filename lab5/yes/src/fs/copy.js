const fs = require('fs').promises;
const path = require('path');

async function backupData(sourceDir, destinationDir) {
    try {
        // Create destination directory if it doesn't exist
        await fs.mkdir(destinationDir, { recursive: true });

        // Read all files from source directory
        const files = await fs.readdir(sourceDir);

        // Copy each file
        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const destPath = path.join(destinationDir, file);

            // Check if source is a file or directory
            const stats = await fs.stat(sourcePath);

            if (stats.isFile()) {
                // Copy file
                await fs.copyFile(sourcePath, destPath);
                console.log(`Copied file: ${file}`);
            } else if (stats.isDirectory()) {
                // Recursively copy directory
                await backupData(sourcePath, destPath);
                console.log(`Copied directory: ${file}`);
            }
        }

        console.log('Backup completed successfully');
    } catch (error) {
        console.error('Error during backup:', error.message);
        throw error;
    }
}

// Handle command line arguments
if (require.main === module) {
    const [sourceDir, destinationDir] = process.argv.slice(2);

    if (!sourceDir || !destinationDir) {
        console.error('Usage: node copy.js <source_directory> <destination_directory>');
        process.exit(1);
    }

    backupData(sourceDir, destinationDir)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = backupData; 