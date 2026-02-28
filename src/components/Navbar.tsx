import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, LayoutDashboard, UserCheck, Bell, LogOut, Menu, X, FileText } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/')
    };

    if (!user) return null;

    const navItems = user.role === 'student' ? [
        { name: 'Drives', to: '/dashboard', icon: LayoutDashboard },
        { name: 'My Applications', to: '/applications', icon: UserCheck },
        { name: 'ATS Scorer', to: '/ats-scorer', icon: FileText },
    ] : [
        { name: 'Manage Drives', to: '/company', icon: LayoutDashboard },
        { name: 'Candidates', to: '/candidates', icon: UserCheck },
    ];

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <Briefcase className="h-8 w-8 text-primary-600" />
                            <span className="font-bold text-xl tracking-tight text-slate-800">Campus<span className="text-primary-600">Hire</span></span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive
                                        ? 'border-primary-500 text-slate-900'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`
                                }
                            >
                                <item.icon className="w-4 h-4 mr-2" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right Side: Notifications & Profile */}
                    <div className="hidden md:flex md:items-center md:ml-6 space-x-4">
                        <button className="p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 transition">
                            <Bell className="h-5 w-5" />
                        </button>

                        <div className="ml-3 relative flex items-center space-x-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                            </div>
                            <div
                                className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold cursor-pointer"
                                title="Profile"
                            >
                                {user.name.charAt(0)}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="ml-2 p-2 text-slate-400 hover:text-red-500 transition tooltip"
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-50 border-t border-slate-200">
                    <div className="pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                                        : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                    }`
                                }
                            >
                                <div className="flex items-center">
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </div>
                            </NavLink>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600 flex items-center"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}

        </nav>
    );
};

export default Navbar;
