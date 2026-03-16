"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { fetchRiskHeatmap, fetchCameraList } from "@/lib/api";
import type { HeatmapZone, CameraStats } from "@/lib/types";

import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  RISK_COLORS,
} from "@/lib/map-config";

/* Fix Leaflet marker icon issue in Next.js */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function HeatmapLayer() {
  const [zones, setZones] = useState<HeatmapZone[]>([]);
  const [cameras, setCameras] = useState<CameraStats[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [heatmap, camList] = await Promise.all([
          fetchRiskHeatmap(),
          fetchCameraList(),
        ]);

        setZones(heatmap.zones);
        setCameras(camList.cameras);
      } catch (err) {
        console.error("Map data load failed:", err);
      }
    };

    loadData();

    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: "100%", width: "100%" }}
      className="rounded-xl overflow-hidden"
    >
      {/* OpenStreetMap tiles */}
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Risk heat zones */}
      {zones.map((zone) => (
        <Circle
          key={zone.zone_id}
          center={[zone.lat, zone.lon]}
          radius={zone.radius || 200}
          pathOptions={{
            color: RISK_COLORS[zone.risk_level],
            fillColor: RISK_COLORS[zone.risk_level],
            fillOpacity: 0.25,
          }}
        >
          <Popup>
            <div
              style={{
                background: "#141A2F",
                color: "#F1F5F9",
                padding: "8px 12px",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "11px",
              }}
            >
              <strong>{zone.zone_name}</strong>
              <br />
              Risk Level:{" "}
              <span style={{ color: RISK_COLORS[zone.risk_level] }}>
                {zone.risk_level}
              </span>
              <br />
              Score: {(zone.risk_score * 100).toFixed(0)}%
            </div>
          </Popup>
        </Circle>
      ))}

      {/* Camera markers */}
      {cameras.map((cam) => (
        <Marker key={cam.camera_id} position={[cam.lat, cam.lon]}>
          <Popup>
            <div
              style={{
                background: "#141A2F",
                color: "#F1F5F9",
                padding: "8px 12px",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "11px",
                minWidth: "140px",
              }}
            >
              <strong style={{ fontSize: "12px" }}>{cam.name}</strong>
              <br />
              👤 Persons: {cam.person_count}
              <br />
              🚗 Vehicles: {cam.vehicle_count}
              <br />
              📊 Density: {(cam.crowd_density * 100).toFixed(0)}%
              <br />
              <span style={{ color: RISK_COLORS[cam.risk_level] }}>
                {cam.risk_level}
              </span>
              <br />
              🟢 Status: {cam.is_online ? "Online" : "Offline"}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}