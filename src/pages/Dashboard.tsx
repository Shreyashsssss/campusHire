import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Application, JobDrive, Student } from '../types';
import EligibilityPanel from '../components/EligibilityPanel';
import CompanyDashboard from '../components/CompanyDashboard';
import { Search, Briefcase, Trophy, ClipboardList, UserCheck, MapPin, DollarSign, CheckCircle, Upload, FileText, BrainCircuit, BarChart } from 'lucide-react';
import { checkEligibility } from '../utils/eligibility';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [drives, setDrives] = useState<JobDrive[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Internship');

    // Eligibility Panel State
    const [selectedDrive, setSelectedDrive] = useState<JobDrive | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // AI & Resume State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Dynamic Metrics State (Default values for initial view)
    const [profileScore, setProfileScore] = useState(70);
    const [performanceMetrics, setPerformanceMetrics] = useState({
        technical: 60,
        aptitude: 50,
        communication: 70
    });

    useEffect(() => {
        api.getDrives().then(setDrives).catch(err => console.error("Failed to fetch drives", err));
    }, []);

    useEffect(() => {
        if (user && user.role === 'student') {
            api.getApplications(user.id).then(setApplications).catch(err => console.error("Failed to fetch apps", err));
        }
    }, [user]);

    const handleCheckEligibility = (drive: JobDrive) => {
        setSelectedDrive(drive);
        setIsPanelOpen(true);
    };

    const handleApply = async () => {
        if (!user || user.role !== 'student' || !selectedDrive) return;

        // Prevent duplicate
        if (applications.some(a => a.driveId === selectedDrive.id)) {
            alert('Already applied!');
            return;
        }

        try {
            await api.apply(selectedDrive.id, user.id);
            // Refresh applications
            const apps = await api.getApplications(user.id);
            setApplications(apps);
            alert('Application Successful!');
            setIsPanelOpen(false);
        } catch {
            alert('Failed to apply. Please try again.');
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && user) {
            setIsUploading(true);
            try {
                const res = await api.uploadResume(e.target.files[0], user.id);
                // Ensure specific response structure
                if (res && res.analysis) {
                    setAiAnalysis(res.analysis);

                    // Update dynamic metrics if available
                    if (res.profileScore) setProfileScore(res.profileScore);
                    if (res.performance) {
                        setPerformanceMetrics(res.performance);
                    }

                    alert('Resume uploaded & Analyzed successfully!');
                } else {
                    alert('Resume uploaded successfully!');
                }
            } catch (error) {
                console.error("Upload error", error);
                alert('Upload failed');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleAiAnalysis = async () => {
        if (!user || user.role !== 'student') return;
        setIsAnalyzing(true);
        try {
            const student = user as unknown as Student;
            const res = await api.analyzeProfile({
                cgpa: student.cgpa,
                branch: student.branch,
                skills: student.skills
            });
            setAiAnalysis(res.analysis);
        } catch {
            alert('AI Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const categories = [
        { id: 'Internship', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', count: drives.filter(d => d.category === 'Internship').length },
        { id: 'Job', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50', count: drives.filter(d => d.category === 'Job').length },
        { id: 'Competition', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50', count: drives.filter(d => d.category === 'Competition').length },
        { id: 'Mock Test', icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-50', count: drives.filter(d => d.category === 'Mock Test').length },
        { id: 'Mentorship', icon: UserCheck, color: 'text-rose-600', bg: 'bg-rose-50', count: drives.filter(d => d.category === 'Mentorship').length },
    ];

    const filteredDrives = drives.filter(drive => {
        return drive.category === selectedCategory || selectedCategory === 'All';
    });

    const recommendedDrives = drives.filter(drive => {
        if (!user || user.role !== 'student') return false;
        // Simple recommendation: eligible and not applied
        const eligible = checkEligibility(user as unknown as Student, drive.criteria).isEligible;
        const applied = applications.some(a => a.driveId === drive.id);
        return eligible && !applied;
    }).slice(0, 3);

    if (user?.role === 'company') {
        return <CompanyDashboard />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                    <p className="text-slate-500 mt-1">Explore opportunities curated for your profile.</p>
                </div>
                <button
                    onClick={handleAiAnalysis}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
                >
                    <BrainCircuit className="w-5 h-5" />
                    {isAnalyzing ? 'Analyzing...' : 'AI Profile Analysis'}
                </button>
            </div>

            {/* AI Analysis Result */}
            {aiAnalysis && (
                <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-xl shadow-indigo-500/10 fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-indigo-500"></div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <BrainCircuit className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">AI Career Roadmap</h3>
                    </div>
                    <div className="prose prose-indigo max-w-none text-slate-600 text-sm">
                        <pre className="whitespace-pre-wrap font-sans">{aiAnalysis}</pre>
                    </div>
                    <button onClick={() => setAiAnalysis(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        ✖
                    </button>
                </div>
            )}

            {/* Category Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((cat, i) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-5 rounded-2xl text-left border transition-all duration-300 card-hover group
                            ${selectedCategory === cat.id ? 'bg-white border-primary-500 ring-2 ring-primary-100 shadow-xl' : 'bg-white border-slate-100 hover:border-primary-200 shadow-sm'}`}
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${selectedCategory === cat.id ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600'}`}>
                            <cat.icon className="w-6 h-6" />
                        </div>
                        <h3 className={`font-bold ${selectedCategory === cat.id ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{cat.id}s</h3>
                        <p className="text-xs text-slate-400 mt-1">{cat.count} Opportunities</p>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Listings */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Recommended Section where Eligible */}
                    {recommendedDrives.length > 0 && selectedCategory === 'Internship' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                <h2 className="text-lg font-bold text-slate-900">Top Picks for You</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {recommendedDrives.map(drive => (
                                    <div key={drive.id} className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100 relative group cursor-pointer hover:shadow-md transition-all" onClick={() => handleCheckEligibility(drive)}>
                                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-[10px] font-bold text-amber-600 shadow-sm">
                                            95% Match
                                        </div>
                                        <h3 className="font-bold text-slate-900">{drive.title}</h3>
                                        <p className="text-sm text-slate-600">{drive.companyName}</p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="text-xs bg-white/60 px-2 py-1 rounded-md text-slate-600 font-medium">{drive.ctc}</span>
                                            <span className="text-xs bg-white/60 px-2 py-1 rounded-md text-slate-600 font-medium">{drive.location}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filtered Listings */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-slate-900">
                            {selectedCategory} Opportunities
                        </h2>
                        {filteredDrives.length > 0 ? (
                            filteredDrives.map((drive, i) => (
                                <div key={drive.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm card-hover flex flex-col md:flex-row gap-6 relative group overflow-hidden fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl items-center justify-center flex-shrink-0 text-2xl shadow-inner">
                                        🏢
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{drive.title}</h3>
                                                <p className="text-slate-500 font-medium">{drive.companyName}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wide">
                                                <MapPin className="w-3 h-3" /> {drive.location}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                                                <DollarSign className="w-3 h-3" /> {drive.ctc}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {drive.criteria.requiredSkills.map(skill => (
                                                <span key={skill} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-500 text-xs rounded-md">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-between items-end gap-4 min-w-[140px]">
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deadline</span>
                                            <p className="text-sm font-semibold text-slate-900">{new Date(drive.deadline).toLocaleDateString()}</p>
                                        </div>

                                        {applications.some(a => a.driveId === drive.id) ? (
                                            <button disabled className="w-full px-5 py-2.5 bg-green-50 text-green-700 font-bold rounded-xl text-sm flex items-center justify-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Applied
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleCheckEligibility(drive)}
                                                className="w-full px-5 py-2.5 bg-slate-900 hover:bg-primary-600 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                                            >
                                                Apply Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="font-bold text-slate-900">No opportunities found</h3>
                                <p className="text-slate-500 mt-1 text-sm">Check back later for more {selectedCategory}s.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* Profile Strength & Resume Upload */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <h3 className="font-bold text-lg mb-4 relative z-10">Profile Strength</h3>
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                            <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center text-xl font-bold">
                                {profileScore}%
                            </div>
                            <div>
                                <p className="font-medium text-white/90">Keep it up!</p>
                                <p className="text-xs text-white/70">Add more skills to reach 100%</p>
                            </div>
                        </div>

                        <div className="space-y-3 relative z-10">
                            <label className="flex items-center justify-between p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-colors border border-white/10">
                                <div className="flex items-center gap-3">
                                    <Upload className="w-5 h-5 text-white/80" />
                                    <span className="text-sm font-medium text-white/90">
                                        {isUploading ? 'Uploading...' : 'Upload Resume'}
                                    </span>
                                </div>
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} disabled={isUploading} />
                            </label>

                            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-emerald-300" />
                                    <span className="text-sm font-medium text-white/90">Certificates</span>
                                </div>
                                <span className="text-xs bg-white/20 px-2 py-1 rounded">2 Added</span>
                            </div>
                        </div>
                    </div>

                    {/* Graphical Analysis (Visual Only for now) */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart className="w-5 h-5 text-slate-500" />
                            <h3 className="font-bold text-slate-900">Performance Analysis</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Technical Skills', val: performanceMetrics.technical, col: 'bg-blue-500' },
                                { label: 'Aptitude', val: performanceMetrics.aptitude, col: 'bg-emerald-500' },
                                { label: 'Communication', val: performanceMetrics.communication, col: 'bg-purple-500' }
                            ].map(stat => (
                                <div key={stat.label}>
                                    <div className="flex justify-between text-xs mb-1 font-medium text-slate-500">
                                        <span>{stat.label}</span>
                                        <span>{stat.val}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${stat.col} rounded-full`} style={{ width: `${stat.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <p className="text-xs text-slate-400 text-center">Based on Mock Tests & Profile Data</p>
                        </div>
                    </div>

                    {/* Skill Recommendations */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Recommended Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Docker', 'TypeScript', 'System Design'].map(skill => (
                                <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 hover:border-primary-300 hover:text-primary-600 cursor-pointer transition-colors">
                                    + {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {selectedDrive && user?.role === 'student' && (
                <EligibilityPanel
                    drive={selectedDrive}
                    student={user as unknown as Student}
                    isOpen={isPanelOpen}
                    onClose={() => setIsPanelOpen(false)}
                    onApply={handleApply}
                />
            )}
        </div>
    );
};

export default Dashboard;
