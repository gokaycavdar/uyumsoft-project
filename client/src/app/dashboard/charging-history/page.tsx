'use client';

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
  vehicleInfo: string;
  stationLocation: string;
  invoice: {
    id: number;
    amount: number;
    chargingSessionId: number;
  };
}

export default function ChargingHistoryPage() {
  const [chargingSessions, setChargingSessions] = useState<ChargingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [monthlyData, setMonthlyData] = useState<any>(null);

  // Fetch charging sessions
  const fetchChargingSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/chargingsession', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChargingSessions(data);
        
        // Calculate total expense
        const total = data.reduce((sum: number, session: ChargingSession) => 
          sum + session.invoice.amount, 0);
        setTotalExpense(total);

        // Prepare monthly data for chart
        const monthlyExpenses = calculateMonthlyExpenses(data);
        setMonthlyData(monthlyExpenses);
      }
    } catch (error) {
      console.error('Error fetching charging sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate monthly expenses for chart
  const calculateMonthlyExpenses = (sessions: ChargingSession[]) => {
    const monthlyTotals: { [key: string]: number } = {};
    
    sessions.forEach(session => {
      const date = new Date(session.startTime);
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = 0;
      }
      monthlyTotals[monthKey] += session.invoice.amount;
    });

    const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    );

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Monthly Charging Expenses (₺)',
          data: sortedMonths.map(month => monthlyTotals[month]),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };
  };

  // Delete charging session
  const deleteChargingSession = async (sessionId: number) => {
    if (!confirm('Are you sure you want to delete this charging session?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/chargingsession/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove from local state
        setChargingSessions(prev => prev.filter(session => session.id !== sessionId));
        
        // Recalculate totals
        const updatedSessions = chargingSessions.filter(session => session.id !== sessionId);
        const newTotal = updatedSessions.reduce((sum, session) => sum + session.invoice.amount, 0);
        setTotalExpense(newTotal);
        
        // Update chart data
        const newMonthlyData = calculateMonthlyExpenses(updatedSessions);
        setMonthlyData(newMonthlyData);
        
        alert('Charging session deleted successfully!');
      } else {
        alert('Failed to delete charging session');
      }
    } catch (error) {
      console.error('Error deleting charging session:', error);
      alert('Error deleting charging session');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  useEffect(() => {
    fetchChargingSessions();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Charging Expenses',
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Total Expense */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Charging History
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track your charging sessions and expenses
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              ₺{totalExpense.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {chargingSessions.length} sessions
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      {monthlyData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="h-80">
            <Bar data={monthlyData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Charging Sessions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Sessions
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your complete charging history
          </p>
        </div>
        
        <div className="p-6">
          {chargingSessions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No charging sessions</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Start charging to see your history here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chargingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {session.stationLocation}
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {session.vehicleInfo}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(session.startTime)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {formatDuration(session.durationMinutes)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        ₺{session.invoice.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Invoice #{session.invoice.id}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteChargingSession(session.id)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete session"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}