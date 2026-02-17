import type { Student, Application, JobDrive } from '../types';

export const mockStudents: Student[] = [
    {
        id: 's1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'student',
        rollNo: 'CS101',
        cgpa: 9.2,
        branch: 'CSE',
        backlogs: 0,
        skills: ['React', 'Node.js', 'Python', 'Java'],
        graduationYear: 2024
    },
    {
        id: 's2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'student',
        rollNo: 'IT102',
        cgpa: 7.5,
        branch: 'IT',
        backlogs: 1,
        skills: ['HTML', 'CSS', 'JavaScript'],
        graduationYear: 2024
    },
    {
        id: 's3',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'student',
        rollNo: 'ECE103',
        cgpa: 8.0,
        branch: 'ECE',
        backlogs: 0,
        skills: ['C++', 'Embedded Systems', 'Python'],
        graduationYear: 2024
    },
    {
        id: 's4',
        name: 'David Lee',
        email: 'david@example.com',
        role: 'student',
        rollNo: 'CS104',
        cgpa: 6.8,
        branch: 'CSE',
        backlogs: 2,
        skills: ['Java', 'Spring Boot'],
        graduationYear: 2025
    },
    {
        id: 's5',
        name: 'Eva Green',
        email: 'eva@example.com',
        role: 'student',
        rollNo: 'IT105',
        cgpa: 8.9,
        branch: 'IT',
        backlogs: 0,
        skills: ['React', 'TypeScript', 'AWS'],
        graduationYear: 2024
    },
    {
        id: 's6',
        name: 'Frank White',
        email: 'frank@example.com',
        role: 'student',
        rollNo: 'MECH106',
        cgpa: 7.2,
        branch: 'MECH',
        backlogs: 0,
        skills: ['AutoCAD', 'SolidWorks'],
        graduationYear: 2024
    },
    {
        id: 's7',
        name: 'Grace Hopper',
        email: 'grace@example.com',
        role: 'student',
        rollNo: 'CS107',
        cgpa: 9.8,
        branch: 'CSE',
        backlogs: 0,
        skills: ['COBOL', 'Fortran', 'Algorithm Design'],
        graduationYear: 2023
    },
    {
        id: 's8',
        name: 'Henry Ford',
        email: 'henry@example.com',
        role: 'student',
        rollNo: 'MECH108',
        cgpa: 6.5,
        branch: 'MECH',
        backlogs: 3,
        skills: ['Manufacturing', 'Six Sigma'],
        graduationYear: 2024
    },
    {
        id: 's9',
        name: 'Ivy Chen',
        email: 'ivy@example.com',
        role: 'student',
        rollNo: 'CSE109',
        cgpa: 8.5,
        branch: 'CSE',
        backlogs: 0,
        skills: ['Python', 'Django', 'Machine Learning'],
        graduationYear: 2025
    },
    {
        id: 's10',
        name: 'Jack Black',
        email: 'jack@example.com',
        role: 'student',
        rollNo: 'IT110',
        cgpa: 7.9,
        branch: 'IT',
        backlogs: 1,
        skills: ['Java', 'Android'],
        graduationYear: 2024
    }
];

export const mockApplications: Application[] = [
    {
        id: 'app1',
        driveId: 'd1', // Assuming a drive exists with id d1
        studentId: 's1',
        status: 'Applied',
        appliedAt: new Date().toISOString()
    },
    {
        id: 'app2',
        driveId: 'd1',
        studentId: 's5',
        status: 'Shortlisted',
        appliedAt: new Date().toISOString()
    }
];

export const mockDrives: JobDrive[] = [
    {
        id: 'd1',
        companyId: 'c1',
        companyName: 'TechCorp',
        title: 'Software Engineer',
        description: 'Join our team to build next-gen apps.',
        role: 'SDE-I',
        ctc: '12 LPA',
        location: 'Bangalore',
        category: 'Job',
        criteria: {
            minCgpa: 8.0,
            allowedBranches: ['CSE', 'IT', 'ECE'],
            maxBacklogs: 1,
            requiredSkills: ['React', 'Node.js'],
            eligibleGraduationYears: [2024]
        },
        deadline: '2024-12-31'
    }
];
