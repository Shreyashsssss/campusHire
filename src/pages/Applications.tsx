import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Application, JobDrive } from '../types';
import { CheckCircle, Clock, XCircle, Slash } from 'lucide-react';

const icons: Record<string, React.ElementType> = {
    'Applied': Clock,
    'Shortlisted': CheckCircle,
    'Selected': CheckCircle,
    'Rejected': XCircle,
};

const statusColors: Record<string, string> = {
    'Applied': 'bg-blue-100 text-blue-800',
    'Shortlisted': 'bg-amber-100 text-amber-800',
    'Selected': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
};

const Applications: React.FC = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);
    const [drives, setDrives] = useState<JobDrive[]>([]);

    useEffect(() => {
        if (user && user.id) {
            Promise.all([
                api.getApplications(user.id),
                api.getDrives()
            ]).then(([apps, drivesData]) => {
                setApplications(apps);
                setDrives(drivesData);
            }).catch(console.error);
        }
    }, [user]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My Applications</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul role="list" className="divide-y divide-slate-200">
                    {applications.length > 0 ? (
                        applications.slice().reverse().map((app) => {
                            const drive = drives.find(d => d.id === app.driveId);
                            const StatusIcon = icons[app.status] || Slash;

                            return (
                                <li key={app.id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition block">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-semibold text-primary-600 truncate">{drive?.title || 'Unknown Role'}</p>
                                                <p className="text-sm font-medium text-slate-500 mt-1">{drive?.companyName || 'Unknown Company'}</p>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[app.status]}`}>
                                                    <StatusIcon className="w-4 h-4 mr-1.5" />
                                                    {app.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-slate-500">
                                                    Applied on <time dateTime={app.appliedAt} className="ml-1 font-medium text-slate-900">{new Date(app.appliedAt).toLocaleDateString()}</time>
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0 sm:ml-6">
                                                    CTC: <span className="font-medium text-slate-900 ml-1">{drive?.ctc || 'N/A'}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <div className="px-4 py-12 text-center">
                            <Slash className="mx-auto h-12 w-12 text-slate-300" />
                            <h3 className="mt-2 text-sm font-medium text-slate-900">No applications found</h3>
                            <p className="mt-1 text-sm text-slate-500">Get started by applying to available drives.</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Applications;
