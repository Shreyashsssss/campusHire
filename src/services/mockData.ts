import type { Student, Company, JobDrive, Application } from '../types';

export const INITIAL_STUDENTS: Student[] = [
    {
        id: 's1',
        name: 'Rahul Sharma',
        email: 'rahul@college.edu',
        role: 'student',
        rollNo: 'CSE-001',
        cgpa: 8.5,
        branch: 'CSE',
        backlogs: 0,
        skills: ['React', 'Node.js', 'Python'],
        graduationYear: 2024
    },
    {
        id: 's2',
        name: 'Priya Patel',
        email: 'priya@college.edu',
        role: 'student',
        rollNo: 'ECE-002',
        cgpa: 7.2,
        branch: 'ECE',
        backlogs: 1,
        skills: ['C++', 'Embedded Systems'],
        graduationYear: 2024
    },
    {
        id: 's3',
        name: 'Amit Singh',
        email: 'amit@college.edu',
        role: 'student',
        rollNo: 'MECH-003',
        cgpa: 6.8,
        branch: 'MECH',
        backlogs: 2,
        skills: ['AutoCAD', 'SolidWorks'],
        graduationYear: 2025
    }
];

export const INITIAL_COMPANIES: Company[] = [
    {
        id: 'c1',
        name: 'TechCorp Solutions',
        email: 'careers@techcorp.com',
        role: 'company',
        industry: 'Software'
    },
    {
        id: 'c2',
        name: 'BuildWell Construction',
        email: 'hr@buildwell.com',
        role: 'company',
        industry: 'Civil Engineering'
    }
];

// Mock Drives
export const mockDrives: JobDrive[] = [
    {
        id: 'd1',
        companyId: 'c1',
        companyName: 'TechCorp Solutions',
        title: 'Software Engineer',
        description: 'Join our dynamic team...',
        role: 'SDE-I',
        ctc: '12 LPA',
        location: 'Bangalore',
        category: 'Job',
        criteria: {
            minCgpa: 7.5,
            allowedBranches: ['CSE', 'IT', 'ECE'],
            maxBacklogs: 0,
            requiredSkills: ['React', 'Node.js'],
            eligibleGraduationYears: [2024]
        },
        deadline: '2023-12-31'
    },
    {
        id: 'd2',
        companyId: 'c2',
        companyName: 'DataMinds',
        title: 'Data Analyst',
        description: 'Analyze data...',
        role: 'Analyst',
        ctc: '8 LPA',
        location: 'Pune',
        category: 'Internship',
        criteria: {
            minCgpa: 7.0,
            allowedBranches: ['CSE', 'IT'],
            maxBacklogs: 1,
            requiredSkills: [],
            eligibleGraduationYears: [2024]
        },
        deadline: '2023-11-30'
    },
    {
        id: 'd3',
        companyId: 'c3',
        companyName: 'InnovateTech',
        title: 'Product Manager',
        description: 'Product role...',
        role: 'PM',
        ctc: '15 LPA',
        location: 'Mumbai',
        category: 'Job',
        criteria: {
            minCgpa: 6.0,
            allowedBranches: ['CSE', 'IT', 'ECE'],
            maxBacklogs: 2,
            requiredSkills: ['Communication'],
            eligibleGraduationYears: [2024]
        },
        deadline: '2023-10-15'
    }
];

export const INITIAL_APPLICATIONS: Application[] = [
    {
        id: 'app-1',
        driveId: 'd1',
        studentId: 's1', // Rahul applied to TechCorp
        status: 'Shortlisted',
        appliedAt: '2023-11-01'
    }
];
