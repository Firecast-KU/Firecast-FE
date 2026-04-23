export type ColorCode = 'red' | 'orange' | 'yellow' | 'green';

export type RiskLevel = 'high' | 'medium' | 'low' | 'safe';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapCenter extends LocationCoordinates {
  level: number;
}

export interface FireStationData extends LocationCoordinates {
  probability: number;
  color: ColorCode;
  location: string;
}

export interface FireStationMarker extends FireStationData {
  hexColor: string;
  risk: RiskLevel;
}

export type RiskLabelMap = Record<RiskLevel, string>;

export type RiskColorMap = Record<RiskLevel, string>;

export type ColorToHexMap = Record<ColorCode, string>;

export type ColorToRiskMap = Record<ColorCode, RiskLevel>;

export interface LocationRequestOptions {
  ensurePermission?: boolean;
}

export interface NativeMapOutgoingMessage extends LocationCoordinates {
  type: 'setUserLocation';
}

export type NativeMapIncomingMessage =
  | { type: 'mapReady' }
  | { type: 'requestLocation' }
  | { type: 'log'; message: string }
  | { type: 'error'; message: string };
