# Project Structure & Implementation Details

## 1. Directory Structure

```
tgpcet/
├── public/                 # Static assets
├── server/                 # Backend (Node.js + Express + SQLite)
│   ├── database.js         # SQLite database configuration & schema
│   └── server.js           # API endpoints (Auth, Drives, Applications)
├── src/                    # Frontend (React + TypeScript)
│   ├── auth/               # Authentication components
│   │   └── Login.tsx       # Login & Registration forms
│   ├── components/         # Reusable UI components
│   │   ├── ApplicantList.tsx # List of applicants (for Company)
│   │   ├── CreateDrive.tsx   # Form to create new drives (for Company)
│   │   ├── DriveCard.tsx     # Drive display card with Apply button
│   │   └── Navbar.tsx        # Responsive navigation bar
│   ├── context/            # Global state management
│   │   └── AuthContext.tsx   # Authentication provider (User session)
│   ├── pages/              # Main application pages
│   │   ├── Applications.tsx  # "My Applications" tracker
│   │   └── Dashboard.tsx     # Student Dashboard (Drive listing)
│   ├── services/           # API integration
│   │   └── api.ts            # Centralized API service (fetches data from backend)
│   ├── types/              # TypeScript interfaces
│   │   └── index.ts          # Shared types (User, Student, JobDrive, Application)
│   ├── utils/              # Helper functions
│   │   └── eligibility.ts    # Core eligibility check logic
│   ├── App.tsx             # Main App component with Routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles (Tailwind CSS imports)
├── package.json            # Dependencies & Scripts
├── postcss.config.js       # PostCSS configuration (Tailwind v4)
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration (Proxy setup)
```

## 2. Technology Stack

-   **Frontend**: React.js, TypeScript, Tailwind CSS, Lucide Icons, Vite.
-   **State Management**: React Context API (`AuthContext`).
-   **Backend**: Node.js, Express.js.
-   **Database**: SQLite (`placement_portal.db`).
-   **API Integration**: REST API with Proxy (`/api` -> `http://localhost:5000`).

## 3. Core Logic: Eligibility Check

The eligibility engine resides in `src/utils/eligibility.ts`. It performs rigorous checks against a student's profile and a drive's criteria:

```typescript
export const checkEligibility = (student: Student, criteria: DriveCriteria): EligibilityResult => {
    const checks: EligibilityDetail[] = [];

    // 1. CGPA Check
    // If student.cgpa >= criteria.minCgpa -> PASSED
    
    // 2. Backlogs Check
    // If student.backlogs <= criteria.maxBacklogs -> PASSED

    // 3. Branch Check
    // If criteria.allowedBranches includes student.branch -> PASSED

    // 4. Graduation Year Check
    // If criteria.eligibleGraduationYears includes student.graduationYear -> PASSED

    const isEligible = checks.every(check => check.passed);
    return { isEligible, checks };
};
```

This logic is used in `DriveCard.tsx` to dynamically show/hide the "Apply Now" button and explain reasons for ineligibility.

## 4. Key Components

### Dashboard (`src/pages/Dashboard.tsx`)
-   Fetches list of active drives from the backend (`GET /api/drives`).
-   Fetches user's existing applications to prevent duplicate applications.
-   Renders a grid of `DriveCard` components.
-   Handles "Apply" actions via `api.apply()`.
-   Includes search and filtering.

### Application Tracker (`src/pages/Applications.tsx`)
-   Fetches user's application history (`GET /api/applications?studentId=...`).
-   Joins application data with drive details (Company Name, Role, CTC).
-   Displays status with color-coded tags and icons:
    -   **Applied**: Blue + Clock icon
    -   **Shortlisted**: Amber + CheckCircle icon
    -   **Selected**: Green + CheckCircle icon
    -   **Rejected**: Red + XCircle icon
-   Responsive list layout suitable for mobile and desktop.

## 5. Usage

1.  **Start the Full Stack App**:
    ```bash
    npm run dev
    ```
    (Runs both frontend at `localhost:5173` and backend at `localhost:5000`)

2.  **Access**: Open `http://localhost:5173`.
3.  **Login**:
    -   Student: `rahul@college.edu` / `pass`
    -   Company: `careers@techcorp.com` / `pass`
