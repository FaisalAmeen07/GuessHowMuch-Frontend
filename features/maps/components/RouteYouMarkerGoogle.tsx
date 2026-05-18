"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

import type { LatLng } from "@/features/restaurants/types/restaurant";

const YOU_BLUE = "#2563eb";

type Props = {
  coords: LatLng;
  onContextMenu?: (e: React.MouseEvent) => void;
};

export function RouteYouMarkerGoogle({ coords, onContextMenu }: Props) {
  return (
    <AdvancedMarker position={coords} zIndex={8}>
      <div
        role="img"
        aria-label="Your location"
        className="flex cursor-context-menu flex-col items-center"
        onContextMenu={onContextMenu}
      >
        <MapPin
          className="h-9 w-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.28)]"
          fill={YOU_BLUE}
          stroke="#ffffff"
          strokeWidth={2}
        />
      </div>
    </AdvancedMarker>
  );
}
