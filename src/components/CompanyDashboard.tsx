import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { JobDrive, Application, ApplicationStatus } from '../types';
import CreateDrive from './CreateDrive';
import { mockStudents, mockApplications as initialMockApps, mockDrives as initialMockDrives } from '../data/mockData';
import { checkEligibility } from '../utils/eligibility';
import { CheckCircle, XCircle, Plus, ChevronRight, Briefcase, Calendar, MapPin, DollarSign } from 'lucide-react';

const CompanyDashboard: React.FC = () => {
    const { user } = useAuth();
    const [drives, setDrives] = useState<JobDrive[]>(initialMockDrives); // Should fetch from API eventually
    const [selectedDrive, setSelectedDrive] = useState<JobDrive | null>(null);
    const [isCreatingDrive, setIsCreatingDrive] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'eligible' | 'applications'>('overview');

    // Mock Application State (In real app, fetch from API)
    const [applications, setApplications] = useState<Application[]>(initialMockApps);

    const handleCreateDrive = (newDrive: JobDrive) => {
        setDrives([...drives, newDrive]);
        setIsCreatingDrive(false);
    };

    const handleStatusUpdate = (appId: string, newStatus: ApplicationStatus) => {
        setApplications(apps => apps.map(app =>
            app.id === appId ? { ...app, status: newStatus } : app
        ));
    };

    const [studentFilter, setStudentFilter] = useState<'eligible' | 'all'>('eligible');

    if (isCreatingDrive && user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => setIsCreatingDrive(false)}
                    className="mb-4 text-slate-500 hover:text-slate-900 flex items-center gap-2"
                >
                    &larr; Back to Dashboard
                </button>
                <CreateDrive company={{ id: user.id, name: user.name }} onCreate={handleCreateDrive} />
            </div>
        );
    }

    if (selectedDrive) {
        // Calculate eligible students for this drive
        const studentsToDisplay = mockStudents.filter(student => {
            if (studentFilter === 'all') return true;
            return checkEligibility(student, selectedDrive.criteria).isEligible;
        });

        const eligibleCount = mockStudents.filter(s => checkEligibility(s, selectedDrive.criteria).isEligible).length;

        // Get applications for this drive
        const driveApps = applications.filter(app => app.driveId === selectedDrive.id);

        return (
            <div className="max-w-7xl mx-auto px-4 py-8 h-screen flex flex-col">
                <button
                    onClick={() => setSelectedDrive(null)}
                    className="mb-4 text-slate-500 hover:text-slate-900 flex items-center gap-2 self-start"
                >
                    &larr; Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">{selectedDrive.title}</h1>
                                <p className="text-slate-500 mt-1">{selectedDrive.role} • {selectedDrive.location}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedDrive.category === 'Job' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                    {selectedDrive.category}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                    Active
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('eligible')}
                                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'eligible' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Eligible Pool <span className="ml-1 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md text-[10px]">{eligibleCount}</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'applications' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Applications <span className="ml-1 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-md text-[10px]">{driveApps.length}</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                        {activeTab === 'overview' && (
                            <div className="space-y-6 max-w-3xl">
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-lg mb-4">Job Description</h3>
                                    <p className="text-slate-600 whitespace-pre-wrap">{selectedDrive.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">CTC / Salary</div>
                                        <div className="font-semibold text-slate-900">{selectedDrive.ctc}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Deadline</div>
                                        <div className="font-semibold text-slate-900">{new Date(selectedDrive.deadline).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h3 className="font-bold text-lg mb-4">Eligibility Criteria</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-slate-600">Minimum CGPA</span>
                                            <span className="font-medium">{selectedDrive.criteria.minCgpa}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-slate-600">Max Backlogs</span>
                                            <span className="font-medium">{selectedDrive.criteria.maxBacklogs}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-slate-600">Allowed Branches</span>
                                            <span className="font-medium">{selectedDrive.criteria.allowedBranches.join(', ')}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-600">Required Skills</span>
                                            <div className="flex gap-2">
                                                {selectedDrive.criteria.requiredSkills.map(skill => (
                                                    <span key={skill} className="bg-slate-100 px-2 py-0.5 rounded text-sm text-slate-700">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'eligible' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800">Student Pool Analysis</h3>
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => setStudentFilter('eligible')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${studentFilter === 'eligible' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Eligible Only
                                        </button>
                                        <button
                                            onClick={() => setStudentFilter('all')}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${studentFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            View All
                                        </button>
                                    </div>
                                </div>

                                {studentsToDisplay.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                        <p className="text-slate-500">No students found matching the filter.</p>
                                    </div>
                                ) : (
                                    studentsToDisplay.map(student => {
                                        const eligibility = checkEligibility(student, selectedDrive.criteria);
                                        return (
                                            <div key={student.id} className={`bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow group ${eligibility.isEligible ? 'border-emerald-100 bg-emerald-50/10' : 'border-red-100 bg-red-50/10'}`}>
                                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-slate-900">{student.name}</h4>
                                                            <span className={`text-xs px-2 py-0.5 rounded font-bold ${eligibility.isEligible ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                {eligibility.isEligible ? 'Eligible' : 'Not Eligible'}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-4 mt-2 text-sm text-slate-600">
                                                            <span>CGPA: <strong>{student.cgpa}</strong></span>
                                                            <span>Backlogs: <strong>{student.backlogs}</strong></span>
                                                            <span>Branch: <strong>{student.branch}</strong></span>
                                                        </div>
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {student.skills.slice(0, 4).map(skill => (
                                                                <span key={skill} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{skill}</span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className={`p-3 rounded-lg flex-shrink-0 min-w-[280px] ${eligibility.isEligible ? 'bg-emerald-50/50' : 'bg-red-50/50'}`}>
                                                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Eligibility Breakdown</div>
                                                        <ul className="space-y-1.5">
                                                            {eligibility.checks.map((check, i) => (
                                                                <li key={i} className="flex items-start gap-2 text-xs">
                                                                    {check.passed ?
                                                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" /> :
                                                                        <XCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                                                                    }
                                                                    <span className={`${check.passed ? 'text-slate-700' : 'text-red-700 font-medium'}`}>{check.reason}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}

                        {activeTab === 'applications' && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 mb-4">Received Applications</h3>
                                {driveApps.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                        <p className="text-slate-500">No applications received yet.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                                                <tr>
                                                    <th className="px-6 py-4">Candidate</th>
                                                    <th className="px-6 py-4">Profile Summary</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {driveApps.map(app => {
                                                    const student = mockStudents.find(s => s.id === app.studentId);
                                                    if (!student) return null;

                                                    return (
                                                        <tr key={app.id} className="hover:bg-slate-50/50">
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-slate-900">{student.name}</div>
                                                                <div className="text-sm text-slate-500">{student.email}</div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm">
                                                                    <span className="font-semibold">{student.cgpa} CGPA</span> • {student.branch}
                                                                </div>
                                                                <div className="text-xs text-slate-500 mt-1">
                                                                    {student.skills.slice(0, 3).join(', ')}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                                                    ${app.status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-700' :
                                                                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                                            app.status === 'Interviewing' ? 'bg-amber-100 text-amber-700' :
                                                                                'bg-slate-100 text-slate-600'}`}>
                                                                    {app.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right space-x-2">
                                                                {app.status === 'Applied' && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
                                                                            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                                                                        >
                                                                            Shortlist
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                                                                            className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                                                                        >
                                                                            Reject
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {app.status === 'Shortlisted' && (
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(app.id, 'Interviewing')}
                                                                        className="text-xs font-bold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors"
                                                                    >
                                                                        Schedule Interview
                                                                    </button>
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
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Company Dashboard</h1>
                    <p className="text-slate-500">Manage your recruitment drives and track applicants.</p>
                </div>
                <button
                    onClick={() => setIsCreatingDrive(true)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" /> Create New Drive
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drives.map(drive => (
                    <div
                        key={drive.id}
                        onClick={() => setSelectedDrive(drive)}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
                                {drive.category}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{drive.title}</h3>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{drive.description}</p>

                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <DollarSign className="w-4 h-4" /> {drive.ctc}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <MapPin className="w-4 h-4" /> {drive.location}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Calendar className="w-4 h-4" /> Deadline: {new Date(drive.deadline).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                            <div className="text-sm font-medium text-slate-600">
                                {mockStudents.filter(s => checkEligibility(s, drive.criteria).isEligible).length} Eligible
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                    </div>
                ))}

                {drives.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500 mb-4">You haven't posted any drives yet.</p>
                        <button
                            onClick={() => setIsCreatingDrive(true)}
                            className="text-indigo-600 font-bold hover:underline"
                        >
                            Create your first drive
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDashboard;
