import React, { useMemo } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import type { Student, JobDrive, EligibilityResult } from '../types';
import { checkEligibility } from '../utils/eligibility';

interface EligibilityPanelProps {
    drive: JobDrive;
    student: Student;
    isOpen: boolean;
    onClose: () => void;
    onApply: () => void;
}

const EligibilityPanel: React.FC<EligibilityPanelProps> = ({ drive, student, isOpen, onClose, onApply }) => {
    const eligibility: EligibilityResult = checkEligibility(student, drive.criteria);

    // Calculate AI Prediction Score (Mock Logic based on criteria match)
    const predictionScore = useMemo(() => {
        let score = 0;
        // CGPA (30%)
        const cgpaRatio = Math.min(student.cgpa / drive.criteria.minCgpa, 1.2);
        score += Math.min(cgpaRatio * 30, 30);

        // Backlogs (15%)
        score += student.backlogs === 0 ? 15 : Math.max(0, 15 - (student.backlogs * 5));

        // Skills (35%)
        const matchedSkills = student.skills.filter(s =>
            drive.criteria.requiredSkills.some(rs => rs.toLowerCase() === s.toLowerCase())
        );
        const skillRatio = matchedSkills.length / Math.max(drive.criteria.requiredSkills.length, 1);
        score += Math.min(skillRatio * 35, 35);

        // Academic/Other (20%) - Deterministic mock factor
        // Use student ID length or some property to vary it slightly but deterministically
        const deterministicBonus = (student.name.length + drive.title.length) % 10;
        score += 10 + deterministicBonus;

        return Math.round(Math.min(score, 98));
    }, [student, drive]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-white h-full overflow-y-auto slide-in-right shadow-2xl flex flex-col">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-slate-900">Eligibility Analysis</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 flex-1">
                    {/* Drive Info */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm border border-slate-100">
                            🏢
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{drive.title}</h3>
                            <p className="text-slate-500 text-sm">{drive.companyName}</p>
                        </div>
                    </div>

                    {/* Eligibility Checks */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Requirements Check</h4>
                        <div className="space-y-3">
                            {eligibility.checks.map((check, index) => (
                                <div key={index} className={`flex items-start gap-3 p-3 rounded-xl border ${check.passed ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                    {check.passed ?
                                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" /> :
                                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    }
                                    <div>
                                        <p className={`text-sm font-semibold ${check.passed ? 'text-emerald-900' : 'text-red-900'}`}>
                                            {check.passed ? 'Requirement Met' : 'Requirement Not Met'}
                                        </p>
                                        <p className={`text-xs mt-1 ${check.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                                            {check.reason}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Eligibility Status Banner */}
                    <div className={`p-5 rounded-xl border ${eligibility.isEligible ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{eligibility.isEligible ? '🎉' : '🚫'}</span>
                            <div>
                                <p className={`font-bold ${eligibility.isEligible ? 'text-emerald-800' : 'text-red-800'}`}>
                                    {eligibility.isEligible ? 'You represent a Strong Match!' : 'Not Eligible for this Role'}
                                </p>
                                {!eligibility.isEligible && (
                                    <p className="text-sm text-red-600 mt-1">Please improve your profile to meet the criteria.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI Prediction Section (Only if Eligible) */}
                    {eligibility.isEligible && (
                        <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-blue-100">
                            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span>🤖</span> AI Selection Probability
                            </h4>

                            <div className="text-center mb-6">
                                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    {predictionScore}%
                                </div>
                                <p className="text-sm text-slate-600 font-medium">Chance of clearing Round 1</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/60 p-2 rounded-lg text-center">
                                    <div className="text-indigo-600 font-bold">High</div>
                                    <div className="text-[10px] text-slate-500 uppercase">CGPA Impact</div>
                                </div>
                                <div className="bg-white/60 p-2 rounded-lg text-center">
                                    <div className="text-indigo-600 font-bold">Strong</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Skill Match</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0">
                    <button
                        onClick={onApply}
                        disabled={!eligibility.isEligible}
                        className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] 
                            ${eligibility.isEligible
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                : 'bg-slate-300 cursor-not-allowed shadow-none'}`}
                    >
                        {eligibility.isEligible ? 'Submit Application Now' : 'Application Closed due to Ineligibility'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EligibilityPanel;
