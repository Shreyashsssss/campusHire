# Campus Placement System

A premium, role-based placement management system built with React, TypeScript, and Vite.

## Features

### For Students
- **Smart Dashboard:** View all active placement drives.
- **Automated Eligibility Check:** Instantly see if you are eligible for a drive.
- **Explainable AI:** Understand *exactly* why you are eligible (or not) with detailed breakdowns (e.g., "CGPA 8.5 ≥ 7.0 ✓").
- **Application Tracking:** Monitor the status of your applications (Applied -> Shortlisted -> Selected).

### For Companies
- **Drive Management:** Create new placement drives with specific criteria (CGPA, Backlogs, Branch, Skills).
- **Applicant Review:** View all students who applied.
- **Decision Support:** See detailed eligibility reports for every applicant to make informed shortlisting decisions.
- **Status Updates:** Shortlist or Reject candidates with a single click.

## Tech Stack
- **Frontend:** React + TypeScript + Vite
- **Styling:** Vanilla CSS (Premium Dark Theme)
- **State:** Local State (Mock Data for Demo)

## Usage
1. **Login:** Choose "Student" or "Company" portal.
2. **Student Flow:** 
   - Check "Available Drives".
   - Click "Why?" to see eligibility details.
   - Apply if eligible.
3. **Company Flow:**
   - "Create Drive" to post a new job.
   - Scroll down to "Active Drives" to see applicants.
   - Click "Shortlist" or "Reject".

## Run Locally
```bash
npm install
npm run dev
```
