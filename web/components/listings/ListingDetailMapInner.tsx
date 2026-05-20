'use client';

import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

type ListingDetailMapInnerProps = {
  latitude: number;
  longitude: number;
  title: string;
};

const markerIcon = L.divIcon({
  className: '',
  html: '<span class="map-marker map-marker-selected"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function ListingDetailMapInner({
  latitude,
  longitude,
  title,
}: ListingDetailMapInnerProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      className="detail-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={markerIcon} title={title} />
    </MapContainer>
  );
}
