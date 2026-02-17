import React from 'react';
import type { Student, Application, DriveCriteria } from '../types';
import { checkEligibility } from '../utils/eligibility';

interface ApplicantListProps {
    students: Student[];
    applications: Application[];
    criteria: DriveCriteria;
    onShortlist: (studentId: string) => void;
    onReject: (studentId: string) => void;
}

const ApplicantList: React.FC<ApplicantListProps> = ({ students, applications, criteria, onShortlist, onReject }) => {
    // Filter students who have applied
    const applicants = students.filter(s => applications.some(a => a.studentId === s.id));

    return (
        <div className="card animate-fade-in" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Applicant Review ({applicants.length})</h3>

            {applicants.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No applications yet.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '0.75rem' }}>Full Name</th>
                                <th style={{ padding: '0.75rem' }}>Roll No</th>
                                <th style={{ padding: '0.75rem' }}>CGPA</th>
                                <th style={{ padding: '0.75rem' }}>Eligibility Check & Reasons</th>
                                <th style={{ padding: '0.75rem' }}>Action / Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map(student => {
                                const eligibility = checkEligibility(student, criteria);
                                const app = applications.find(a => a.studentId === student.id);

                                return (
                                    <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ fontWeight: 500 }}>{student.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.branch}</div>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>{student.rollNo}</td>
                                        <td style={{ padding: '0.75rem', fontWeight: 'bold', color: student.cgpa >= criteria.minCgpa ? 'var(--success)' : 'inherit' }}>{student.cgpa}</td>

                                        <td style={{ padding: '0.75rem', minWidth: '250px' }}>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem' }}>
                                                {eligibility.checks.map((check, i) => (
                                                    <li key={i} style={{
                                                        color: check.passed ? 'var(--success)' : 'var(--error)',
                                                        marginBottom: '2px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <span>{check.passed ? '✓' : '✗'}</span>
                                                        <span>{check.reason}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>

                                        <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            {app?.status === 'Applied' ? (
                                                <>
                                                    <button
                                                        onClick={() => onShortlist(student.id)}
                                                        className="btn btn-primary"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginRight: '0.5rem' }}
                                                    >
                                                        Shortlist
                                                    </button>
                                                    <button
                                                        onClick={() => onReject(student.id)}
                                                        className="btn btn-danger"
                                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className={`badge ${app?.status === 'Shortlisted' || app?.status === 'Selected'
                                                    ? 'badge-success'
                                                    : 'badge-error'
                                                    }`}>
                                                    {app?.status ? app.status.toUpperCase() : 'UNKNOWN'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ApplicantList;
