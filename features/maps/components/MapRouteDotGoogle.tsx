"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";

import type { LatLng } from "@/features/restaurants/types/restaurant";

export const ROUTE_DOT = {
  you: { fill: "#2563eb", size: 12 },
  restaurant: { fill: "#EA4335", size: 12 },
  gps: { fill: "#E65100", size: 11 },
} as const;

type MapRouteDotGoogleProps = {
  coords: LatLng;
  variant: keyof typeof ROUTE_DOT;
  onContextMenu?: (e: React.MouseEvent) => void;
  onClick?: () => void;
};

export function MapRouteDotGoogle({
  coords,
  variant,
  onContextMenu,
  onClick,
}: MapRouteDotGoogleProps) {
  const { fill, size } = ROUTE_DOT[variant];

  return (
    <AdvancedMarker position={coords} zIndex={variant === "restaurant" ? 55 : 8} onClick={onClick}>
      <div
        role="img"
        aria-label={
          variant === "you" ? "Your location" : variant === "restaurant" ? "Restaurant" : "Location"
        }
        className="cursor-context-menu rounded-full border-2 border-white shadow-[0_1px_6px_rgba(0,0,0,0.28)]"
        style={{ width: size, height: size, backgroundColor: fill }}
        onContextMenu={onContextMenu}
      ></div>
    </AdvancedMarker>
  );
}
