const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

function writeLargeFile(filePath, data) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath, {
            encoding: 'utf8',
            flags: 'w'
        });

        const transformStream = new Transform({
            objectMode: true,
            transform(chunk, encoding, callback) {
                try {
                    const jsonString = JSON.stringify(chunk) + '\n';
                    callback(null, jsonString);
                } catch (error) {
                    callback(error);
                }
            }
        });

        // Handle stream events
        writeStream
            .on('error', (error) => {
                console.error('Error writing to file:', error.message);
                reject(error);
            })
            .on('finish', () => {
                console.log('Finished writing to file');
                resolve();
            });

        // Pipe the data through transform stream to write stream
        transformStream.pipe(writeStream);

        // Write each item in the data array
        data.forEach(item => {
            transformStream.write(item);
        });

        // End the stream
        transformStream.end();
    });
}

// Handle command line arguments
if (require.main === module) {
    const [filePath, ...data] = process.argv.slice(2);

    if (!filePath || data.length === 0) {
        console.error('Usage: node write.js <file_path> <data1> <data2> ...');
        process.exit(1);
    }

    // Convert command line arguments to data objects
    const records = data.map(item => {
        try {
            return JSON.parse(item);
        } catch (error) {
            console.error('Invalid JSON data:', item);
            process.exit(1);
        }
    });

    writeLargeFile(filePath, records)
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = writeLargeFile; 