'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UserInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (!token) {
      router.push('/login');
      return;
    }

    // Check if user has correct role
    if (userRole !== 'user') {
      // Redirect to appropriate dashboard
      if (userRole === 'admin') {
        router.push('/admin');
      } else if (userRole === 'provider') {
        router.push('/provider');
      } else {
        router.push('/login');
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
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">EnerjiMetre</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {userInfo?.firstName || 'User'}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Welcome to your Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Here you can manage your energy consumption, view your bills, and find energy providers.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {/* Current Usage */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Current Usage
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        234 kWh
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Bill */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Monthly Bill
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        ₺156.80
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Provider */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Current Provider
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        Not Selected
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 text-left hover:bg-green-100 dark:hover:bg-green-800 transition-colors">
                  <div className="text-green-600 dark:text-green-400 font-medium">Find Providers</div>
                  <div className="text-sm text-green-500 dark:text-green-300 mt-1">Compare energy providers</div>
                </button>
                
                <button className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-left hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                  <div className="text-blue-600 dark:text-blue-400 font-medium">View Usage</div>
                  <div className="text-sm text-blue-500 dark:text-blue-300 mt-1">Check your consumption</div>
                </button>
                
                <button className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg p-4 text-left hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors">
                  <div className="text-purple-600 dark:text-purple-400 font-medium">Payment History</div>
                  <div className="text-sm text-purple-500 dark:text-purple-300 mt-1">View past payments</div>
                </button>
                
                <button className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-4 text-left hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors">
                  <div className="text-orange-600 dark:text-orange-400 font-medium">Profile Settings</div>
                  <div className="text-sm text-orange-500 dark:text-orange-300 mt-1">Update your information</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
