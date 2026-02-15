
import sqlite3 from 'sqlite3';
try {
    const s = sqlite3.verbose();
    const db = new s.Database(':memory:');
    console.log('Success');
} catch (e) {
    console.error(e);
}
