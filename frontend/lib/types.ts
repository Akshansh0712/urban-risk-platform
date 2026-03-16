// ─────────────────────────────────────────────
// ALL SHARED INTERFACES — import from here only
// ─────────────────────────────────────────────

export interface WeatherDetails {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  rainfall_1h: number;
  weather_main: string;
  weather_desc: string;
  visibility: number;
  uv_index: number;
}

export interface TrafficDetails {
  congestion_ratio: number;
  average_speed: number;
  incident_count: number;
  vehicle_count: number;
}

export interface CrowdDetails {
  event_count: number;
  max_expected_attendance: number;
  high_risk_events: number;
}

export interface CameraDetails {
  online_cameras: number;
  avg_crowd_density: number;
  total_persons_detected: number;
  total_vehicles_detected: number;
}

export interface SocialDetails {
  total_signals: number;
  high_risk_signals: number;
  risk_keywords_found: string[];
}

export interface XAIContribution {
  feature: string;
  value: number;
  importance: number;
  contribution: number;
}

export interface RiskAssessment {
  zone_id: string;
  city: string;
  lat: number;
  lon: number;
  risk_score: number;
  risk_level: "HIGH" | "MEDIUM" | "SAFE";
  contributing_factors: {
    weather: { score: number; weight: string; details: WeatherDetails };
    traffic: { score: number; weight: string; details: TrafficDetails };
    crowd_events: { score: number; weight: string; details: CrowdDetails };
    camera: { score: number; weight: string; details: CameraDetails };
    social: { score: number; weight: string; details: SocialDetails };
  };
  explanation: {
    reasons: string[];
    contributions: XAIContribution[];
    risk_score: number;
  };
  model_version: string;
  computed_at: string;
}

export interface Alert {
  alert_id: string;
  city: string;
  zone_id: string;
  lat: number;
  lon: number;
  alert_type: string;
  severity: "HIGH" | "MEDIUM";
  title: string;
  description: string;
  risk_score: number;
  is_active: boolean;
  acknowledged: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface AlertsResponse {
  city: string;
  count: number;
  alerts: Alert[];
}

export interface AlertStats {
  city: string;
  total: number;
  active_high: number;
  active_medium: number;
  total_active: number;
  last_hour: number;
}

export interface WeatherReading {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  rainfall_1h: number;
  weather_main: string;
  weather_desc: string;
  visibility: number;
  uv_index: number;
  recorded_at: string;
}

export interface WeatherResponse {
  city: string;
  count: number;
  weather: WeatherReading[];
}

export interface TrafficReading {
  congestion_ratio: number;
  average_speed: number;
  incident_count: number;
  vehicle_count: number;
  recorded_at: string;
}

export interface TrafficResponse {
  city: string;
  count: number;
  traffic: TrafficReading[];
}

export interface HeatmapZone {
  zone_id: string;
  zone_name: string;
  lat: number;
  lon: number;
  risk_level: "HIGH" | "MEDIUM" | "SAFE";
  risk_score: number;
  radius?: number;
}

export interface HeatmapResponse {
  city: string;
  zones: HeatmapZone[];
}

export interface CameraStats {
  camera_id: string;
  name: string;
  lat: number;
  lon: number;
  is_online: boolean;
  vehicle_count: number;
  person_count: number;
  crowd_density: number;
  risk_score: number;
  risk_level: "HIGH" | "MEDIUM" | "SAFE";
  last_updated: string;
}

export interface CameraListResponse {
  city: string;
  total: number;
  cameras: CameraStats[];
}

export interface RiskHistoryPoint {
  zone_id: string;
  risk_score: number;
  weather_score: number;
  traffic_score: number;
  crowd_score: number;
  camera_score: number;
  computed_at: string;
}

export interface RiskHistoryResponse {
  city: string;
  hours: number;
  data: RiskHistoryPoint[];
}

export interface TrafficWeatherPoint {
  rainfall_1h: number;
  incident_count: number;
  congestion_ratio: number;
  recorded_at: string;
}

export interface TrafficWeatherResponse {
  city: string;
  data: TrafficWeatherPoint[];
}

export interface LatestRisk {
  zone_id: string;
  city: string;
  risk_score: number;
  risk_level: "HIGH" | "MEDIUM" | "SAFE";
  computed_at: string;
}

export interface NewAlertEvent {
  alert_id: string;
  title: string;
  description: string;
  severity: "HIGH" | "MEDIUM";
  risk_score: number;
  zone_id: string;
  lat: number;
  lon: number;
  created_at: string;
}

export interface SocialResponse {
  city: string;
  total_signals: number;
  high_risk_signals: number;
  risk_keywords_found: string[];
  summary: string;
}

export interface EventsResponse {
  city: string;
  count: number;
  events: Array<{
    event_id: string;
    name: string;
    venue: string;
    expected_attendance: number;
    risk_level: string;
    start_time: string;
  }>;
}

