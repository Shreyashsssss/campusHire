import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Lock, Mail, User as UserIcon, GraduationCap, BookOpen, FileText } from 'lucide-react';


const Login: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gpa, setGpa] = useState('');
    const [year, setYear] = useState('');
    const [skills, setSkills] = useState('');

    const [role, setRole] = useState<'student' | 'company'>('student');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we would register the user here.
        // For this mock, we just log them in with the details provided or mock details.
        if (isRegistering) {
            const studentData = {
                name,
                cgpa: parseFloat(gpa),
                graduationYear: parseInt(year),
                skills: skills.split(',').map(s => s.trim())
            };
            await login(email, role, studentData);
        } else {
            await login(email, role);
        }
        navigate(role === 'student' ? '/dashboard' : '/company');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden my-8">
                <div className="bg-primary-600 p-6 text-white text-center">
                    <div className="flex justify-center mb-4">
                        <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Campus Portal</h1>
                    <p className="opacity-90 mt-2">{isRegistering ? 'Create your account' : 'Sign in to your account'}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">

                    {/* Role Selection */}
                    {!isRegistering && (
                        <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
                            <button
                                type="button"
                                onClick={() => setRole('student')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role === 'student' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('company')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role === 'company' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Company
                            </button>
                        </div>
                    )}

                    {isRegistering && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@college.edu"
                                className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    {isRegistering && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">GPA</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <BookOpen className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={gpa}
                                            onChange={(e) => setGpa(e.target.value)}
                                            className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="8.5"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Grad Year</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <GraduationCap className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="number"
                                            required
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="2024"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Top Skills</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FileText className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                        className="pl-10 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="React, Java, Python"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
                    >
                        {isRegistering ? 'Create Account' : `Sign In as ${role === 'student' ? 'Student' : 'Company'}`}
                    </button>
                </form>

                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        <button
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="ml-1 text-primary-600 font-medium cursor-pointer hover:underline focus:outline-none"
                        >
                            {isRegistering ? 'Sign In' : 'Register now'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
