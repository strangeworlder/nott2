const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('NotT - Interactive Ashcan.pdf');

pdf(dataBuffer).then(function(data) {
    // number of pages
    console.log('Number of pages:', data.numpages);
    // number of rendered pages
    console.log('Number of rendered pages:', data.numrender);
    // PDF info
    console.log('PDF Info:', data.info);
    // PDF metadata
    console.log('PDF Metadata:', data.metadata); 
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log('PDF.js Version:', data.version);
    // PDF text
    fs.writeFileSync('NotT_raw.md', data.text);
    console.log('Text extracted to NotT_raw.md');
}).catch(function(error){
    console.error('Error extracting text:', error);
});
