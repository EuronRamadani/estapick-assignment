'use client';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useCallback, useEffect, useMemo } from 'react';
import type { Listing } from '@/lib/types';
import { formatPrice } from '@/lib/format';

const KOSOVO_CENTER: [number, number] = [42.55, 20.9];
const KOSOVO_ZOOM = 8;

type ListingsMapInnerProps = {
  listings: Listing[];
  selectedListingId?: number;
  onSelect: (listing: Listing) => void;
  onBoundsChange: (bbox: string) => void;
};

function createMarkerIcon(isSelected: boolean) {
  return L.divIcon({
    className: '',
    html: `<span class="map-marker ${isSelected ? 'map-marker-selected' : ''}"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function BoundsReporter({ onBoundsChange }: { onBoundsChange: (bbox: string) => void }) {
  const reportBounds = useCallback(
    (currentMap: L.Map) => {
      const bounds = currentMap.getBounds();
      const bbox = [
        bounds.getSouth().toFixed(6),
        bounds.getWest().toFixed(6),
        bounds.getNorth().toFixed(6),
        bounds.getEast().toFixed(6),
      ].join(',');
      onBoundsChange(bbox);
    },
    [onBoundsChange],
  );

  const map = useMapEvents({
    moveend: () => reportBounds(map),
    zoomend: () => reportBounds(map),
  });

  useEffect(() => {
    reportBounds(map);
  }, [map, reportBounds]);

  return null;
}

function SelectedListingFlyTo({
  listing,
}: {
  listing?: Listing;
}) {
  const map = useMap();

  useEffect(() => {
    if (listing) {
      map.flyTo([listing.latitude, listing.longitude], Math.max(map.getZoom(), 12), {
        duration: 0.5,
      });
    }
  }, [listing, map]);

  return null;
}

export default function ListingsMapInner({
  listings,
  selectedListingId,
  onSelect,
  onBoundsChange,
}: ListingsMapInnerProps) {
  const selectedListing = listings.find((listing) => listing.id === selectedListingId);
  const center = useMemo<[number, number]>(() => {
    if (selectedListing) {
      return [selectedListing.latitude, selectedListing.longitude];
    }

    return KOSOVO_CENTER;
  }, [selectedListing]);

  return (
    <MapContainer center={center} zoom={KOSOVO_ZOOM} scrollWheelZoom className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsReporter onBoundsChange={onBoundsChange} />
      <SelectedListingFlyTo listing={selectedListing} />
      {listings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.latitude, listing.longitude]}
          icon={createMarkerIcon(listing.id === selectedListingId)}
          eventHandlers={{
            click: () => onSelect(listing),
          }}
        >
          <Popup>
            <div className="popup">
              <strong>{listing.title}</strong>
              <span>{formatPrice(listing.price)}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
