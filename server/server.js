import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import db from './database.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
const PORT = process.env.PORT || 5000;

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
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_API_KEY";
let genAI = null;

try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
} catch (err) {
    console.error('Failed to initialize Gemini AI:', err.message);
}

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
    } else if (type === 'validate-resume') {
        userPrompt = `
        Determine if this is a valid resume/CV:
        "${content.substring(0, 10000)}"

        Return a STRICT JSON object with ONLY these fields (no other text):
        {
            "isResume": boolean, // true if this is a valid resume, false otherwise
            "reason": "string" // Brief explanation if not a resume
        }

        A valid resume should contain: name, contact info, work experience/education, and skills. If the document does NOT contain these elements, return isResume: false.
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
        if (!genAI) {
            throw new Error('Gemini AI not initialized');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        let content = response.text() || "{}";

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

// ATS Resume Scoring Endpoint (validates if it's a resume, then scores it)
app.post('/api/analyze/resume-ats', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        let resumeText = "";

        // Extract text from PDF
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            resumeText = data.text;
        } else {
            // Fallback for text files
            resumeText = fs.readFileSync(filePath, 'utf8');
        }

        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ 
                error: 'it is not resume try again',
                isResume: false 
            });
        }

        // Simple resume validation using keyword detection
        console.log("Validating if file is a resume:", req.file.filename);
        
        const resumeKeywords = [
            'experience', 'education', 'skill', 'email', 'phone', 'contact',
            'work', 'project', 'employment', 'degree', 'certificate',
            'responsibility', 'objective', 'summary', 'linkedin', 'github'
        ];
        
        const textLower = resumeText.toLowerCase();
        const keywordMatches = resumeKeywords.filter(keyword => 
            textLower.includes(keyword)
        ).length;

        // If less than 3 keyword matches, it's probably not a resume
        if (keywordMatches < 3) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ 
                error: 'it is not resume try again',
                isResume: false,
                reason: 'Resume does not contain typical resume keywords'
            });
        }

        // Calculate ATS Score based on content analysis
        console.log("Resume validated. Calculating ATS score...");
        
        let atsScore = 50; // Base score
        let technicalScore = 50;
        let communicationScore = 50;
        let aptitudeScore = 50;
        
        // Bonus points for technical keywords
        const technicalKeywords = ['python', 'java', 'javascript', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'c++', 'c#', 'typescript', 'api', 'database', 'git'];
        const techCount = technicalKeywords.filter(tech => textLower.includes(tech)).length;
        technicalScore = Math.min(100, 50 + (techCount * 5));

        // Bonus points for communication skills
        const commKeywords = ['leadership', 'management', 'communication', 'presentation', 'team', 'collaboration', 'presentation'];
        const commCount = commKeywords.filter(comm => textLower.includes(comm)).length;
        communicationScore = Math.min(100, 50 + (commCount * 5));

        // Bonus points for problem solving
        const aptitudeKeywords = ['project', 'solution', 'algorithm', 'optimization', 'improvement', 'troubleshooting', 'problem-solving', 'analysis'];
        const aptCount = aptitudeKeywords.filter(apt => textLower.includes(apt)).length;
        aptitudeScore = Math.min(100, 50 + (aptCount * 5));

        // Final ATS score is average of all metrics
        atsScore = Math.round((technicalScore + communicationScore + aptitudeScore) / 3);

        // Bonus/penalty based on resume length
        if (resumeText.length > 5000) {
            atsScore = Math.min(100, atsScore + 10);
        } else if (resumeText.length < 500) {
            atsScore = Math.max(0, atsScore - 15);
        }

        // Generate a simple analysis
        const analysis = `## Resume Analysis

### Strengths Detected:
- Keywords found: ${keywordMatches} resume-related terms
- Technical skills mentioned: ${techCount}
- Communication skills highlighted: ${commCount}
- Problem-solving indicators: ${aptCount}

### Areas for Improvement:
${techCount < 5 ? '- Consider adding more technical skills and tools used\n' : ''}${commCount < 3 ? '- Highlight leadership and team collaboration experience\n' : ''}${resumeText.length < 1000 ? '- Expand your resume with more accomplishments and details\n' : ''}

### Recommendations:
1. Ensure all contact information is clearly visible
2. Quantify achievements with metrics and numbers
3. Use action verbs at the beginning of bullet points
4. Include relevant keywords for your industry
5. Keep your resume to 1-2 pages for entry-level positions`;

        fs.unlinkSync(filePath);

        res.json({
            message: 'Resume analyzed successfully',
            filename: req.file.filename,
            isResume: true,
            atsScore: atsScore,
            analysis: analysis,
            profileScore: atsScore,
            performance: {
                technical: technicalScore,
                communication: communicationScore,
                aptitude: aptitudeScore
            }
        });

    } catch (error) {
        console.error('ATS Scoring Error:', error);
        res.status(500).json({ 
            error: 'Failed to process resume', 
            details: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
