const { spawn } = require('child_process');
const path = require('path');

function performFullTextSearch(searchTerm) {
    return new Promise((resolve, reject) => {
        // Create a worker process for full-text search
        const worker = spawn('node', [
            path.join(__dirname, 'search-worker.js'),
            searchTerm
        ]);

        let results = '';
        let errors = '';

        // Collect data from stdout
        worker.stdout.on('data', (data) => {
            results += data.toString();
        });

        // Collect data from stderr
        worker.stderr.on('data', (data) => {
            errors += data.toString();
        });

        // Handle process completion
        worker.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker process exited with code ${code}\n${errors}`));
                return;
            }

            try {
                const parsedResults = JSON.parse(results);
                resolve(parsedResults);
            } catch (error) {
                reject(new Error(`Failed to parse worker results: ${error.message}`));
            }
        });

        // Handle process errors
        worker.on('error', (error) => {
            reject(new Error(`Failed to start worker process: ${error.message}`));
        });
    });
}

// Handle command line arguments
if (require.main === module) {
    const [searchTerm] = process.argv.slice(2);

    if (!searchTerm) {
        console.error('Usage: node spawn.js <search_term>');
        process.exit(1);
    }

    performFullTextSearch(searchTerm)
        .then(results => {
            console.log('\nSearch Results:');
            console.log('===============');
            if (results.length === 0) {
                console.log('No matches found.');
            } else {
                results.forEach((result, index) => {
                    console.log(`\n${index + 1}. Book Details:`);
                    console.log(`   Title: ${result.title}`);
                    console.log(`   Author: ${result.author}`);
                    console.log(`   Year: ${result.year}`);
                });
            }
            console.log('\n===============');
            process.exit(0);
        })
        .catch(error => {
            console.error('Error:', error.message);
            process.exit(1);
        });
}

module.exports = performFullTextSearch; 