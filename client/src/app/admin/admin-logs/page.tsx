'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface AdminLog {
  id: number;
  action: string;
  createdAt: string;
}

interface LogsResponse {
  logs: AdminLog[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const fetchLogs = async (page: number) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching logs...', { page, pageSize });
      
      const response = await fetch(`http://localhost:5000/api/admin/admin-logs?page=${page}&pageSize=${pageSize}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data: LogsResponse = await response.json();
        console.log('Logs data:', data);
        setLogs(data.logs);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error('Failed to fetch admin logs');
      }
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      toast.error('Error fetching admin logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLog = async (logId: number) => {
    if (!confirm('Are you sure you want to delete this log?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/admin-logs/${logId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Log deleted successfully');
        fetchLogs(currentPage);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete log');
      }
    } catch (error) {
      console.error('Error deleting log:', error);
      toast.error('Error deleting log');
    }
  };

  const handleClearAllLogs = async () => {
    if (!confirm('Are you sure you want to clear ALL admin logs? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/admin-logs/clear-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('All logs cleared successfully');
        setCurrentPage(1);
        fetchLogs(1);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to clear logs');
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
      toast.error('Error clearing logs');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const getActionColor = (action: string) => {
    if (action.toLowerCase().includes('deleted')) {
      return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-200';
    } else if (action.toLowerCase().includes('created')) {
      return 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-200';
    } else if (action.toLowerCase().includes('updated')) {
      return 'text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-200';
    } else {
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Admin Logları
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Admin işlemlerinin geçmişini görüntüleyin ({totalCount} toplam log)
          </p>
        </div>
        <button
          onClick={handleClearAllLogs}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Tüm Logları Temizle
        </button>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Henüz Admin Logu Yok
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Admin işlemleri yapıldıkça burada görünecek.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Sayfa <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Önceki
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}