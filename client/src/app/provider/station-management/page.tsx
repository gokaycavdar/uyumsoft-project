'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface ChargingStation {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  providerId: number;
  status: 'active' | 'maintenance' | 'offline';
  provider: {
    id: number;
    name: string;
    pricePerMinute: number;
  };
  totalEarnings?: number;
  monthlyEarnings?: number;
  totalSessions?: number;
}

interface StationFormData {
  location: string;
  latitude: string;
  longitude: string;
}

export default function StationManagementPage() {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStation, setShowAddStation] = useState(false);
  const [editingStation, setEditingStation] = useState<ChargingStation | null>(null);
  const [formData, setFormData] = useState<StationFormData>({
    location: '',
    latitude: '',
    longitude: ''
  });

  // Fetch provider's stations
  const fetchStations = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/provider/stations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStations(data);
      } else {
        toast.error('Failed to fetch stations');
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      toast.error('Network error while fetching stations');
    } finally {
      setLoading(false);
    }
  };

  // Create new station
  const handleCreateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.location || !formData.latitude || !formData.longitude) {
      toast.error('Please fill all required fields');
      return;
    }

    const loadingToast = toast.loading('Creating station...');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/provider/stations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: formData.location,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      if (response.ok) {
        const newStation = await response.json();
        setStations(prev => [...prev, newStation]);
        setShowAddStation(false);
        setFormData({ location: '', latitude: '', longitude: '' });
        
        toast.success('Station created successfully!', {
          icon: '⚡',
          duration: 3000,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create station');
      }
    } catch (error) {
      console.error('Error creating station:', error);
      toast.error('Network error while creating station');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Update station
  const handleUpdateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingStation || !formData.location || !formData.latitude || !formData.longitude) {
      toast.error('Please fill all required fields');
      return;
    }

    const loadingToast = toast.loading('Updating station...');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/provider/stations/${editingStation.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: formData.location,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      if (response.ok) {
        const updatedStation = await response.json();
        setStations(prev => prev.map(s => s.id === editingStation.id ? updatedStation : s));
        setEditingStation(null);
        setFormData({ location: '', latitude: '', longitude: '' });
        
        toast.success('Station updated successfully!', {
          icon: '✏️',
          duration: 3000,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update station');
      }
    } catch (error) {
      console.error('Error updating station:', error);
      toast.error('Network error while updating station');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Delete station
  const handleDeleteStation = async (stationId: number, stationName: string) => {
    const confirm = await new Promise((resolve) => {
      toast((t) => (
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <p className="font-medium text-gray-900">Delete "{stationName}"?</p>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        style: {
          background: 'white',
          color: 'black',
          maxWidth: '400px',
        },
      });
    });

    if (!confirm) return;

    const loadingToast = toast.loading('Deleting station...');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/provider/stations/${stationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStations(prev => prev.filter(s => s.id !== stationId));
        
        toast.success('Station deleted successfully!', {
          icon: '🗑️',
          duration: 3000,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete station');
      }
    } catch (error) {
      console.error('Error deleting station:', error);
      toast.error('Network error while deleting station');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // Start editing station
  const startEditStation = (station: ChargingStation) => {
    setEditingStation(station);
    setFormData({
      location: station.location,
      latitude: station.latitude.toString(),
      longitude: station.longitude.toString(),
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingStation(null);
    setFormData({ location: '', latitude: '', longitude: '' });
  };

  // Format earnings
  const formatEarnings = (amount?: number) => {
    return amount ? `₺${amount.toFixed(2)}` : '₺0.00';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Charging Stations</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your charging stations and monitor performance ({stations.length} stations)
          </p>
        </div>
        <button 
          onClick={() => setShowAddStation(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Station
        </button>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 gap-6">
        {stations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No charging stations</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating your first charging station.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddStation(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add your first station
              </button>
            </div>
          </div>
        ) : (
          stations.map((station) => (
            <div key={station.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mr-3">
                        {station.location}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(station.status)}`}>
                        {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Coordinates: {station.latitude.toFixed(6)}, {station.longitude.toFixed(6)}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rate</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ₺{station.provider.pricePerMinute}/min
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          {formatEarnings(station.monthlyEarnings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Earnings</p>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                          {formatEarnings(station.totalEarnings)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => startEditStation(station)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit station"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteStation(station.id, station.location)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Delete station"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Station Modal */}
      {(showAddStation || editingStation) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingStation ? 'Edit Station' : 'Add New Station'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddStation(false);
                  cancelEdit();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={editingStation ? handleUpdateStation : handleCreateStation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Station Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Armada Shopping Mall Parking"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="39.925018"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="32.854067"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddStation(false);
                    cancelEdit();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingStation ? 'Update Station' : 'Add Station'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}