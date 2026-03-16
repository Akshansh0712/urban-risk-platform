"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { DEFAULT_CENTER } from "@/lib/map-config";

export default function HeroMap() {
  const [zoom, setZoom] = useState(11);

  /* subtle zoom animation to mimic cinematic motion */
  useEffect(() => {
    const interval = setInterval(() => {
      setZoom((z) => (z >= 13 ? 11 : z + 0.002));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={zoom}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
    >
      {/* OpenStreetMap tiles */}
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}