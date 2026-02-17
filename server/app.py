import sqlite3
import os
import json
from flask import Flask, request, jsonify, g
from datetime import datetime
from werkzeug.utils import secure_filename

from flask_cors import CORS

app = Flask(__name__)
CORS(app)
DATABASE = os.path.join(os.path.dirname(__file__), 'placement_portal.db')
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads/resumes')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Gemini AI Integration ---
require_dotenv = True
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    require_dotenv = False

import google.generativeai as genai

genAI = None
if os.getenv('GEMINI_API_KEY'):
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    genAI = genai.GenerativeModel('gemini-pro')

# --- Database Helpers ---
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row 
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        
        # User Table (Added resume field)
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT,
            rollNo TEXT,
            cgpa REAL,
            branch TEXT,
            backlogs INTEGER,
            skills TEXT,
            graduationYear INTEGER,
            resume TEXT,
            industry TEXT
        )''')
        
        # Drives Table (Added category field)
        cursor.execute('''CREATE TABLE IF NOT EXISTS drives (
            id TEXT PRIMARY KEY,
            companyId TEXT,
            companyName TEXT,
            title TEXT,
            description TEXT,
            role TEXT,
            ctc TEXT,
            location TEXT,
            criteria TEXT,
            category TEXT,
            deadline TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )''')
        
        cursor.execute('''CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            driveId TEXT,
            studentId TEXT,
            status TEXT,
            appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(driveId) REFERENCES drives(id),
            FOREIGN KEY(studentId) REFERENCES users(id)
        )''')
        db.commit()
        seed_data()

def seed_data():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT count(*) as count FROM users")
    if cursor.fetchone()['count'] == 0:
        print("Seeding rich initial data...")
        
        # Users
        users = [
            ('s1', 'Rahul Sharma', 'rahul@college.edu', 'pass', 'student', 'CSE-001', 8.5, 'CSE', 0, json.dumps(['React', 'Node.js', 'Python', 'SQL']), 2024, None, None),
            ('s2', 'Priya Patel', 'priya@college.edu', 'pass', 'student', 'ECE-002', 7.2, 'ECE', 1, json.dumps(['C++', 'Embedded Systems', 'IoT']), 2024, None, None),
            ('c1', 'TechCorp Solutions', 'careers@techcorp.com', 'pass', 'company', None, None, None, None, None, None, None, 'Software')
        ]
        cursor.executemany("INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", users)
        
        # Drives (Varied Categories)
        drives = [
            # Internships
            ('d1', 'c1', 'TechCorp Solutions', 'SDE Intern', 'Summer Internship for Full Stack Roles. Work on real-world projects.', 'Software Developer', '₹40,000/mo', 'Bangalore', 
             json.dumps({'minCgpa': 7.5, 'allowedBranches': ['CSE', 'IT', 'ECE'], 'maxBacklogs': 0, 'requiredSkills': ['React', 'Node.js'], 'eligibleGraduationYears': [2024, 2025]}), 
             'Internship', '2024-05-30', datetime.now()),
             
            ('d2', 'c1', 'DataMinds Analytics', 'Data Science Intern', 'Analyze large datasets and build ML models.', 'Data Analyst', '₹35,000/mo', 'Remote', 
             json.dumps({'minCgpa': 7.0, 'allowedBranches': ['CSE', 'IT', 'Mathematics'], 'maxBacklogs': 1, 'requiredSkills': ['Python', 'SQL', 'Pandas'], 'eligibleGraduationYears': [2024, 2025]}), 
             'Internship', '2024-06-15', datetime.now()),

            # Jobs
            ('d3', 'c1', 'CloudSystems Inc', 'Graduate Engineer Trainee', 'Entry level position for cloud infrastructure.', 'Cloud Engineer', '8 LPA', 'Hyderabad', 
             json.dumps({'minCgpa': 6.5, 'allowedBranches': ['CSE', 'IT', 'ECE'], 'maxBacklogs': 0, 'requiredSkills': ['AWS', 'Linux'], 'eligibleGraduationYears': [2023, 2024]}), 
             'Job', '2024-04-20', datetime.now()),

            # Competitions
            ('d4', 'c1', 'CodeMasters Global', 'Hackathon 2024', '48-hour coding marathon. Win prizes up to ₹1 Lakh.', 'Participant', '₹1 Lakh Prize', 'Online', 
             json.dumps({'minCgpa': 0, 'allowedBranches': ['All'], 'maxBacklogs': 10, 'requiredSkills': ['Coding', 'Problem Solving'], 'eligibleGraduationYears': [2023, 2024, 2025, 2026]}), 
             'Competition', '2024-03-10', datetime.now()),

            # Mentorship
            ('d5', 'c1', 'Alumni Network', 'Career Guidance Session', '1-on-1 mentorship with industry experts from Google & Microsoft.', 'Mentee', 'Free', 'Online', 
             json.dumps({'minCgpa': 0, 'allowedBranches': ['All'], 'maxBacklogs': 10, 'requiredSkills': ['Communication'], 'eligibleGraduationYears': [2024, 2025]}), 
             'Mentorship', '2024-03-01', datetime.now()),

            # Mock Tests
            ('d6', 'c1', 'PrepLeaf', 'Aptitude Mock Series', 'Full length aptitude and technical mock tests for placement prep.', 'Student', 'Free', 'Online', 
             json.dumps({'minCgpa': 0, 'allowedBranches': ['All'], 'maxBacklogs': 10, 'requiredSkills': ['Aptitude'], 'eligibleGraduationYears': [2024, 2025]}), 
             'Mock Test', '2024-12-31', datetime.now())
        ]
        cursor.executemany("INSERT INTO drives VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", drives)
        db.commit()
        print("Seeding complete.")

# --- API Routes ---

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    role = data.get('role')
    
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE email = ? AND role = ?", (email, role)).fetchone()
    
    if user:
        user_dict = dict(user)
        if user_dict['skills']:
            user_dict['skills'] = json.loads(user_dict['skills'])
        del user_dict['password']
        return jsonify({'token': 'mock-jwt-token', 'user': user_dict})
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    # ... (Keep existing implementation logic but ensure resume field is handled if added later) ...
    # Simplified for brevity as registration flow is standard
    data = request.json
    try:
        id = f"s-{int(datetime.now().timestamp())}"
        skills_json = json.dumps(data.get('skills', []))
        
        db = get_db()
        db.execute("INSERT INTO users (id, name, email, password, role, rollNo, cgpa, branch, backlogs, skills, graduationYear, resume) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                   (id, data['name'], data['email'], 'pass', data['role'], 'NEW-001', data['cgpa'], 'CSE', 0, skills_json, data['graduationYear'], None))
        db.commit()
        
        new_user = data.copy()
        new_user['id'] = id
        return jsonify({'token': 'mock-jwt-token', 'user': new_user}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/drives', methods=['GET'])
def get_drives():
    db = get_db()
    rows = db.execute("SELECT * FROM drives").fetchall()
    drives = []
    for row in rows:
        d = dict(row)
        d['criteria'] = json.loads(d['criteria'])
        drives.append(d)
    return jsonify(drives)

@app.route('/api/applications', methods=['GET', 'POST'])
def applications():
    db = get_db()
    if request.method == 'GET':
        student_id = request.args.get('studentId')
        rows = db.execute("SELECT * FROM applications WHERE studentId = ?", (student_id,)).fetchall()
        return jsonify([dict(row) for row in rows])
        
    if request.method == 'POST':
        data = request.json
        id = f"app-{int(datetime.now().timestamp())}"
        db.execute("INSERT INTO applications (id, driveId, studentId, status, appliedAt) VALUES (?,?,?,?,?)",
                   (id, data['driveId'], data['studentId'], 'Applied', datetime.now().isoformat()))
        db.commit()
        return jsonify({'id': id, 'status': 'Applied'}), 201

@app.route('/api/upload/resume', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['resume']
    student_id = request.form.get('studentId')
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file and student_id:
        filename = secure_filename(f"{student_id}_{file.filename}")
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        
        # Update DB
        db = get_db()
        db.execute("UPDATE users SET resume = ? WHERE id = ?", (filename, student_id))
        db.commit()
        
        return jsonify({'message': 'Resume uploaded successfully', 'filename': filename}), 200
    
    return jsonify({'error': 'Upload failed'}), 500

@app.route('/api/gemini/analyze', methods=['POST'])
def analyze_profile():
    if not genAI:
        return jsonify({'error': 'Gemini API not configured'}), 500
        
    try:
        data = request.json
        profile_text = f"Student Profile: CGPA {data['cgpa']}, Branch {data['branch']}, Skills: {', '.join(data['skills'])}."
        prompt = f"""
        Act as a Career Counselor. Analyze this student profile:
        {profile_text}
        
        Provide a structured response in markdown with:
        1. **Profile Strength**: (Weak/Moderate/Strong)
        2. **Skill Gaps**: What key skills are missing for a Full Stack Developer role?
        3. **Recommended Certifications**: List 2-3 specific certs.
        4. **Action Plan**: 3 steps to improve employability in next 3 months.
        Keep it concise.
        """
        
        response = genAI.generate_content(prompt)
        return jsonify({'analysis': response.text})
    except Exception as e:
        print(f"AI Error: {e}")
        return jsonify({'error': 'AI Analysis failed'}), 500

if __name__ == '__main__':
    if not os.path.exists(DATABASE):
        init_db()
    else:
        # For development, we might want to re-seed if schema changes?
        # But for now, we rely on manual deletion of DB file to trigger re-init
        pass
        
    print("Starting Flask server on http://localhost:5002")
    app.run(port=5002, debug=True)
