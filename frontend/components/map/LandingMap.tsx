"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { OSM_TILE_URL, DEFAULT_CENTER } from "@/lib/map-config";

export default function LandingMap() {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;

    const map = L.map(ref.current, {
      center: DEFAULT_CENTER,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      keyboard: false,
    });

    mapRef.current = map;

    L.tileLayer(OSM_TILE_URL, {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Apply dark tile filter
    const pane = map
      .getContainer()
      .querySelector(".leaflet-tile-pane") as HTMLElement | null;

    if (pane) {
      pane.style.filter =
        "brightness(0.55) saturate(0.2) hue-rotate(200deg)";
    }

    // Slow cinematic pan animation
    let angle = 0;

    const id = setInterval(() => {
      const center = map.getCenter();
      angle += 0.0003;

      map.panTo(
        [
          center.lat + Math.sin(angle) * 0.0001,
          center.lng + Math.cos(angle) * 0.0001,
        ],
        { animate: false }
      );
    }, 100);

    return () => {
      clearInterval(id);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={ref} className="w-full h-full" />;
}