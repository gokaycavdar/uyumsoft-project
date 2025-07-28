export default function ChargingHistoryPage() {
  const chargingSessions = [
    {
      id: 1,
      station: 'Station A - Downtown',
      date: 'January 15, 2025',
      time: '2:30 PM',
      energy: '45 kWh',
      cost: '₺32.50',
      duration: '1h 20m'
    },
    {
      id: 2,
      station: 'Station B - Mall',
      date: 'January 12, 2025',
      time: '6:15 PM',
      energy: '38 kWh',
      cost: '₺27.20',
      duration: '55m'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Your Charging Sessions
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View your complete charging history and expenses
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {chargingSessions.map((session) => (
            <div key={session.id} className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {session.station}
                </h4>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{session.date}</span>
                  <span>•</span>
                  <span>{session.time}</span>
                  <span>•</span>
                  <span>{session.duration}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  {session.energy}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {session.cost}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}