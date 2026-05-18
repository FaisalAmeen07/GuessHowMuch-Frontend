"use client";

import { useMemo } from "react";
import { Polyline } from "react-leaflet";

import type { RouteOption } from "@/features/maps/types/drivingRoute";
import { buildRouteWithConnectors } from "@/features/maps/utils/routeGeometry";
import type { LatLng } from "@/features/restaurants/types/restaurant";
import {
  ROUTE_CONNECTOR_COLOR,
  ROUTE_SELECTED_COLOR,
  ROUTE_SELECTED_WEIGHT,
  ROUTE_UNSELECTED_COLOR,
  ROUTE_UNSELECTED_WEIGHT,
} from "@/lib/maps/routeStyles";

type MapDrivingRouteLeafletProps = {
  options: RouteOption[];
  selectedIndex: number;
  origin?: LatLng | null;
  destination?: LatLng | null;
};

function toPositions(path: LatLng[]): [number, number][] {
  return path.map((p) => [p.lat, p.lng]);
}

function DottedConnector({ path }: { path: LatLng[] }) {
  if (path.length < 2) return null;
  return (
    <Polyline
      positions={toPositions(path)}
      pathOptions={{
        color: ROUTE_CONNECTOR_COLOR,
        weight: 4,
        opacity: 0.95,
        dashArray: "2, 9",
        lineCap: "round",
      }}
    />
  );
}

export function MapDrivingRouteLeaflet({
  options,
  selectedIndex,
  origin,
  destination,
}: MapDrivingRouteLeafletProps) {
  const selectedConnectors = useMemo(() => {
    const path = options[selectedIndex]?.path ?? [];
    if (!path.length) {
      return { mainPath: [], originConnector: null, destinationConnector: null };
    }
    return buildRouteWithConnectors(path, origin, destination);
  }, [options, selectedIndex, origin, destination]);

  if (!options.length) return null;

  const unselected = options.filter((_, i) => i !== selectedIndex);
  const selected = options[selectedIndex];

  return (
    <>
      {unselected.map((opt) => {
        if (!opt.path.length) return null;
        return (
          <Polyline
            key={opt.id}
            positions={toPositions(opt.path)}
            pathOptions={{
              color: ROUTE_UNSELECTED_COLOR,
              weight: ROUTE_UNSELECTED_WEIGHT,
              opacity: 0.75,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        );
      })}
      {selected?.path.length ? (
        <Polyline
          key={selected.id}
          positions={toPositions(selected.path)}
          pathOptions={{
            color: ROUTE_SELECTED_COLOR,
            weight: ROUTE_SELECTED_WEIGHT,
            opacity: 1,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      ) : null}
      {selectedConnectors.originConnector && (
        <DottedConnector path={selectedConnectors.originConnector} />
      )}
      {selectedConnectors.destinationConnector && (
        <DottedConnector path={selectedConnectors.destinationConnector} />
      )}
    </>
  );
}
