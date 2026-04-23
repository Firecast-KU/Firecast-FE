import {
  COLOR_CODE_TO_HEX,
  COLOR_CODE_TO_RISK,
  INITIAL_MAP_CENTER,
  MOCK_FIRE_STATIONS,
} from '@/constants/mockData';
import type {
  FireStationData,
  FireStationMarker,
  MapCenter,
} from '@/types/fire.types';

const cloneStation = (station: FireStationData): FireStationData => ({ ...station });

export function mapFireStationToMarker(station: FireStationData): FireStationMarker {
  return {
    ...station,
    hexColor: COLOR_CODE_TO_HEX[station.color],
    risk: COLOR_CODE_TO_RISK[station.color],
  };
}

export const fireApi = {
  async fetchFireStations(): Promise<FireStationData[]> {
    return MOCK_FIRE_STATIONS.map(cloneStation);
  },

  async fetchInitialMapCenter(): Promise<MapCenter> {
    return { ...INITIAL_MAP_CENTER };
  },
};
