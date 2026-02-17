import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import db from './database.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `resume-${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- Authentication ---

// Login Endpoint
app.post('/api/auth/login', (req, res) => {
    const { email, role } = req.body;
    // Simple mock logic: Accept any password, check if email exists for role
    db.get("SELECT * FROM users WHERE email = ? AND role = ?", [email, role], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid credentials or user not found.' });

        // Simple password check (plaintext)
        // In production, use bcrypt/argon2
        const { password } = req.body;
        if (password && user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Parse JSON fields
        if (user.skills) user.skills = JSON.parse(user.skills);

        // Remove sensitive data
        delete user.password;

        res.json({ token: 'mock-jwt-token', user });
    });
});

// Register Endpoint (for students)
app.post('/api/auth/register', (req, res) => {
    const { name, email, role, cgpa, graduationYear, skills } = req.body;
    const id = `s-${Date.now()}`;
    const skillsJson = JSON.stringify(skills || []);

    // Default values for simplicity
    const rollNo = `NEW-${Math.floor(Math.random() * 1000)}`;
    const branch = 'CSE'; // Default
    const backlogs = 0;
    const password = 'pass';

    const sql = `INSERT INTO users (id, name, email, password, role, rollNo, cgpa, branch, backlogs, skills, graduationYear) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [id, name, email, password, role, rollNo, cgpa, branch, backlogs, skillsJson, graduationYear];

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });

        // Return the created user
        const newUser = { id, name, email, role, rollNo, cgpa, branch, backlogs, skills, graduationYear };
        res.status(201).json({ token: 'mock-jwt-token', user: newUser });
    });
});

// --- Drives ---

// Get All Drives
app.get('/api/drives', (req, res) => {
    db.all("SELECT * FROM drives", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse criteria JSON
        const drives = rows.map(row => ({
            ...row,
            criteria: JSON.parse(row.criteria)
        }));
        res.json(drives);
    });
});

// Create Drive (Company only - Logic simplified)
app.post('/api/drives', (req, res) => {
    // Implementation for creating drives...
    res.status(501).json({ message: "Not implemented yet" });
});

// --- Applications ---

// Get User Applications
app.get('/api/applications', (req, res) => {
    const studentId = req.query.studentId;
    if (!studentId) return res.status(400).json({ error: "Missing studentId query parameter" });

    db.all("SELECT * FROM applications WHERE studentId = ?", [studentId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Apply for a Drive
app.post('/api/applications', (req, res) => {
    const { driveId, studentId } = req.body;
    const id = `app-${Date.now()}`;
    const status = 'Applied';
    const appliedAt = new Date().toISOString();

    const sql = "INSERT INTO applications (id, driveId, studentId, status, appliedAt) VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [id, driveId, studentId, status, appliedAt], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id, driveId, studentId, status, appliedAt });
    });
});


// --- Gemini AI Integration ---
// --- Sambanova AI Integration ---
const SAMBANOVA_API_KEY = process.env.SAMBANOVA_API_KEY || "YOUR_API_KEY";
const SAMBANOVA_API_URL = "https://api.sambanova.ai/v1/chat/completions";

// --- AI Analysis Helper ---
async function analyzeWithAI(content, type = 'profile') {
    const systemPrompt = "You are an expert Career Counselor and AI Resume Analyzer. You MUST respond with valid JSON only. No markdown formatting.";
    let userPrompt = "";

    if (type === 'resume') {
        userPrompt = `
        Analyze this resume content:
        "${content.substring(0, 15000)}"

        Return a STRICT JSON object with the following structure (no other text):
        {
            "profileScore": number, // 0-100 Overall strength
            "performance": {
                "technical": number, // 0-100 based on technical skills quality
                "aptitude": number,  // 0-100 estimated problem solving/logic
                "communication": number // 0-100 based on clarity and formatting
            },
            "analysis": "markdown string" // The detailed advice
        }

        Content for "analysis" field (Markdown):
        1. **Profile Summary**: Brief assessment.
        2. **Key Skills Identified**: Technical & Soft skills.
        3. **Improvement Skills**: 3-5 high-value skills to add.
        4. **Detailed Action Plan**: Learning paths & job search strategy.
        5. **Resume Feedback**: Specific formatting/Content improvements.
        `;
    } else {
        // Default profile analysis
        userPrompt = `
        Analyze this student profile:
        ${content}
        
        Return a STRICT JSON object:
        {
            "profileScore": number, // 0-100
            "performance": { "technical": number, "aptitude": number, "communication": number },
            "analysis": "markdown string"
        }

        Content for "analysis" field (Markdown):
        1. Profile Strength
        2. Skill Gaps
        3. Recommended Certifications
        4. Action Plan
        `;
    }

    try {
        const response = await fetch(SAMBANOVA_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SAMBANOVA_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "Meta-Llama-3.1-8B-Instruct",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.2, // Lower temperature for more consistent JSON
                top_p: 0.95
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        let content = result.choices[0]?.message?.content || "{}";

        // Clean potential markdown fencing often added by LLMs
        content = content.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            return JSON.parse(content);
        } catch (e) {
            console.error("Failed to parse AI JSON:", content);
            return {
                profileScore: 50,
                performance: { technical: 50, aptitude: 50, communication: 50 },
                analysis: content // Fallback to raw text if parsing fails
            };
        }
    } catch (error) {
        console.error('AI Service Error:', error);
        throw error;
    }
}

app.post('/api/gemini/analyze', async (req, res) => {
    try {
        const data = req.body;
        const profileText = `Student Profile: CGPA ${data.cgpa || 'N/A'}, Branch ${data.branch || 'N/A'}, Skills: ${(data.skills || []).join(', ')}.`;
        const analysisData = await analyzeWithAI(profileText, 'profile');
        res.json({ analysis: analysisData.analysis });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate analysis' });
    }
});

// Resume Upload & Analysis Endpoint
app.post('/api/upload/resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const studentId = req.body.studentId;
        const filePath = req.file.path;
        let resumeText = "";

        // Read Parsing
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            resumeText = data.text;
        } else {
            // Fallback for text files
            resumeText = fs.readFileSync(filePath, 'utf8');
        }

        // Generate Analysis
        console.log("Analyzing resume for student:", studentId);
        const analysisData = await analyzeWithAI(resumeText, 'resume');

        // Update DB with filename (optional, if you want to persist the file link)
        if (studentId) {
            db.run("UPDATE users SET resume = ? WHERE id = ?", [req.file.filename, studentId], (err) => {
                if (err) console.error("DB Update Error:", err);
            });
        }

        // Clean up 
        // fs.unlinkSync(filePath); // Keep file for now, or uncomment to delete

        res.json({
            message: 'Resume analyzed successfully',
            filename: req.file.filename,
            analysis: analysisData.analysis,
            profileScore: analysisData.profileScore,
            performance: analysisData.performance
        });

    } catch (error) {
        console.error('Resume Upload Error:', error);
        res.status(500).json({ error: 'Failed to process resume', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
