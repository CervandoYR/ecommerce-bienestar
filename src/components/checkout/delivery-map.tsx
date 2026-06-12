"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

// Fix for default Leaflet markers in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface DeliveryMapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Center of Lima, Peru by default
const DEFAULT_CENTER: [number, number] = [-12.0464, -77.0428];

function LocationMarker({ onSelect }: { onSelect?: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      if (onSelect) onSelect(e.latlng.lat, e.latlng.lng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

export default function DeliveryMap({ onLocationSelect }: DeliveryMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-64 bg-warm-100 dark:bg-warm-800 rounded-xl animate-pulse flex items-center justify-center">
        <MapPin className="w-8 h-8 text-warm-300" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-warm-200 dark:border-warm-800/50 shadow-inner z-0">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={onLocationSelect} />
      </MapContainer>
      
      {/* Decorative overlay for aesthetic */}
      <div className="absolute top-4 left-4 z-[400] pointer-events-none">
        <div className="bg-white/90 dark:bg-warm-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-warm-200 dark:border-warm-800 text-xs font-medium text-warm-700 dark:text-warm-200">
          📍 Haz clic en el mapa para ubicar tu entrega
        </div>
      </div>
    </div>
  );
}
