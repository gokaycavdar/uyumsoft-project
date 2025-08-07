'use client';

import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChargingSession {
  id: number;
  userId: number;
  vehicleId: number;
  chargingStationId: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  vehicle: {
    make: string;
    model: string;
    plateNumber: string;
  };
  chargingStation: {
    id: number;
    location: string;
  };
  invoice: {
    id: number;
    amount: number;
  };
}

interface StationStats {
  stationId: number;
  stationLocation: string;
  totalSessions: number;
  totalEarnings: number;
  totalUsers: number;
  totalDuration: number;
  averageSessionValue: number;
  activeSessions: number;
}

export default function ProviderDashboard() {
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [stationStats, setStationStats] = useState<StationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [chartData, setChartData] = useState<any>(null);

  // Fetch provider sessions and stats
  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all sessions for provider's stations
      const response = await fetch('http://localhost:5000/api/provider/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
        
        // Calculate totals
        const earnings = data.reduce((sum: number, session: ChargingSession) => 
          sum + session.invoice.amount, 0);
        setTotalEarnings(earnings);
        setTotalSessions(data.length);
        
        // Calculate unique users
        const uniqueUsers = new Set(data.map((session: ChargingSession) => session.userId));
        setTotalUsers(uniqueUsers.size);
        
        // Calculate station stats
        const statsMap = new Map<number, any>();
        
        data.forEach((session: ChargingSession) => {
          const stationId = session.chargingStationId;
          
          if (!statsMap.has(stationId)) {
            statsMap.set(stationId, {
              stationId,
              stationLocation: session.chargingStation.location,
              totalSessions: 0,
              totalEarnings: 0,
              userIds: new Set(),
              totalDuration: 0,
              activeSessions: 0,
            });
          }
          
          const stats = statsMap.get(stationId);
          stats.totalSessions++;
          stats.totalEarnings += session.invoice.amount;
          stats.userIds.add(session.userId);
          stats.totalDuration += session.durationMinutes;
          
          // Check if session is active (ended in last 2 hours)
          const endTime = new Date(session.endTime);
          const now = new Date();
          const diffHours = (now.getTime() - endTime.getTime()) / (1000 * 60 * 60);
          if (diffHours <= 2) {
            stats.activeSessions++;
          }
        });
        
        const stationStatsArray = Array.from(statsMap.values()).map(stats => ({
          ...stats,
          totalUsers: stats.userIds.size,
          averageSessionValue: stats.totalEarnings / stats.totalSessions,
        }));
        
        setStationStats(stationStatsArray);
        
        // Prepare chart data
        const dailyEarnings = calculateDailyEarnings(data);
        setChartData(dailyEarnings);
      }
    } catch (error) {
      console.error('Error fetching provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate daily earnings for chart
  const calculateDailyEarnings = (sessions: ChargingSession[]) => {
    const dailyMap = new Map<string, number>();
    
    sessions.forEach(session => {
      const date = new Date(session.startTime).toISOString().split('T')[0];
      dailyMap.set(date, (dailyMap.get(date) || 0) + session.invoice.amount);
    });
    
    const sortedDates = Array.from(dailyMap.keys()).sort();
    const last7Days = sortedDates.slice(-7);
    
    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })),
      datasets: [
        {
          label: 'Daily Earnings (₺)',
          data: last7Days.map(date => dailyMap.get(date) || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Earnings (Last 7 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '₺' + value.toFixed(2);
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg mb-6"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</h3>
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₺{totalEarnings.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{totalSessions} sessions</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Unique customers</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Session</h3>
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₺{totalSessions > 0 ? (totalEarnings / totalSessions).toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Per session</p>
          </div>
        </div>
      </div>

      {/* Daily Earnings Chart */}
      {chartData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Station Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Station Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stationStats.map((station) => (
            <div key={station.stationId} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {station.stationLocation}
                </h4>
                <div className={`w-3 h-3 rounded-full ${
                  station.activeSessions > 0 ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Earnings:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    ₺{station.totalEarnings.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Sessions:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {station.totalSessions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Users:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {station.totalUsers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Avg. Value:</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    ₺{station.averageSessionValue.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Charging Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Charging Sessions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest customer activities at your stations</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Station</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Earnings</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sessions.slice(0, 10).map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {session.user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {session.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {session.vehicle.make} {session.vehicle.model}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {session.vehicle.plateNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {session.chargingStation.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(session.startTime)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDuration(session.durationMinutes)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">
                      ₺{session.invoice.amount.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}