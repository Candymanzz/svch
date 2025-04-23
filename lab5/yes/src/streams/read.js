const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

function readLargeFile(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const transformStream = new Transform({
            objectMode: true,
            transform(chunk, encoding, callback) {
                try {
                    const data = JSON.parse(chunk.toString());
                    results.push(data);
                    callback(null, data);
                } catch (error) {
                    callback(error);
                }
            }
        });

        const readStream = fs.createReadStream(filePath, {
            encoding: 'utf8',
            highWaterMark: 1024 // Read 1KB at a time
        });

        readStream
            .on('error', (error) => {
                console.error('Error reading file:', error.message);
                reject(error);
            })
            .on('data', (chunk) => {
                // Process each chunk
                console.log('Processing chunk...');
            })
            .on('end', () => {
                console.log('Finished reading file');
                resolve(results);
            })
            .pipe(transformStream);
    });
}

// Handle command line arguments
if (require.main === module) {
    const [filePath] = process.argv.slice(2);

    if (!filePath) {
        console.error('Usage: node read.js <file_path>');
        process.exit(1);
    }

    readLargeFile(filePath)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = readLargeFile; 