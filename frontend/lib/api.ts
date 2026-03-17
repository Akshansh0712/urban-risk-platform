import type {
  RiskAssessment, AlertsResponse, AlertStats, WeatherResponse,
  TrafficResponse, HeatmapResponse, CameraListResponse, CameraStats,
  RiskHistoryResponse, TrafficWeatherResponse, LatestRisk,
  SocialResponse, EventsResponse,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const get = (url: string) =>
  fetch(url, { cache: "no-store" }).then((r) => {
    if (!r.ok) throw new Error(`${url} → ${r.status}`);
    return r.json();
  });

// ── Risk ──────────────────────────────────────────────────────────────────────
export const fetchCurrentRisk = (zoneId = "indore-center"): Promise<RiskAssessment> =>
  get(`${BASE}/api/risk/current?zone_id=${zoneId}&force=true`);

export const fetchLatestRisk = (): Promise<LatestRisk> =>
  get(`${BASE}/api/risk/latest`);

export const fetchRiskHistory = (hours = 24): Promise<RiskHistoryResponse> =>
  get(`${BASE}/api/risk/history?hours=${hours}`);

export const fetchRiskHeatmap = (): Promise<HeatmapResponse> =>
  get(`${BASE}/api/risk/heatmap`);

export const fetchRiskExplain = (zoneId = "indore-center"): Promise<RiskAssessment> =>
  get(`${BASE}/api/risk/explain/${zoneId}`);

// ── Alerts ────────────────────────────────────────────────────────────────────
export const fetchActiveAlerts = (severity?: string): Promise<AlertsResponse> =>
  get(`${BASE}/api/alerts/active${severity ? `?severity=${severity}` : ""}`);

export const fetchAlertHistory = (hours = 24): Promise<AlertsResponse> =>
  get(`${BASE}/api/alerts/history?hours=${hours}`);

export const fetchAlertStats = (): Promise<AlertStats> =>
  get(`${BASE}/api/alerts/stats`);

export const acknowledgeAlert = (id: string): Promise<void> =>
  fetch(`${BASE}/api/alerts/acknowledge/${id}`, { method: "PATCH" }).then((r) => {
    if (!r.ok) throw new Error(`Acknowledge failed: ${r.status}`);
  });

export const resolveAlert = (id: string): Promise<void> =>
  fetch(`${BASE}/api/alerts/resolve/${id}`, { method: "PATCH" }).then((r) => {
    if (!r.ok) throw new Error(`Resolve failed: ${r.status}`);
  });

// ── Data ──────────────────────────────────────────────────────────────────────
export const fetchWeather = (limit = 1): Promise<WeatherResponse> =>
  get(`${BASE}/api/data/weather?limit=${limit}`);

export const fetchTraffic = (limit = 1): Promise<TrafficResponse> =>
  get(`${BASE}/api/data/traffic?limit=${limit}`);

export const fetchEvents = (): Promise<EventsResponse> =>
  get(`${BASE}/api/data/events`);

export const fetchSocial = (): Promise<SocialResponse> =>
  get(`${BASE}/api/data/social`);

export const fetchTrafficWeather = (hours = 24): Promise<TrafficWeatherResponse> =>
  get(`${BASE}/api/data/analytics/traffic-weather?hours=${hours}`);

// ── Cameras ───────────────────────────────────────────────────────────────────
export const fetchCameraList = (): Promise<CameraListResponse> =>
  get(`${BASE}/api/camera/list`);

export const fetchCameraStats = (id: string): Promise<CameraStats> =>
  get(`${BASE}/api/camera/stats/${id}`);

export const getCameraStreamUrl = (id: string) =>
  `${BASE}/api/camera/stream/${id}`;