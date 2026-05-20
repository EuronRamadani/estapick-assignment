'use client';

import dynamic from 'next/dynamic';

const ListingDetailMapInner = dynamic(() => import('./ListingDetailMapInner'), {
  ssr: false,
  loading: () => <div className="detail-map map-placeholder">Loading map...</div>,
});

type ListingDetailMapProps = {
  latitude: number;
  longitude: number;
  title: string;
};

export function ListingDetailMap(props: ListingDetailMapProps) {
  return <ListingDetailMapInner {...props} />;
}
