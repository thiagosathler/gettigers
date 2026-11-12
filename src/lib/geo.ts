import prisma from './prisma';

/**
 * Calculates straight line distance in miles between two coordinates using Haversine formula
 */
export function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Validates a Florida ZIP Code and returns its details
 */
export async function getFloridaZip(zipCode: string) {
  const cleanZip = zipCode.trim().slice(0, 5);
  if (!cleanZip) return null;

  const zipRecord = await prisma.floridaZip.findUnique({
    where: { zip: cleanZip },
  });

  return zipRecord;
}

/**
 * Fallback coordinate check for common Florida regions
 */
export function isLikelyFloridaZip(zip: string): boolean {
  const clean = zip.trim().slice(0, 5);
  if (clean.length !== 5) return false;
  // Florida ZIPs start with 32, 33, 34
  return clean.startsWith('32') || clean.startsWith('33') || clean.startsWith('34');
}
