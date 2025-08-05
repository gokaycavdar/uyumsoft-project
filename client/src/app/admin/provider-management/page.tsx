'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Provider {
  id: number;
  name: string;
  contactInfo: string;
  pricePerMinute: number;
  userId: number;
  user: {
    fullName: string;
    email: string;
  };
}

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface CreateProviderForm {
  name: string;
  contactInfo: string;
  pricePerMinute: string;
  userId: string;
}

interface UpdateProviderForm {
  name: string;
  contactInfo: string;
  pricePerMinute: string;
  userId: string;
}

export default function ProviderManagement() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateProviderForm>({
    name: '',
    contactInfo: '',
    pricePerMinute: '',
    userId: ''
  });

  const [updateForm, setUpdateForm] = useState<UpdateProviderForm>({
    name: '',
    contactInfo: '',
    pricePerMinute: '',
    userId: ''
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/providers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProviders(data);
      } else {
        toast.error('Failed to fetch providers');
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Error fetching providers');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviderUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/provider-users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching provider users:', error);
    }
  };

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/providers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createForm.name,
          contactInfo: createForm.contactInfo,
          pricePerMinute: parseFloat(createForm.pricePerMinute),
          userId: parseInt(createForm.userId)
        }),
      });

      if (response.ok) {
        toast.success('Provider created successfully');
        setShowCreateModal(false);
        setCreateForm({ name: '', contactInfo: '', pricePerMinute: '', userId: '' });
        fetchProviders();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create provider');
      }
    } catch (error) {
      console.error('Error creating provider:', error);
      toast.error('Error creating provider');
    }
  };

  const handleUpdateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProvider) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/providers/${editingProvider.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updateForm.name,
          contactInfo: updateForm.contactInfo,
          pricePerMinute: parseFloat(updateForm.pricePerMinute),
          userId: parseInt(updateForm.userId)
        }),
      });

      if (response.ok) {
        toast.success('Provider updated successfully');
        setShowEditModal(false);
        setEditingProvider(null);
        fetchProviders();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update provider');
      }
    } catch (error) {
      console.error('Error updating provider:', error);
      toast.error('Error updating provider');
    }
  };

  const handleDeleteProvider = async (providerId: number, name: string) => {
    if (!confirm(`Are you sure you want to delete provider: ${name}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/providers/${providerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Provider deleted successfully');
        fetchProviders();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete provider');
      }
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error('Error deleting provider');
    }
  };

  const openCreateModal = () => {
    fetchProviderUsers();
    setShowCreateModal(true);
  };

  const openEditModal = (provider: Provider) => {
    setEditingProvider(provider);
    setUpdateForm({
      name: provider.name,
      contactInfo: provider.contactInfo,
      pricePerMinute: provider.pricePerMinute.toString(),
      userId: provider.userId.toString()
    });
    fetchProviderUsers(); // Kullanıcı listesini yenile
    setShowEditModal(true);
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
            Provider Yönetimi
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Şarj istasyonu sağlayıcılarını yönetin
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Provider
        </button>
      </div>

      {/* Providers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {providers.map((provider) => (
                <tr key={provider.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {provider.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {provider.contactInfo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                      ₺{provider.pricePerMinute}/dk
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {provider.user.fullName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {provider.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(provider)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteProvider(provider.id, provider.name)}
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

      {/* Create Provider Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Yeni Provider Ekle
            </h4>
            <form onSubmit={handleCreateProvider} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: ABC Şarj Hizmetleri"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  İletişim Bilgisi
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: +90 312 123 45 67"
                  value={createForm.contactInfo}
                  onChange={(e) => setCreateForm({...createForm, contactInfo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dakika Başı Fiyat (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="örn: 2.50"
                  value={createForm.pricePerMinute}
                  onChange={(e) => setCreateForm({...createForm, pricePerMinute: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kullanıcı
                </label>
                <select
                  required
                  value={createForm.userId}
                  onChange={(e) => setCreateForm({...createForm, userId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Provider Kullanıcısı Seçin</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
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

      {/* Edit Provider Modal */}
      {showEditModal && editingProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Provider Düzenle
            </h4>
            <form onSubmit={handleUpdateProvider} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Provider Adı
                </label>
                <input
                  type="text"
                  required
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  İletişim Bilgisi
                </label>
                <input
                  type="text"
                  required
                  value={updateForm.contactInfo}
                  onChange={(e) => setUpdateForm({...updateForm, contactInfo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dakika Başı Fiyat (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={updateForm.pricePerMinute}
                  onChange={(e) => setUpdateForm({...updateForm, pricePerMinute: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kullanıcı
                </label>
                <select
                  required
                  value={updateForm.userId}
                  onChange={(e) => setUpdateForm({...updateForm, userId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Provider Kullanıcısı Seçin</option>
                  {/* Mevcut kullanıcıyı da dahil et */}
                  <option value={editingProvider.userId}>
                    {editingProvider.user.fullName} ({editingProvider.user.email}) - Mevcut
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
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