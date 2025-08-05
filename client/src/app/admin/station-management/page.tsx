'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Station {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  providerId: number;
  provider: {
    name: string;
    pricePerMinute: number;
    ownerName: string;
  };
}

interface Provider {
  id: number;
  name: string;
  ownerName: string;
  pricePerMinute: number;
}

interface CreateStationForm {
  location: string;
  latitude: string;
  longitude: string;
  providerId: string;
}

interface UpdateStationForm {
  location: string;
  latitude: string;
  longitude: string;
  providerId: string;
}

export default function StationManagement() {
  const [stations, setStations] = useState<Station[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateStationForm>({
    location: '',
    latitude: '',
    longitude: '',
    providerId: ''
  });

  const [updateForm, setUpdateForm] = useState<UpdateStationForm>({
    location: '',
    latitude: '',
    longitude: '',
    providerId: ''
  });

  useEffect(() => {
    fetchStations();
    fetchProviders();
  }, []);

  const fetchStations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/stations', {
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
      toast.error('Error fetching stations');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/providers-dropdown', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProviders(data);
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleCreateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/stations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: createForm.location,
          latitude: parseFloat(createForm.latitude),
          longitude: parseFloat(createForm.longitude),
          providerId: parseInt(createForm.providerId)
        }),
      });

      if (response.ok) {
        toast.success('Station created successfully');
        setShowCreateModal(false);
        setCreateForm({ location: '', latitude: '', longitude: '', providerId: '' });
        fetchStations();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create station');
      }
    } catch (error) {
      console.error('Error creating station:', error);
      toast.error('Error creating station');
    }
  };

  const handleUpdateStation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingStation) return;

    try {
      const token = localStorage.getItem('token');
      
      // Sadece değişen alanları gönder
      const updateData: any = {};
      if (updateForm.location !== editingStation.location) updateData.location = updateForm.location;
      if (parseFloat(updateForm.latitude) !== editingStation.latitude) updateData.latitude = parseFloat(updateForm.latitude);
      if (parseFloat(updateForm.longitude) !== editingStation.longitude) updateData.longitude = parseFloat(updateForm.longitude);
      if (parseInt(updateForm.providerId) !== editingStation.providerId) updateData.providerId = parseInt(updateForm.providerId);

      const response = await fetch(`http://localhost:5000/api/admin/stations/${editingStation.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        toast.success('Station updated successfully');
        setShowEditModal(false);
        setEditingStation(null);
        fetchStations();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update station');
      }
    } catch (error) {
      console.error('Error updating station:', error);
      toast.error('Error updating station');
    }
  };

  const handleDeleteStation = async (stationId: number, location: string) => {
    if (!confirm(`Are you sure you want to delete station at ${location}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/stations/${stationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Station deleted successfully');
        fetchStations();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete station');
      }
    } catch (error) {
      console.error('Error deleting station:', error);
      toast.error('Error deleting station');
    }
  };

  const openEditModal = (station: Station) => {
    setEditingStation(station);
    setUpdateForm({
      location: station.location,
      latitude: station.latitude?.toString() || '', // Null check ekledik
      longitude: station.longitude?.toString() || '', // Null check ekledik
      providerId: station.providerId?.toString() || '' // Null check ekledik
    });
    setShowEditModal(true);
  };

  const openLocationInMaps = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  // Create modal açılırken provider listesini yenile
  const openCreateModal = () => {
    fetchProviders(); // Provider listesini yenile
    setShowCreateModal(true);
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
            İstasyon Yönetimi
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Şarj istasyonlarını yönetin
          </p>
        </div>
        <button
          onClick={openCreateModal} // setShowCreateModal yerine openCreateModal kullan
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni İstasyon
        </button>
      </div>

      {/* Stations Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Lokasyon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Koordinatlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {station.location}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {station.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      Lat: {station.latitude.toFixed(4)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Lng: {station.longitude.toFixed(4)}
                    </div>
                    <button
                      onClick={() => openLocationInMaps(station.latitude, station.longitude)}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      🗺️ Haritada Aç
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {station.provider.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Sahibi: {station.provider.ownerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                      ₺{station.provider.pricePerMinute}/dk
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(station)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteStation(station.id, station.location)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Station Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Yeni İstasyon Ekle
            </h4>
            <form onSubmit={handleCreateStation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lokasyon
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: Ankara Kızılay"
                  value={createForm.location}
                  onChange={(e) => setCreateForm({...createForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enlem (Latitude)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="39.9208"
                    value={createForm.latitude}
                    onChange={(e) => setCreateForm({...createForm, latitude: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Boylam (Longitude)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="32.8541"
                    value={createForm.longitude}
                    onChange={(e) => setCreateForm({...createForm, longitude: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider
                </label>
                <select
                  required
                  value={createForm.providerId}
                  onChange={(e) => setCreateForm({...createForm, providerId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Provider Seçin</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} - {provider.ownerName} (₺{provider.pricePerMinute}/dk)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                >
                  Oluştur
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Station Modal */}
      {showEditModal && editingStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              İstasyon Düzenle: {editingStation.location}
            </h4>
            <form onSubmit={handleUpdateStation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lokasyon
                </label>
                <input
                  type="text"
                  value={updateForm.location}
                  onChange={(e) => setUpdateForm({...updateForm, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enlem (Latitude)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={updateForm.latitude}
                    onChange={(e) => setUpdateForm({...updateForm, latitude: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Boylam (Longitude)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={updateForm.longitude}
                    onChange={(e) => setUpdateForm({...updateForm, longitude: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider
                </label>
                <select
                  value={updateForm.providerId}
                  onChange={(e) => setUpdateForm({...updateForm, providerId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                >
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} - {provider.ownerName} (₺{provider.pricePerMinute}/dk)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                >
                  Güncelle
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}