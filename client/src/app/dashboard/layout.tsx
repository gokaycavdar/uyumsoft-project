'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// ✅ Backend'le uyumlu interface
interface UserInfo {
  id: number;
  email: string;
  fullName: string;  // ← firstName, lastName yerine
  role: string;
}

export default function UserDashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  const menuItems = [
    
    {
      name: 'Stations Map',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    
    {
      name: 'Charging History',
      href: '/dashboard/charging-history',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
   
    {
      name: 'My Cars',
      href: '/dashboard/my-cars',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (!token) {
      router.replace('/login');
      return;
    }

    if (userRole !== 'User') {
      if (userRole === 'Admin') {
        router.replace('/admin');
      } else if (userRole === 'Provider') {
        router.replace('/provider');
      } else {
        router.replace('/login');
      }
      return;
    }

    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userInfo');
    router.replace('/');
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/dashboard/stations-map':
        return 'EV Charging Stations'; // ✅ Ana sayfa için düzelt
      case '/dashboard/charging-history':
        return 'Charging History';
      case '/dashboard/my-cars':
        return 'My Cars';
      default:
        return 'Dashboard';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 018 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">EnerjiMetre</h1>
          </div>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-4 left-4 w-fit">
          {/* Logout butonu için */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-left text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">
                  {/* ✅ fullName kullan */}
                  Welcome, {userInfo?.fullName || 'User'}!
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
