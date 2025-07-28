export default function StationsMapPage() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Find EV Charging Stations
      </h3>
      <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          🗺️ Interactive Map Component Will Be Here
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">📍 Nearby Stations</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Find charging stations near you</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">⚡ Fast Charging</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Filter by charging speed</p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔄 Real-time Status</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Check availability now</p>
        </div>
      </div>
    </div>
  );
}