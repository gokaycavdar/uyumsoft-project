'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  plateNumber: string;
  userId: number;
}

export default function MyCarsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    plateNumber: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/vehicle', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      } else {
        toast.error('Failed to fetch vehicles');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Error fetching vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingVehicle 
        ? `http://localhost:5000/api/vehicle/${editingVehicle.id}`
        : 'http://localhost:5000/api/vehicle';
      
      const method = editingVehicle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingVehicle ? 'Vehicle updated successfully!' : 'Vehicle added successfully!');
        closeModal();
        fetchVehicles();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Operation failed. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/vehicle/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Vehicle deleted successfully!');
        fetchVehicles();
      } else {
        toast.error('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Error deleting vehicle');
    }
  };

  const openCreateModal = () => {
    setEditingVehicle(null);
    setFormData({ make: '', model: '', plateNumber: '' });
    setShowModal(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      plateNumber: vehicle.plateNumber,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    setFormData({ make: '', model: '', plateNumber: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Cars</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your registered vehicles</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vehicle
        </button>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No vehicles registered</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Start by adding your first vehicle to manage your EV charging sessions.</p>
          <button
            onClick={openCreateModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              {/* Vehicle Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4 mx-auto">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              
              {/* Vehicle Info */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Plate: <span className="font-mono font-medium">{vehicle.plateNumber}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(vehicle)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md text-sm transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
               onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Make *
                  </label>
                  <input
                    id="make"
                    name="make"
                    type="text"
                    required
                    value={formData.make}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Tesla, BMW, Audi"
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Model *
                  </label>
                  <input
                    id="model"
                    name="model"
                    type="text"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Model 3, i4, e-tron"
                  />
                </div>

                <div>
                  <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plate Number *
                  </label>
                  <input
                    id="plateNumber"
                    name="plateNumber"
                    type="text"
                    required
                    value={formData.plateNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., 34 ABC 123"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}