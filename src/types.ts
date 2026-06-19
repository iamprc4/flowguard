export type UserRole = 'admin' | 'officer' | 'logistics';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  badgeNumber?: string;
  password?: string; // Server-side only — stripped before sending to client
}

export type EventType = 'rally' | 'festival' | 'sports' | 'construction' | 'gathering' | 'emergency';

export interface TrafficEvent {
  id: string;
  title: string;
  type: EventType;
  startTime: string; // ISO String
  endTime: string; // ISO String
  location: string;
  crowdSize: number;
  description: string;
  status: 'scheduled' | 'active' | 'completed';
  riskScore: number; // 0 to 100
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude?: number;
  longitude?: number;
  endlatitude?: number;
  endlongitude?: number;
}

export interface TrafficPrediction {
  id: string;
  eventId: string;
  congestionLevel: 'low' | 'medium' | 'high' | 'critical';
  peakHours: string;
  affectedRoadSegments: string[];
  historicalComparison: string;
  recommendations: string[];
  hourlyForecast: { hour: string; multiplier: number }[]; // hourly multiplier e.g. ["12:00", 1.2]
}

export interface ResourcePlan {
  id: string;
  eventId: string;
  officersNeeded: number;
  barricadesNeeded: number;
  utilizationScore: number;
  shiftSchedules: { shiftName: string; hours: string; personnel: string[] }[];
  assignments: { location: string; details: string; officersCount: number }[];
}

export interface DiversionRoute {
  id: string;
  eventId: string;
  primaryRouteName: string;
  primaryPath: string[]; // list of roads
  secondaryRouteName: string;
  secondaryPath: string[];
  estimatedTimeSavings: number; // minutes
  congestionComparisonList: { route: string; travelTimeMinutes: number; congestionLevel: string }[];
}

export interface HistoricalEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  crowdSize: number;
  peakCongestionIndex: number; // 0 - 100
  officersDeployed: number;
  diversionActive: boolean;
  predictionAccuracy: number; // % Match
  congestionReduction: number; // % Saved
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  read: boolean;
  eventId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
}
