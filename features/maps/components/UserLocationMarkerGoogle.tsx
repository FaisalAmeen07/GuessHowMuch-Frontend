"use client";

import { MapRouteDotGoogle } from "@/features/maps/components/MapRouteDotGoogle";
import type { LatLng } from "@/features/restaurants/types/restaurant";

type Props = {
  coords: LatLng;
  onContextMenu: (e: React.MouseEvent) => void;
};

export function UserLocationMarkerGoogle({ coords, onContextMenu }: Props) {
  return <MapRouteDotGoogle coords={coords} variant="gps" onContextMenu={onContextMenu} />;
}
