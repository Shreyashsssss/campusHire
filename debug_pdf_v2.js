
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
    const pdfParse = require('pdf-parse');
    console.log('Keys:', Object.keys(pdfParse));
    console.log('Default:', pdfParse.default);
} catch (e) {
    console.error(e);
}
