'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-hot-toast';

// Dynamic imports
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Provider {
  id: number;
  name: string;
  pricePerMinute: number;
}

interface ChargingStation {
  id: number;
  location: string;
  providerId: number;
  providerName: string;
  latitude: number;
  longitude: number;
  provider: Provider; // ✅ Provider object'i ekleyin
}

interface FavoriteStation {
  id: number;
  chargingStationId: number;
  station: ChargingStation;
}

interface Vehicle {
  id: number;
  make: string;
  model: string;
  plateNumber: string;
  userId: number;
}

interface ChargingSession {
  id: number;
  userId: number;
  vehicleId: number;
  chargingStationId: number;
  startTime: string;
  endTime: string;
}

interface Comment {
  id: number;
  userId: number;
  chargingStationId: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

export default function StationsMapPage() {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [favorites, setFavorites] = useState<FavoriteStation[]>([]);
  const [favoriteStationIds, setFavoriteStationIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9208, 32.8541]);
  const [mapKey, setMapKey] = useState(0);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showChargingModal, setShowChargingModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [chargingFormData, setChargingFormData] = useState({
    vehicleId: '',
    startTime: '',
    endTime: '',
  });
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedStationComments, setSelectedStationComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    fetchStations();
    fetchFavorites();
    fetchUserVehicles(); // ✅ Vehicles'ları getir
    getCurrentLocation();
  }, []);

  // ✅ Component unmount'ta map'i temizle
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/chargingstation/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStations(data);
      } else {
        throw new Error('Failed to fetch stations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/favoritestation', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
        
        const favoriteIds = new Set<number>();
        data.forEach((fav: FavoriteStation) => {
          favoriteIds.add(fav.chargingStationId);
        });
        setFavoriteStationIds(favoriteIds);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const fetchUserVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/vehicle', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserVehicles(data);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  // ✅ fetchStationComments function (eksik olan)
  const fetchStationComments = async (stationId: number) => {
    try {
      setCommentLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/usercomment/station/${stationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedStationComments(data);
      } else {
        toast.error('Failed to load comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Network error while loading comments');
    } finally {
      setCommentLoading(false);
    }
  };

  

  const toggleFavorite = async (stationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const isFavorite = favoriteStationIds.has(stationId);
      const method = isFavorite ? 'DELETE' : 'POST';
      
      const response = await fetch(`http://localhost:5000/api/favoritestation/${stationId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchFavorites();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // ✅ Modal'dan favori istasyona git - Map'i reset et
  const goToFavorite = (station: ChargingStation) => {
    setMapCenter([station.latitude, station.longitude]);
    setMapKey(prev => prev + 1); // Map'i yeniden oluştur
    setShowFavoritesModal(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userCoords);
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  };

  const goToMyLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapKey(prev => prev + 1); // Map'i yeniden oluştur
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userCoords);
          setMapCenter(userCoords);
          setMapKey(prev => prev + 1);
        },
        (error) => {
          alert('Location access denied. Please enable location services.');
        }
      );
    }
  };

  const handleStartCharging = (station: ChargingStation) => {
    if (userVehicles.length === 0) {
      alert('Please add a vehicle first to start charging!');
      return;
    }
    
    setSelectedStation(station);
    setChargingFormData({
      vehicleId: '',
      startTime: '',
      endTime: '',
    });
    setShowChargingModal(true);
  };

  const handleChargingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStation) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/chargingsession', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId: parseInt(chargingFormData.vehicleId),
          chargingStationId: selectedStation.id,
          startTime: chargingFormData.startTime,
          endTime: chargingFormData.endTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Charging session created successfully! Total cost: ₺${data.invoice.amount}`);
        setShowChargingModal(false);
        setSelectedStation(null);
        setChargingFormData({ vehicleId: '', startTime: '', endTime: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create charging session');
      }
    } catch (error) {
      console.error('Error creating charging session:', error);
      alert('Error creating charging session');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStation || !newComment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    const loadingToast = toast.loading('Adding comment...');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/usercomment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chargingStationId: selectedStation.id,
          comment: newComment.trim()
        }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setSelectedStationComments(prev => [newCommentData, ...prev]);
        setNewComment('');
        
        toast.success('Comment added successfully!', {
          icon: '💬',
          duration: 3000,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Network error while adding comment');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // ❌ renderStars function'ını tamamen kaldırın

  const createCustomIcon = () => {
    if (typeof window !== 'undefined') {
      return new L.DivIcon({
        html: `
          <div style="
            background: #10b981; 
            border: 3px solid white; 
            border-radius: 50%; 
            width: 30px; 
            height: 30px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            color: white;
            font-weight: bold;
            font-size: 16px;
          ">⚡</div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
        className: 'custom-charging-icon'
      });
    }
    return undefined;
  };

  const createUserIcon = () => {
    if (typeof window !== 'undefined') {
      return new L.DivIcon({
        html: `
          <div style="
            background: #3b82f6; 
            border: 3px solid white; 
            border-radius: 50%; 
            width: 20px; 
            height: 20px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">📍</div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10],
        className: 'user-location-icon'
      });
    }
    return undefined;
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    return Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60));
  };

  const calculateCost = (startTime: string, endTime: string, pricePerMinute: number): number => {
    const duration = calculateDuration(startTime, endTime);
    return duration * pricePerMinute;
  };

  // ✅ showStationComments function (eksik olan)
  const showStationComments = (station: ChargingStation) => {
    setSelectedStation(station);
    setShowCommentsModal(true);
    fetchStationComments(station.id);
  };

  // ✅ handleDeleteComment function (eksik olan)
  const handleDeleteComment = async (commentId: number) => {
    // ✅ Basit confirm kullanın
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    
    if (!confirmed) return;

    const loadingToast = toast.loading('Deleting comment...');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/usercomment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setSelectedStationComments(prev => prev.filter(c => c.id !== commentId));
        
        toast.success('Comment deleted successfully!', {
          icon: '🗑️',
          duration: 3000,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Network error while deleting comment');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  // ✅ formatCommentDate function (eksik olan)
  const formatCommentDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentUserId = (): number => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // JWT payload'daki userId claim'i
        const userIdFromToken = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        return parseInt(userIdFromToken);
      }
    } catch (error) {
      console.error('Token parse error:', error);
    }
    
    return 0;
  };

  if (!isClient) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="h-96 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      {/* Header with buttons */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          EV Charging Stations ({stations.length} stations)
        </h3>
        
        <div className="flex gap-3">
          {/* Favorites Modal Button */}
          <button
            onClick={() => setShowFavoritesModal(true)}
            className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Favorites ({favorites.length})
          </button>

          {/* My Location Button */}
          <button
            onClick={goToMyLocation}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            disabled={!userLocation && !navigator.geolocation}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {userLocation ? 'Go to My Location' : 'Get My Location'}
          </button>
        </div>
      </div>

      {/* ✅ Map Container - Unique key ile yeniden oluşturulur */}
      <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {isClient && (
          <MapContainer
            key={`map-${mapKey}`} // ✅ Unique key
            center={mapCenter}
            zoom={userLocation && mapCenter === userLocation ? 15 : 11}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
            attributionControl={true}
            zoomControl={true}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            touchZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Charging Stations */}
            {stations.map((station) => (
              <Marker
                key={`station-${station.id}-${mapKey}`} // ✅ Unique key
                position={[station.latitude, station.longitude]}
                icon={createCustomIcon()}
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <h4 className="font-bold text-gray-900 mb-3 text-sm">
                      {station.location}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Provider:</span> {station.providerName}</p>
                      <p><span className="font-medium">Rate:</span> ₺{station.provider.pricePerMinute}/min</p>
                    </div>
                    
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => toggleFavorite(station.id)}
                        className={`flex-1 py-2 px-3 rounded-md text-xs transition-colors ${
                          favoriteStationIds.has(station.id)
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {favoriteStationIds.has(station.id) ? '⭐ Favorited' : '☆ Add Favorite'}
                      </button>
                      <button 
                        onClick={() => handleStartCharging(station)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded-md transition-colors"
                      >
                        Start Charging
                      </button>
                    </div>
                    
                    {/* ✅ Comments Button */}
                    <button
                      onClick={() => showStationComments(station)}
                      className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Comments & Reviews
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* User Location Marker */}
            {userLocation && (
              <Marker 
                key={`user-${mapKey}`} // ✅ Unique key
                position={userLocation} 
                icon={createUserIcon()}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-medium text-blue-600">📍 You are here</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}
      </div>

      {/* ✅ Start Charging Modal */}
      {showChargingModal && selectedStation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 10000 }} // ✅ Map'in üstüne çıksın
          onClick={() => setShowChargingModal(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
               onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start Charging Session
              </h3>
              <button
                onClick={() => setShowChargingModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Station Info */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{selectedStation.location}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Provider: {selectedStation.providerName}</p>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Rate: ₺{selectedStation.provider.pricePerMinute}/minute
              </p>
            </div>

            {/* Charging Form */}
            <form onSubmit={handleChargingSubmit} className="p-6">
              <div className="space-y-4">
                {/* Vehicle Selection */}
                <div>
                  <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Vehicle *
                  </label>
                  {userVehicles.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No vehicles found</p>
                      <button
                        type="button"
                        onClick={() => window.location.href = '/dashboard/my-cars'}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Add a vehicle first
                      </button>
                    </div>
                  ) : (
                    <select
                      id="vehicleId"
                      required
                      value={chargingFormData.vehicleId}
                      onChange={(e) => setChargingFormData({...chargingFormData, vehicleId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Choose a vehicle...</option>
                      {userVehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.make} {vehicle.model} ({vehicle.plateNumber})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Start Time */}
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time *
                  </label>
                  <input
                    id="startTime"
                    type="datetime-local"
                    required
                    value={chargingFormData.startTime}
                    onChange={(e) => setChargingFormData({...chargingFormData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time *
                  </label>
                  <input
                    id="endTime"
                    type="datetime-local"
                    required
                    value={chargingFormData.endTime}
                    onChange={(e) => setChargingFormData({...chargingFormData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Duration Calculation */}
                {chargingFormData.startTime && chargingFormData.endTime && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-md">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <span className="font-medium">Duration:</span> {
                        calculateDuration(chargingFormData.startTime, chargingFormData.endTime)
                      } minutes
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <span className="font-medium">Estimated Cost:</span> ₺{
                        calculateCost(
                          chargingFormData.startTime, 
                          chargingFormData.endTime, 
                          selectedStation.provider.pricePerMinute
                        ).toFixed(2)
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowChargingModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userVehicles.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Charging
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Favorites Modal */}
      {showFavoritesModal && (
        <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-sm w-80 max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700"
             style={{ zIndex: 10000 }}>
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-700 dark:to-gray-600">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
              <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              My Favorites ({favorites.length})
            </h3>
            <button
              onClick={() => setShowFavoritesModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {favorites.length === 0 ? (
              <div className="text-center py-6">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No Favorites Yet</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Add stations to see them here!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-xs mb-1 truncate">
                          {favorite.station.location}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {favorite.station.providerName}
                        </p>
                        {/* ✅ Null check ekleyin */}
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                          ₺{favorite.station.provider?.pricePerMinute || 0}/min
                        </p>
                      </div>
                      <span className="text-yellow-500 text-sm ml-2">⭐</span>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => goToFavorite(favorite.station)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        Go
                      </button>
                      <button
                        onClick={() => toggleFavorite(favorite.chargingStationId)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 px-2 rounded transition-colors flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Close Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <button
              onClick={() => setShowFavoritesModal(false)}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-1.5 px-3 rounded text-xs transition-colors"
            >
              Close
            </button>
          </div>

          {/* ✅ Popup Arrow - Sağ üst köşeden çıkıyor gibi */}
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"></div>
        </div>
      )}

      {/* ✅ Comments Modal - Rating'siz */}
      {showCommentsModal && selectedStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 10000 }}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comments & Reviews
              </h3>
              <button
                onClick={() => setShowCommentsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Station Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">{selectedStation.location}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Provider: {selectedStation.providerName}</p>
            </div>

            <div className="flex flex-col h-[60vh]">
              {/* Add Comment Form - Rating'siz */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <form onSubmit={handleAddComment} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Comment
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience with this charging station..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Add Comment
                  </button>
                </form>
              </div>

              {/* Comments List - Temiz versiyon */}
              <div className="flex-1 overflow-y-auto p-4">
                {commentLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : selectedStationComments.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No comments yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Be the first to share your experience!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedStationComments.map((comment) => (
                      <div key={comment.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                {comment.user.name}
                              </h5>
                              {/* ✅ Kendi yorumu işareti */}
                              {comment.userId === getCurrentUserId() && (
                                <span className="ml-2 text-xs text-green-600">(Your comment)</span>
                              )}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                              {comment.comment}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatCommentDate(comment.createdAt)}
                            </p>
                          </div>
                          
                          {/* ✅ Delete button - sadece kendi yorumları için */}
                          {comment.userId === getCurrentUserId() && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="ml-2 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              title="Delete comment"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}