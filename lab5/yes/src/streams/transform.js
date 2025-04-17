const { Transform } = require('stream');

class BookTransformStream extends Transform {
    constructor(options = {}) {
        super({ objectMode: true, ...options });
    }

    _transform(chunk, encoding, callback) {
        try {
            // Transform the book data
            const transformedData = {
                ...chunk,
                // Add additional fields or modify existing ones
                processedAt: new Date().toISOString(),
                // Example: Convert title to uppercase
                title: chunk.title.toUpperCase(),
                // Example: Add a formatted display name
                displayName: `${chunk.title} by ${chunk.author} (${chunk.year})`
            };

            callback(null, transformedData);
        } catch (error) {
            callback(error);
        }
    }
}

function transformData(inputStream, outputStream) {
    const transformStream = new BookTransformStream();

    return new Promise((resolve, reject) => {
        inputStream
            .pipe(transformStream)
            .pipe(outputStream)
            .on('error', (error) => {
                console.error('Error during transformation:', error.message);
                reject(error);
            })
            .on('finish', () => {
                console.log('Transformation completed');
                resolve();
            });
    });
}

// Handle stdin/stdout for command line usage
if (require.main === module) {
    const transformStream = new BookTransformStream();

    process.stdin
        .pipe(transformStream)
        .pipe(process.stdout)
        .on('error', (error) => {
            console.error('Error:', error.message);
            process.exit(1);
        });
}

module.exports = {
    BookTransformStream,
    transformData
}; 