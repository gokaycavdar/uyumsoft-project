'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface ChargingStation {
  id: number;
  location: string;
  providerId: number;
  providerName: string;
  latitude: number;
  longitude: number;
  rate: number;
}

interface FavoriteStation {
  id: number;
  chargingStationId: number;
  station: ChargingStation;
}

export default function StationsMapPage() {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [favorites, setFavorites] = useState<FavoriteStation[]>([]);
  const [favoriteStationIds, setFavoriteStationIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9208, 32.8541]); // ✅ Map center state
  const [mapKey, setMapKey] = useState(0); // ✅ Map re-render için key
  const [showFavorites, setShowFavorites] = useState(false); // ✅ Favorites modal

  // ✅ Map ref
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    fetchStations();
    fetchFavorites();
    getCurrentLocation();
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

  // ✅ Favorileri getir
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
        
        // ✅ Set oluşturma şeklini değiştir
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

  // ✅ Favori ekle/kaldır
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
        // Favorileri yeniden getir
        await fetchFavorites();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // ✅ Favoriye git
  const goToFavorite = (station: ChargingStation) => {
    setMapCenter([station.latitude, station.longitude]);
    setMapKey(prev => prev + 1);
    setShowFavorites(false);
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

  // ✅ Map'i kullanıcı konumuna götür
  const goToMyLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      setMapKey(prev => prev + 1); // Map'i yeniden render et
    } else {
      // Konum yoksa tekrar iste
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

  // Custom charging icon
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

  // ✅ User location icon
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
      {/* Header with My Location Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          EV Charging Stations ({stations.length} stations)
        </h3>
        
        {/* ✅ My Location Button */}
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

      {/* Map Container - relative position for popup */}
      <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {isClient && (
          <MapContainer
            key={mapKey}
            center={mapCenter}
            zoom={userLocation && mapCenter === userLocation ? 15 : 11}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Charging Stations */}
            {stations.map((station) => (
              <Marker
                key={station.id}
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
                      <p><span className="font-medium">Rate:</span> ₺{station.rate}/min</p>
                    </div>
                    
                    {/* ✅ Favorite Button */}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => toggleFavorite(station.id)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm transition-colors ${
                          favoriteStationIds.has(station.id)
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {favoriteStationIds.has(station.id) ? '⭐ Favorited' : '☆ Add Favorite'}
                      </button>
                      <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded-md transition-colors">
                        Start Charging
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* ✅ User Location Marker */}
            {userLocation && (
              <Marker position={userLocation} icon={createUserIcon()}>
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

        {/* ✅ Favorites Popup Panel - Map'in üzerinde - Z-index artırıldı */}
        {showFavorites && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-h-96 overflow-hidden"
               style={{ zIndex: 1000 }}> {/* ✅ Inline style ile zorla */}
            {/* Panel Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  ⭐ My Favorites ({favorites.length})
                </h3>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Panel Content */}
            <div className="max-h-80 overflow-y-auto">
              {favorites.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No favorite stations yet. Add some from the map!
                  </p>
                </div>
              ) : (
                <div className="p-2">
                  {favorites.map((favorite) => (
                    <div
                      key={favorite.id}
                      className="p-3 mb-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
                        {favorite.station.location}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {favorite.station.providerName} • ₺{favorite.station.rate}/min
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => goToFavorite(favorite.station)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1.5 px-2 rounded transition-colors"
                        >
                          📍 Go
                        </button>
                        <button
                          onClick={() => toggleFavorite(favorite.chargingStationId)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 px-2 rounded transition-colors"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Alt Özellikler */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔋 Energy Monitor</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your charging history and consumption
          </p>
        </div>
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">💰 Payment & Billing</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your payments and view invoices
          </p>
        </div>
        
        {/* ✅ Favorites Trigger Button */}
        <div 
          onClick={() => setShowFavorites(!showFavorites)}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            ⭐ Favorites ({favorites.length})
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {showFavorites ? 'Click to hide favorites' : 'Click to view your favorite stations'}
          </p>
        </div>
      </div>
    </div>
  );
}