export type Role = 'student' | 'company';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Student extends User {
    role: 'student';
    rollNo: string;
    cgpa: number;
    branch: string;
    backlogs: number;
    skills: string[];
    graduationYear: number;
    resume?: string; // Filename
}

export interface Company extends User {
    role: 'company';
    industry: string;
}

export interface DriveCriteria {
    minCgpa: number;
    allowedBranches: string[];
    maxBacklogs: number;
    requiredSkills: string[];
    eligibleGraduationYears?: number[];
}

export interface JobDrive {
    id: string;
    companyId: string;
    companyName: string;
    title: string;
    description: string;
    role: string;
    ctc: string;
    location: string;
    category: string; // 'Internship' | 'Job' | etc.
    criteria: DriveCriteria;
    deadline: string;
}

export interface EligibilityDetail {
    passed: boolean;
    reason: string;
}

export interface EligibilityResult {
    isEligible: boolean;
    checks: EligibilityDetail[];
}

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interviewing' | 'Selected' | 'Rejected';

export interface Application {
    id: string;
    driveId: string;
    studentId: string;
    status: ApplicationStatus;
    appliedAt: string;
    updatedAt?: string;
}
