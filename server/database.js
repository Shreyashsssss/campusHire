import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { verbose } = sqlite3;
const s3 = verbose();

const dbPath = path.resolve(__dirname, 'placement_portal.db');
const db = new s3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT,
            rollNo TEXT,
            cgpa REAL,
            branch TEXT,
            backlogs INTEGER,
            skills TEXT, -- JSON string
            graduationYear INTEGER,
            industry TEXT
        )`);

        // Job Drives Table
        db.run(`CREATE TABLE IF NOT EXISTS drives (
            id TEXT PRIMARY KEY,
            companyId TEXT,
            companyName TEXT,
            title TEXT,
            description TEXT,
            role TEXT,
            ctc TEXT,
            location TEXT,
            criteria TEXT, -- JSON string
            deadline TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Applications Table
        db.run(`CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            driveId TEXT,
            studentId TEXT,
            status TEXT,
            appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(driveId) REFERENCES drives(id),
            FOREIGN KEY(studentId) REFERENCES users(id)
        )`);

        // Seed Data if tables are empty
        seedData();
    });
}

function seedData() {
    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (err) return console.error(err.message);
        if (row.count === 0) {
            console.log("Seeding initial data...");

            // Seed Users (Students)
            const students = [
                ['s1', 'Rahul Sharma', 'rahul@college.edu', 'pass', 'student', 'CSE-001', 8.5, 'CSE', 0, JSON.stringify(['React', 'Node.js', 'Python']), 2024, null],
                ['s2', 'Priya Patel', 'priya@college.edu', 'pass', 'student', 'ECE-002', 7.2, 'ECE', 1, JSON.stringify(['C++', 'Embedded Systems']), 2024, null],
                ['s3', 'Amit Singh', 'amit@college.edu', 'pass', 'student', 'MECH-003', 6.8, 'MECH', 2, JSON.stringify(['AutoCAD', 'SolidWorks']), 2025, null]
            ];
            const stmtUser = db.prepare("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            students.forEach(s => stmtUser.run(s));

            // Seed Companies (as users)
            const companies = [
                ['c1', 'TechCorp Solutions', 'careers@techcorp.com', 'pass', 'company', null, null, null, null, null, null, 'Software'],
                ['c2', 'BuildWell Construction', 'hr@buildwell.com', 'pass', 'company', null, null, null, null, null, null, 'Civil Engineering']
            ];
            companies.forEach(c => stmtUser.run(c));
            stmtUser.finalize();

            // Seed Drives
            const drives = [
                ['d1', 'c1', 'TechCorp Solutions', 'Software Engineer', 'Full-stack role.', 'SDE-I', '12 LPA', 'Bangalore', JSON.stringify({ minCgpa: 7.5, allowedBranches: ['CSE', 'IT', 'ECE'], maxBacklogs: 0, requiredSkills: ['React', 'Node.js'], eligibleGraduationYears: [2024, 2025] }), '2023-12-31'],
                ['d2', 'c2', 'BuildWell Construction', 'Site Engineer', 'On-site supervision.', 'Junior Engineer', '6 LPA', 'Mumbai', JSON.stringify({ minCgpa: 6.0, allowedBranches: ['CIVIL', 'MECH'], maxBacklogs: 2, requiredSkills: [], eligibleGraduationYears: [2024] }), '2023-11-30'],
                ['d3', 'c3', 'Innovate AI', 'Data Scientist Intern', 'ML/AI Internship.', 'Intern', '30k / Month', 'Remote', JSON.stringify({ minCgpa: 8.0, allowedBranches: ['CSE', 'IT', 'AI'], maxBacklogs: 0, requiredSkills: ['Python', 'TensorFlow'], eligibleGraduationYears: [2025, 2026] }), '2024-03-31']
            ];
            const stmtDrive = db.prepare("INSERT INTO drives (id, companyId, companyName, title, description, role, ctc, location, criteria, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            drives.forEach(d => stmtDrive.run(d));
            stmtDrive.finalize();

            // Seed Applications
            const apps = [
                ['app-1', 'd1', 's1', 'Shortlisted', '2023-11-01']
            ];
            const stmtApp = db.prepare("INSERT INTO applications (id, driveId, studentId, status, appliedAt) VALUES (?, ?, ?, ?, ?)");
            apps.forEach(a => stmtApp.run(a));
            stmtApp.finalize();

            console.log("Seeding complete.");
        }
    });
}

export default db;
