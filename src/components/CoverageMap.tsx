"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Edit this list to change the pins. depot: true gets a larger marker;
// side: "left" flips the label for towns in tight clusters.
const towns: {
  name: string;
  lat: number;
  lng: number;
  depot?: boolean;
  side?: "left" | "right";
}[] = [
  { name: "Perth", lat: -31.9523, lng: 115.8613, depot: true },
  { name: "Geraldton", lat: -28.7742, lng: 114.6144, depot: true },
  { name: "Moora", lat: -30.6397, lng: 116.0089, side: "left" },
  { name: "Dalwallinu", lat: -30.2777, lng: 116.666 },
  { name: "Wongan Hills", lat: -30.8933, lng: 116.7181 },
  { name: "Coorow", lat: -29.8815, lng: 116.0217, side: "left" },
  { name: "Carnamah", lat: -29.6893, lng: 115.8869, side: "left" },
  { name: "Three Springs", lat: -29.532, lng: 115.7594 },
  { name: "Morawa", lat: -29.2113, lng: 116.0089, side: "left" },
  { name: "Perenjori", lat: -29.4372, lng: 116.2841 },
];

export default function CoverageMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current || !containerRef.current) return;
    initialised.current = true;

    // Leaflet touches `window` on import, so it can't load during prerender.
    import("leaflet").then((L) => {
      const map = L.map(containerRef.current!, {
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        attributionControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 12,
          minZoom: 5,
        }
      ).addTo(map);

      const pin = (depot?: boolean) =>
        L.divIcon({
          className: "coverage-pin-wrap",
          html: `<span class="coverage-pin${depot ? " coverage-pin-depot" : ""}"></span>`,
          iconSize: depot ? [18, 18] : [12, 12],
          iconAnchor: depot ? [9, 9] : [6, 6],
        });

      towns.forEach((t) => {
        L.marker([t.lat, t.lng], { icon: pin(t.depot) })
          .addTo(map)
          .bindTooltip(t.name, {
            permanent: true,
            direction: t.side ?? "right",
            offset: [t.side === "left" ? -10 : 10, 0],
            className: "coverage-tooltip",
          });
      });

      map.fitBounds(
        L.latLngBounds(towns.map((t) => [t.lat, t.lng])),
        { padding: [40, 40] }
      );
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[420px] md:h-[520px] rounded-2xl overflow-hidden border border-white/10 bg-surface"
      aria-label="Map of towns NCMT services in Western Australia"
    />
  );
}
