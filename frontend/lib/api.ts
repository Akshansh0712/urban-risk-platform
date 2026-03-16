import type {
  RiskAssessment,
  AlertsResponse,
  AlertStats,
  WeatherResponse,
  TrafficResponse,
  HeatmapResponse,
  CameraListResponse,
  CameraStats,
  RiskHistoryResponse,
  TrafficWeatherResponse,
  LatestRisk,
  SocialResponse,
  EventsResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Risk ──────────────────────────────────────

export async function fetchCurrentRisk(zoneId = "indore-center"): Promise<RiskAssessment> {
  const res = await fetch(
    `${BASE_URL}/api/risk/current?zone_id=${zoneId}&force=true`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Risk API failed: ${res.status}`);
  return res.json();
}

export async function fetchLatestRisk(): Promise<LatestRisk> {
  const res = await fetch(`${BASE_URL}/api/risk/latest`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Latest risk API failed: ${res.status}`);
  return res.json();
}

export async function fetchRiskHistory(hours = 24): Promise<RiskHistoryResponse> {
  const res = await fetch(`${BASE_URL}/api/risk/history?hours=${hours}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Risk history API failed: ${res.status}`);
  return res.json();
}

export async function fetchRiskHeatmap(): Promise<HeatmapResponse> {
  const res = await fetch(`${BASE_URL}/api/risk/heatmap`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Heatmap API failed: ${res.status}`);
  return res.json();
}

export async function fetchRiskExplain(zoneId = "indore-center"): Promise<RiskAssessment> {
  const res = await fetch(`${BASE_URL}/api/risk/explain/${zoneId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Explain API failed: ${res.status}`);
  return res.json();
}

// ── Alerts ────────────────────────────────────

export async function fetchActiveAlerts(severity?: string): Promise<AlertsResponse> {
  const url = severity
    ? `${BASE_URL}/api/alerts/active?severity=${severity}`
    : `${BASE_URL}/api/alerts/active`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Alerts API failed: ${res.status}`);
  return res.json();
}

export async function fetchAlertHistory(hours = 24): Promise<AlertsResponse> {
  const res = await fetch(`${BASE_URL}/api/alerts/history?hours=${hours}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Alert history API failed: ${res.status}`);
  return res.json();
}

export async function fetchAlertStats(): Promise<AlertStats> {
  const res = await fetch(`${BASE_URL}/api/alerts/stats`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Alert stats API failed: ${res.status}`);
  return res.json();
}

export async function acknowledgeAlert(alertId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/alerts/acknowledge/${alertId}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(`Acknowledge API failed: ${res.status}`);
}

export async function resolveAlert(alertId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/alerts/resolve/${alertId}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(`Resolve API failed: ${res.status}`);
}

// ── Data ──────────────────────────────────────

export async function fetchWeather(limit = 1): Promise<WeatherResponse> {
  const res = await fetch(`${BASE_URL}/api/data/weather?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Weather API failed: ${res.status}`);
  return res.json();
}

export async function fetchTraffic(limit = 1): Promise<TrafficResponse> {
  const res = await fetch(`${BASE_URL}/api/data/traffic?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Traffic API failed: ${res.status}`);
  return res.json();
}

export async function fetchEvents(): Promise<EventsResponse> {
  const res = await fetch(`${BASE_URL}/api/data/events`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Events API failed: ${res.status}`);
  return res.json();
}

export async function fetchSocial(): Promise<SocialResponse> {
  const res = await fetch(`${BASE_URL}/api/data/social`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Social API failed: ${res.status}`);
  return res.json();
}

export async function fetchTrafficWeather(hours = 24): Promise<TrafficWeatherResponse> {
  const res = await fetch(
    `${BASE_URL}/api/data/analytics/traffic-weather?hours=${hours}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Analytics API failed: ${res.status}`);
  return res.json();
}

// ── Cameras ───────────────────────────────────

export async function fetchCameraList(): Promise<CameraListResponse> {
  const res = await fetch(`${BASE_URL}/api/camera/list`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Camera list API failed: ${res.status}`);
  return res.json();
}

export async function fetchCameraStats(cameraId: string): Promise<CameraStats> {
  const res = await fetch(`${BASE_URL}/api/camera/stats/${cameraId}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Camera stats API failed: ${res.status}`);
  return res.json();
}

export function getCameraStreamUrl(cameraId: string): string {
  return `${BASE_URL}/api/camera/stream/${cameraId}`;
}

export function getCameraSnapshotUrl(cameraId: string): string {
  return `${BASE_URL}/api/camera/snapshot/${cameraId}`;
}