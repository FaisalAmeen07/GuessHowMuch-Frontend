"use client";

import { useEffect } from "react";
import { useMap as useLeafletMap } from "react-leaflet";

import type { RouteOption } from "@/features/maps/types/drivingRoute";
import type { LatLng } from "@/features/restaurants/types/restaurant";

type MapFitRouteBoundsProps = {
  origin: LatLng | null | undefined;
  destination: LatLng | null | undefined;
  options: RouteOption[];
  selectedIndex: number;
};

export function MapFitRouteBoundsLeaflet({
  origin,
  destination,
  options,
  selectedIndex,
}: MapFitRouteBoundsProps) {
  const map = useLeafletMap();

  useEffect(() => {
    if (!map || !origin || !destination) return;

    const points: [number, number][] = [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ];

    const path = options[selectedIndex]?.path ?? options[0]?.path;
    for (const p of path ?? []) {
      points.push([p.lat, p.lng]);
    }

    map.fitBounds(points, { padding: [100, 48] });
  }, [map, origin, destination, options, selectedIndex]);

  return null;
}
