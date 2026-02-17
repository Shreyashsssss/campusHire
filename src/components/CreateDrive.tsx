import React, { useState } from 'react';
import type { JobDrive, DriveCriteria } from '../types';

interface CreateDriveProps {
    company: { id: string; name: string };
    onCreate: (drive: JobDrive) => void;
}

const CreateDrive: React.FC<CreateDriveProps> = ({ company, onCreate }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        role: '',
        ctc: '',
        location: '',
        deadline: '',
        minCgpa: 6.0,
        maxBacklogs: 0,
        allowedBranches: 'CSE, IT, ECE',
        requiredSkills: 'React, Node.js',
        category: 'Job' // Default
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const criteria: DriveCriteria = {
            minCgpa: Number(formData.minCgpa),
            maxBacklogs: Number(formData.maxBacklogs),
            allowedBranches: formData.allowedBranches.split(',').map(b => b.trim()),
            requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s)
        };

        const newDrive: JobDrive = {
            id: `d-${Date.now()}`,
            companyId: company.id,
            companyName: company.name,
            title: formData.title,
            description: formData.description,
            role: formData.role,
            ctc: formData.ctc,
            location: formData.location,
            category: formData.category,
            criteria: criteria,
            deadline: formData.deadline
        };

        onCreate(newDrive);
    };

    return (
        <div className="card animate-fade-in" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Create New Placement Drive</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2">
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Job Title</label>
                    <input className="input" type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Software Engineer" />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                    <textarea className="input" rows={4} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Job description..." />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
                    <select className="input" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                        <option value="Job">Job</option>
                        <option value="Internship">Internship</option>
                        <option value="Competition">Competition</option>
                        <option value="Mentorship">Mentorship</option>
                        <option value="Mock Test">Mock Test</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role (e.g. SDE-I)</label>
                    <input className="input" type="text" required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>CTC</label>
                    <input className="input" type="text" required value={formData.ctc} onChange={e => setFormData({ ...formData, ctc: e.target.value })} placeholder="e.g. 12 LPA" />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
                    <input className="input" type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Deadline</label>
                    <input className="input" type="date" required value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Eligibility Criteria</h3>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Min CGPA</label>
                    <input className="input" type="number" step="0.1" required value={formData.minCgpa} onChange={e => setFormData({ ...formData, minCgpa: Number(e.target.value) })} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Max Backlogs</label>
                    <input className="input" type="number" required value={formData.maxBacklogs} onChange={e => setFormData({ ...formData, maxBacklogs: Number(e.target.value) })} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Allowed Branches (comma separated)</label>
                    <input className="input" type="text" required value={formData.allowedBranches} onChange={e => setFormData({ ...formData, allowedBranches: e.target.value })} placeholder="CSE, IT, ECE" />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Required Skills (comma separated)</label>
                    <input className="input" type="text" value={formData.requiredSkills} onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })} placeholder="React, Node.js, Python" />
                </div>

                <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                    Publish Drive
                </button>
            </form>
        </div>
    );
};

export default CreateDrive;
