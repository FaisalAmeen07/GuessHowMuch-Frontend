"use client";

import type L from "leaflet";

import { MapRouteDotLeaflet } from "@/features/maps/components/MapRouteDotLeaflet";
import type { LatLng } from "@/features/restaurants/types/restaurant";

export function UserLocationMarkerLeaflet({
  coords,
  onMapContextMenu,
}: {
  coords: LatLng;
  onMapContextMenu?: (e: L.LeafletMouseEvent) => void;
}) {
  return <MapRouteDotLeaflet coords={coords} variant="gps" onMapContextMenu={onMapContextMenu} />;
}
