import type { LocationCoordinates } from '@/types/fire.types';

const EARTH_RADIUS_KM = 6371;

const toRadians = (value: number) => (value * Math.PI) / 180;

export function calculateDistanceInKilometers(
  from: LocationCoordinates,
  to: LocationCoordinates,
): number {
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return EARTH_RADIUS_KM * arc;
}

export function findNearestCoordinateItem<T extends LocationCoordinates>(
  origin: LocationCoordinates,
  items: T[],
): T | null {
  if (items.length === 0) {
    return null;
  }

  let nearestItem = items[0];
  let shortestDistance = calculateDistanceInKilometers(origin, items[0]);

  for (const item of items.slice(1)) {
    const currentDistance = calculateDistanceInKilometers(origin, item);

    if (currentDistance < shortestDistance) {
      nearestItem = item;
      shortestDistance = currentDistance;
    }
  }

  return nearestItem;
}
