"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FiHome, FiBook, FiList, FiUser, FiBarChart2 } from 'react-icons/fi';

export default function TrainingLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - hidden on mobile, visible on larger screens */}
            <div className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white shadow-lg transition-transform duration-200 lg:relative lg:translate-x-0 ${
                isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex h-full flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Training Portal</h2>
                    </div>
                    
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            <li>
                                <Link href="/training/home" className="flex items-center rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <FiHome className="mr-3 h-5 w-5" />
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/training/courses" className="flex items-center rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <FiList className="mr-3 h-5 w-5" />
                                    All Courses
                                </Link>
                            </li>
                            <li>
                                <Link href="/training/learning-path" className="flex items-center rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <FiBook className="mr-3 h-5 w-5" />
                                    Learning Paths
                                </Link>
                            </li>
                            <li>
                                <Link href="/training/profile" className="flex items-center rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <FiUser className="mr-3 h-5 w-5" />
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/training/progress" className="flex items-center rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100">
                                    <FiBarChart2 className="mr-3 h-5 w-5" />
                                    Progress Stats
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col">
                {/* Mobile header with menu button */}
                <header className="sticky top-0 z-10 bg-white p-4 shadow-sm lg:hidden">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="rounded p-2 text-gray-600 hover:bg-gray-100"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </header>

                {/* Backdrop overlay for mobile menu */}
                {isMenuOpen && (
                    <div 
                        className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                {/* Page content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}