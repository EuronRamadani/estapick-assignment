'use client';

import dynamic from 'next/dynamic';
import type { Listing } from '@/lib/types';

const ListingsMapInner = dynamic(() => import('./ListingsMapInner'), {
  ssr: false,
  loading: () => <div className="map map-placeholder">Loading map...</div>,
});

type ListingsMapProps = {
  listings: Listing[];
  selectedListingId?: number;
  onSelect: (listing: Listing) => void;
  onBoundsChange: (bbox: string) => void;
};

export function ListingsMap(props: ListingsMapProps) {
  return <ListingsMapInner {...props} />;
}
