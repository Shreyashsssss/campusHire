
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
    const pdfParse = require('pdf-parse');
    console.log('Type of pdfParse:', typeof pdfParse);
    console.log('Is pdfParse a function?', typeof pdfParse === 'function');
    console.log('pdfParse keys:', Object.keys(pdfParse));
    console.log('pdfParse exports:', pdfParse);
} catch (e) {
    console.error('Error requiring pdf-parse:', e);
}
