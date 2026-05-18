"use client";

import L from "leaflet";
import { Marker } from "react-leaflet";

import type { LatLng } from "@/features/restaurants/types/restaurant";

import { ROUTE_DOT } from "@/features/maps/components/MapRouteDotGoogle";

function leafletDotIcon(variant: keyof typeof ROUTE_DOT): L.DivIcon {
  const { fill, size } = ROUTE_DOT[variant];
  return L.divIcon({
    className: "ghm-route-dot",
    html: `<div style="
      width:${size}px;height:${size}px;
      border-radius:9999px;
      background:${fill};
      border:2px solid #fff;
      box-shadow:0 1px 6px rgba(0,0,0,0.28);
    "></div>`,
    iconSize: [size + 4, size + 4],
    iconAnchor: [(size + 4) / 2, (size + 4) / 2],
  });
}

type MapRouteDotLeafletProps = {
  coords: LatLng;
  variant: keyof typeof ROUTE_DOT;
  onMapContextMenu?: (e: L.LeafletMouseEvent) => void;
  onClick?: () => void;
};

export function MapRouteDotLeaflet({
  coords,
  variant,
  onMapContextMenu,
  onClick,
}: MapRouteDotLeafletProps) {
  return (
    <Marker
      position={[coords.lat, coords.lng]}
      icon={leafletDotIcon(variant)}
      zIndexOffset={variant === "restaurant" ? 900 : 700}
      eventHandlers={{
        ...(onClick ? { click: onClick } : {}),
        ...(onMapContextMenu
          ? {
              contextmenu: (e: L.LeafletMouseEvent) => {
                onMapContextMenu(e);
                L.DomEvent.stopPropagation(e);
              },
            }
          : {}),
      }}
    />
  );
}
