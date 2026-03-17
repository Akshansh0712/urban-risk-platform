"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  OSM_TILE_URL,
  OSM_ATTRIBUTION,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  RISK_COLORS,
} from "@/lib/map-config";

import { fetchRiskHeatmap, fetchCameraList } from "@/lib/api";
import type { HeatmapZone, CameraStats } from "@/lib/types";

/* Fix Leaflet default marker icons */
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

/* Custom camera icon */
function cameraIcon(level: "HIGH" | "MEDIUM" | "SAFE") {
  const color = RISK_COLORS[level];

  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;background:${color};
      border:2.5px solid white;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:13px;box-shadow:0 0 10px ${color}80;
      cursor:pointer;">📷</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

/* Dark tile filter */
function DarkTileFilter() {
  const map = useMap();

  useEffect(() => {
    map
      .getContainer()
      .querySelector(".leaflet-tile-pane")
      ?.setAttribute(
        "style",
        "filter: brightness(0.65) saturate(0.3) hue-rotate(195deg)"
      );
  }, [map]);

  return null;
}

export default function RiskMapLeaflet() {
  const [zones, setZones] = useState<HeatmapZone[]>([]);
  const [cameras, setCameras] = useState<CameraStats[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [heat, cams] = await Promise.all([
        fetchRiskHeatmap(),
        fetchCameraList(),
      ]);

      setZones(heat.zones);
      setCameras(cams.cameras);
      setLoading(false);
    } catch (err) {
      console.error("Map data failed:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fixLeafletIcons();
    loadData();

    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div className="w-full h-full bg-panel border border-border rounded-xl flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-text-muted font-mono text-xs animate-pulse">
            Loading map...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border relative">

      {/* Legend */}
      <div className="absolute top-3 right-3 z-[999] bg-panel/95 backdrop-blur border border-border rounded-lg p-2.5 text-[10px] font-mono space-y-1.5">
        {(["HIGH", "MEDIUM", "SAFE"] as const).map((l) => (
          <div key={l} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: RISK_COLORS[l] }}
            />
            <span className="text-text-secondary">{l}</span>
          </div>
        ))}
      </div>

      {/* Refresh indicator */}
      <div className="absolute bottom-3 left-3 z-[999] bg-panel/90 border border-border rounded px-2 py-1 text-[9px] font-mono text-text-muted">
        OSM · refreshes every 60s
      </div>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: "100%", height: "100%", background: "#0B0F1A" }}
        zoomControl={false}
        attributionControl={false}
      >
        <DarkTileFilter />

        <TileLayer
          url={OSM_TILE_URL}
          attribution={OSM_ATTRIBUTION}
        />

        {/* Risk zones */}
        {zones.map((z) => {
          const color = RISK_COLORS[z.risk_level];
          const radius = z.radius ?? (500 + z.risk_score * 800);

          return (
            <Circle
              key={z.zone_id}
              center={[z.lat, z.lon]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.15 + z.risk_score * 0.25,
                weight: 1.5,
                opacity: 0.6,
              }}
            >
              <Popup>
                <div className="bg-panel rounded-lg p-3 min-w-[160px]">
                  <p className="text-sm font-semibold text-text-primary font-mono">
                    {z.zone_name}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />

                    <span className="text-xs text-text-secondary">
                      {z.risk_level}
                    </span>

                    <span className="text-xs text-text-muted ml-auto">
                      {(z.risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </Popup>
            </Circle>
          );
        })}

        {/* Camera markers */}
        {cameras.map((cam) => (
          <Marker
            key={cam.camera_id}
            position={[cam.lat, cam.lon]}
            icon={cameraIcon(cam.risk_level)}
          >
            <Popup>
              <div className="bg-panel rounded-lg p-3 min-w-[180px]">
                <p className="text-sm font-semibold text-text-primary">
                  {cam.name}
                </p>

                <p className="text-[10px] text-text-muted font-mono mb-2">
                  {cam.camera_id}
                </p>

                <div className="grid grid-cols-3 gap-1 text-center">
                  {[
                    { l: "Persons", v: cam.person_count },
                    { l: "Vehicles", v: cam.vehicle_count },
                    {
                      l: "Density",
                      v: `${(cam.crowd_density * 100).toFixed(0)}%`,
                    },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="bg-background rounded p-1.5"
                    >
                      <p className="text-xs font-mono font-bold text-text-primary">
                        {s.v}
                      </p>

                      <p className="text-[9px] text-text-muted">
                        {s.l}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-2 text-[10px] font-mono"
                  style={{ color: RISK_COLORS[cam.risk_level] }}
                >
                  {cam.risk_level} · Score{" "}
                  {(cam.risk_score * 100).toFixed(0)}%
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}