"use client";

import { MapRouteDotGoogle } from "@/features/maps/components/MapRouteDotGoogle";
import type { LatLng } from "@/features/restaurants/types/restaurant";

type Props = {
  position: LatLng;
  priceLabel?: string;
  onClick?: () => void;
};

export function RestaurantRoutePinGoogle({ position, onClick }: Props) {
  return (
    <MapRouteDotGoogle coords={position} variant="restaurant" onClick={onClick} />
  );
}
