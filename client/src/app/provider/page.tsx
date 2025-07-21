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

export default function ProviderDashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is provider
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (!token || userRole !== 'provider') {
      router.push('/login');
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
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">EnerjiMetre Provider</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Provider: {userInfo?.firstName || 'Provider'}
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
                Provider Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your energy services, pricing, and customer relationships.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Active Customers */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Active Customers
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        156
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Monthly Revenue
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        ₺24,560
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy Supplied */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Energy Supplied (kWh)
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        12,847
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Rating */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Service Rating
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        4.8/5
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Pricing */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Pricing</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price per kWh</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">₺0.85</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">Edit</button>
                  </div>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price per Minute</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">₺0.12</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">Edit</button>
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
                  <div className="text-green-600 dark:text-green-400 font-medium">Update Pricing</div>
                  <div className="text-sm text-green-500 dark:text-green-300 mt-1">Modify your rates</div>
                </button>
                
                <button className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-left hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                  <div className="text-blue-600 dark:text-blue-400 font-medium">Customer List</div>
                  <div className="text-sm text-blue-500 dark:text-blue-300 mt-1">View all customers</div>
                </button>
                
                <button className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg p-4 text-left hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors">
                  <div className="text-purple-600 dark:text-purple-400 font-medium">Reports</div>
                  <div className="text-sm text-purple-500 dark:text-purple-300 mt-1">Revenue and usage reports</div>
                </button>
                
                <button className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg p-4 text-left hover:bg-orange-100 dark:hover:bg-orange-800 transition-colors">
                  <div className="text-orange-600 dark:text-orange-400 font-medium">Profile Settings</div>
                  <div className="text-sm text-orange-500 dark:text-orange-300 mt-1">Update company info</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
