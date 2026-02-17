import React, { useState } from 'react';
import type { JobDrive, Student, Application } from '../types';
import { checkEligibility } from '../utils/eligibility';
import { Briefcase, MapPin, Clock, CheckCircle, XCircle, ArrowRightCircle } from 'lucide-react';

interface DriveCardProps {
    drive: JobDrive;
    student: Student;
    application: Application | undefined;
    onApply: (driveId: string) => void;
}

const DriveCard: React.FC<DriveCardProps> = ({ drive, student, application, onApply }) => {
    const [showEligibility, setShowEligibility] = useState(false);
    const eligibility = checkEligibility(student, drive.criteria);

    // Tag Styles
    const statusColors: Record<string, string> = {
        'Applied': 'bg-blue-100 text-blue-700 border-blue-200',
        'Shortlisted': 'bg-amber-100 text-amber-700 border-amber-200',
        'Selected': 'bg-green-100 text-green-700 border-green-200',
        'Rejected': 'bg-red-100 text-red-700 border-red-200',
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'Applied': return 'Application Submitted';
            case 'Shortlisted': return 'You are Shortlisted!';
            case 'Selected': return 'Selection Confirmed';
            case 'Rejected': return 'Application Rejected';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-white to-slate-50">
                <div>
                    <h3 className="font-semibold text-lg text-slate-900 leading-tight">{drive.title}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        {drive.companyName}
                    </p>
                </div>

                {/* Salary Badge */}
                <div className="bg-primary-50 text-primary-700 text-sm font-bold px-3 py-1 rounded-full border border-primary-100 shadow-sm">
                    {drive.ctc}
                </div>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 flex flex-col gap-4">
                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{drive.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>Deadline: {drive.deadline}</span>
                    </div>
                </div>

                {/* Roles/Skills */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {drive.criteria.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-1 rounded-md border border-slate-200">
                            {skill}
                        </span>
                    ))}
                    {drive.criteria.requiredSkills.length > 3 && (
                        <span className="text-xs text-slate-400 self-center">+ {drive.criteria.requiredSkills.length - 3} more</span>
                    )}
                </div>

                <p className="text-sm text-slate-500 line-clamp-3 mt-1 leading-relaxed">
                    {drive.description}
                </p>

                {/* Eligibility Check Section */}
                {showEligibility && (
                    <div className={`mt-3 p-3 rounded-lg text-sm border ${eligibility.isEligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="font-medium flex items-center gap-2 mb-2">
                            {eligibility.isEligible ? (
                                <span className="text-green-700 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Eligible to Apply</span>
                            ) : (
                                <span className="text-red-700 flex items-center gap-1"><XCircle className="w-4 h-4" /> Not Eligible</span>
                            )}
                        </div>
                        <ul className="space-y-1.5">
                            {eligibility.checks.map((check, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className={`mt-0.5 ${check.passed ? 'text-green-500' : 'text-red-500'}`}>
                                        {check.passed ? '✓' : '•'}
                                    </span>
                                    <span className={`${check.passed ? 'text-slate-600' : 'text-red-600 font-medium'}`}>
                                        {check.reason}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                {application ? (
                    <div className={`w-full text-center py-2.5 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 ${statusColors[application.status] || 'bg-slate-100'}`}>
                        {application.status === 'Selected' && <CheckCircle className="w-4 h-4" />}
                        {getStatusText(application.status)}
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => setShowEligibility(!showEligibility)}
                            className="text-primary-600 text-sm font-medium hover:text-primary-700 transition"
                        >
                            {showEligibility ? 'Hide Criteria' : 'Check Eligibility'}
                        </button>

                        <button
                            onClick={() => onApply(drive.id)}
                            disabled={!eligibility.isEligible}
                            className={`
                            flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all focus:ring-2 focus:ring-offset-1
                            ${eligibility.isEligible
                                    ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 hover:shadow-md'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                                }
                        `}
                        >
                            Apply Now
                            {eligibility.isEligible && <ArrowRightCircle className="w-4 h-4" />}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DriveCard;
