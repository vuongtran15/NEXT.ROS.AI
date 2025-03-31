"use client";

import './layout.scss'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { FiMessageSquare, FiLogOut } from 'react-icons/fi'
import { BsWindow } from 'react-icons/bs'
import { BiGlobe } from 'react-icons/bi'
import { GoServer, GoHubot, GoSun } from 'react-icons/go'
import { fnRemoveTokenFromLocalStorage } from '@/utils/local';

export default function LayoutMain({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Redirect to login page after successful logout
                fnRemoveTokenFromLocalStorage();
                router.push('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="main-layout">
            <div className="main-menu">
                <div className='logo'>
                    <img src="/images/logo.png" alt="Logo" />
                </div>
                <div className='menu-items'>
                    <Link href="/chat" className={`menu-item ${pathname === '/chat' ? 'active' : ''}`}>
                        <FiMessageSquare size={24} color="white" />
                        <span>Chat</span>
                    </Link>
                    <Link href="/efficiency" className="menu-item">
                        <GoHubot size={24} color="white" />
                        <span>Efficiency</span>
                    </Link>
                    <Link href="/agent" className="menu-item">
                        <GoSun size={24} color="white" />
                        <span>Agent</span>
                    </Link>
                    <Link href="/library" className="menu-item">
                        <GoServer size={24} color="white" />
                        <span>Note Library</span>
                    </Link>
                </div>
                <div className='logout'>
                    <button onClick={handleLogout} className="logout-button">
                        <FiLogOut size={24} color="white" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
            <div className="main-body">
                {children}
            </div>
        </div>
    );
}