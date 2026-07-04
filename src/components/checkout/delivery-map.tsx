"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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
  district?: string;
  address?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Center of Lima, Peru by default
const DEFAULT_CENTER: [number, number] = [-12.0464, -77.0428];

const LIMA_DISTRICTS_COORDS: Record<string, [number, number]> = {
  "miraflores": [-12.1211, -77.0297],
  "san isidro": [-12.0975, -77.0365],
  "surco": [-12.1467, -77.0069],
  "santiago de surco": [-12.1467, -77.0069],
  "san borja": [-12.1077, -77.0006],
  "la molina": [-12.0850, -76.9417],
  "barranco": [-12.1494, -77.0208],
  "pueblo libre": [-12.0768, -77.0631],
  "jesus maria": [-12.0747, -77.0483],
  "magdalena": [-12.0911, -77.0694],
  "magdalena del mar": [-12.0911, -77.0694],
  "san miguel": [-12.0772, -77.0864],
  "lince": [-12.0847, -77.0353],
  "surquillo": [-12.1133, -77.0175],
  "san juan de miraflores": [-12.1628, -76.9631],
  "sjm": [-12.1628, -76.9631],
  "chorrillos": [-12.1794, -77.0128],
  "cercado de lima": [-12.0464, -77.0428],
  "lima": [-12.0464, -77.0428],
  "la victoria": [-12.0656, -77.0289],
  "ate": [-12.0264, -76.9158],
  "santa anita": [-12.0433, -76.9711],
  "san martin de porres": [-12.0056, -77.0708],
  "smp": [-12.0056, -77.0708],
  "los olivos": [-11.9767, -77.0739],
  "comas": [-11.9333, -77.0450],
  "puente piedra": [-11.8656, -77.0756],
  "callao": [-12.0566, -77.1181],
};

function MapController({ 
  district, 
  address, 
  position, 
  setPosition, 
  onSelect 
}: { 
  district?: string; 
  address?: string; 
  position: L.LatLng | null;
  setPosition: (pos: L.LatLng | null) => void;
  onSelect?: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  const lastQueryRef = useRef<string>("");

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom(), { duration: 0.8 });
      if (onSelect) onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (!district && !address) return;

    const queryKey = `${district || ""}-${address || ""}`.toLowerCase().trim();
    if (queryKey === lastQueryRef.current) return;
    lastQueryRef.current = queryKey;

    const districtKey = (district || "").toLowerCase().trim();
    
    // Check quick dictionary match first for instant feedback
    if (districtKey && LIMA_DISTRICTS_COORDS[districtKey]) {
      const coords = LIMA_DISTRICTS_COORDS[districtKey];
      const latlng = new L.LatLng(coords[0], coords[1]);
      setPosition(latlng);
      map.flyTo(latlng, 14, { duration: 1 });
      if (onSelect) onSelect(coords[0], coords[1]);
    }

    // Try Nominatim geocoding for greater precision if address is provided
    if (address && address.length > 4) {
      const searchQuery = encodeURIComponent(`${address}, ${district || "Lima"}, Peru`);
      fetch(`https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            const latlng = new L.LatLng(lat, lon);
            setPosition(latlng);
            map.flyTo(latlng, 16, { duration: 1.2 });
            if (onSelect) onSelect(lat, lon);
          }
        })
        .catch(() => {
          // Fallback silently to district coords
        });
    }
  }, [district, address, map, setPosition, onSelect]);

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

export default function DeliveryMap({ district, address, onLocationSelect }: DeliveryMapProps) {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<L.LatLng | null>(null);

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
    <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-warm-200 shadow-inner z-0 group">
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
        <MapController 
          district={district} 
          address={address} 
          position={position}
          setPosition={setPosition}
          onSelect={onLocationSelect} 
        />
      </MapContainer>
      
      {/* Decorative overlay badge */}
      <div className="absolute top-4 left-4 z-[400] pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-warm-200 text-xs font-bold text-[#2C402E] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>📍 {position ? "Ubicación fijada (hace clic en el mapa para ajustar)" : "Haz clic en el mapa para ubicar tu entrega"}</span>
        </div>
      </div>
    </div>
  );
}
