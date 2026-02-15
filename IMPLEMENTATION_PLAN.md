# IMPLEMENATION PLAN: Campus Placement System

## 1. Core Logic: Eligibility Engine
The core of this system is the `eligibilityEngine` module.
It will take two inputs:
- `StudentProfile`: { cgpa: number, branch: string, backlogs: number, skills: string[] }
- `DriveCriteria`: { minCgpa: number, allowedBranches: string[], maxBacklogs: number, requiredSkills: string[] }

It will return:
- `EligibilityResult`: { eligible: boolean, reasons: string[] }
- Reasons will be human-readable strings explaining the pass/fail condition for each criterion.

## 2. Frontend Architecture
We will use Vite + React + TypeScript.
- **State Management:** Use `Context API` for Auth and Data (Drives + Applications).
- **Styling:** CSS Modules with a global theme in `index.css`.
- **Pages:**
  - `Login`: Select role (Student/Company).
  - `StudentDashboard`:
    - `EligibleDrives`: List of drives matching criteria. show reasons.
    - `AppliedDrives`: Status tracking.
  - `CompanyDashboard`:
    - `CreateDrive`: Form to set criteria.
    - `Shortlist`: View eligible students with reasons. update status.

## 3. Data Schema (Mock)
- **Student:** `id, name, rollNo, email, profile: { cgpa, branch, backlogs, skills }`
- **Company:** `id, name, email`
- **Drive:** `id, companyId, jobTitle, description, criteria: { minCgpa, etc. }, date`
- **Application:** `id, studentId, driveId, status: 'applied' | 'shortlisted' | 'interview' | 'accepted' | 'rejected'`

## 4. UI/UX
- **Design:** Modern, clean, professional.
- **Theme:** Dark/Light mode toggle (default Dark per "premium" request).
- **Components:**
  - `Card`: Neumorphic or Glassmorphism style.
  - `Badge`: Status indicators.
  - `Button`: Primary/Secondary actions.
  - `Modal`: For details.
