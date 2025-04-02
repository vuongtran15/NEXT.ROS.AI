
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { FiBook, FiList, FiPlay, FiUser, FiBarChart2 } from 'react-icons/fi';


export default function TrainingHomePage() {
    const [courses, setCourses] = useState([
        { id: 1, title: 'Introduction to AI', progress: 30, category: 'AI Basics' },
        { id: 2, title: 'Machine Learning Fundamentals', progress: 45, category: 'Machine Learning' },
        { id: 3, title: 'Neural Networks Deep Dive', progress: 10, category: 'Deep Learning' },
        { id: 4, title: 'NLP Techniques', progress: 0, category: 'Natural Language Processing' }
    ]);
    
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Training Portal</h1>
                <p className="text-gray-600">Continue your learning journey</p>
            </div>
            
            <div className="mb-6 flex items-center">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border rounded-md w-full max-w-md"
                />
            </div>
            
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium">{course.title}</h3>
                                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{course.category}</span>
                                </div>
                                <div className="mb-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{course.progress}% complete</p>
                                </div>
                                <div className="flex justify-end">
                                    <Link href={`/training/course/${course.id}`} className="text-blue-600 flex items-center">
                                        <FiPlay className="mr-1" size={16} />
                                        {course.progress > 0 ? 'Continue' : 'Start'}
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            No courses found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/training/courses" className="border rounded-lg p-4 flex items-center hover:bg-gray-50">
                    <FiList size={20} className="text-blue-600 mr-3" />
                    <span>Browse All Courses</span>
                </Link>
                <Link href="/training/learning-path" className="border rounded-lg p-4 flex items-center hover:bg-gray-50">
                    <FiBook size={20} className="text-green-600 mr-3" />
                    <span>Learning Paths</span>
                </Link>
                <Link href="/training/profile" className="border rounded-lg p-4 flex items-center hover:bg-gray-50">
                    <FiUser size={20} className="text-purple-600 mr-3" />
                    <span>My Profile</span>
                </Link>
                <Link href="/training/progress" className="border rounded-lg p-4 flex items-center hover:bg-gray-50">
                    <FiBarChart2 size={20} className="text-orange-600 mr-3" />
                    <span>Progress Stats</span>
                </Link>
            </div>
        </div>
    );
}