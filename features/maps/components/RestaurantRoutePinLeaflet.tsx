"use client";

import { MapRouteDotLeaflet } from "@/features/maps/components/MapRouteDotLeaflet";
import type { LatLng } from "@/features/restaurants/types/restaurant";

type Props = {
  position: LatLng;
  priceLabel?: string;
  onClick?: () => void;
};

export function RestaurantRoutePinLeaflet({ position, onClick }: Props) {
  return <MapRouteDotLeaflet coords={position} variant="restaurant" onClick={onClick} />;
}
