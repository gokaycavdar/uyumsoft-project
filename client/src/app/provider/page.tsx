export default function ProviderDashboard() {
  const earningsData = [
    {
      period: 'Today',
      amount: '₺234.50',
      energy: '45.2 kWh',
      sessions: 12
    },
    {
      period: 'This Week',
      amount: '₺1,856.30',
      energy: '324.5 kWh',
      sessions: 87
    },
    {
      period: 'This Month',
      amount: '₺8,342.75',
      energy: '1,456.8 kWh',
      sessions: 347
    }
  ];

  const recentSessions = [
    {
      id: 1,
      customer: 'Jane Smith',
      station: 'Station A - Downtown',
      time: '14:30',
      duration: '45m',
      energy: '23.5 kWh',
      amount: '₺18.50',
      status: 'completed'
    },
    {
      id: 2,
      customer: 'Mike Johnson',
      station: 'Station B - Mall',
      time: '13:15',
      duration: '1h 20m',
      energy: '38.2 kWh',
      amount: '₺29.80',
      status: 'completed'
    },
    {
      id: 3,
      customer: 'Sarah Wilson',
      station: 'Station A - Downtown',
      time: '12:00',
      duration: '55m',
      energy: '31.8 kWh',
      amount: '₺24.20',
      status: 'completed'
    },
    {
      id: 4,
      customer: 'Alex Brown',
      station: 'Station C - Highway',
      time: 'Now',
      duration: '22m',
      energy: '15.2 kWh',
      amount: '₺12.10',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {earningsData.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.period}</h3>
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.amount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.energy} • {item.sessions} sessions</p>
            </div>
          </div>
        ))}
      </div>

      {/* Station Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Station Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">Station A - Downtown</p>
              <p className="text-xs text-green-600 dark:text-green-400">Available • 2/4 connectors</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Station B - Mall</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Busy • 4/4 connectors</p>
            </div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-100">Station C - Highway</p>
              <p className="text-xs text-green-600 dark:text-green-400">Available • 1/2 connectors</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Recent Charging Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Charging Sessions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Latest customer charging activities</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Station</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Energy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{session.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{session.station}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{session.time}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{session.duration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{session.energy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">{session.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      session.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {session.status === 'completed' ? 'Completed' : 'Active'}
                    </span>
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