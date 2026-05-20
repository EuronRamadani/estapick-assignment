'use client';

import Image from 'next/image';
import type { Listing } from '@/lib/types';
import { formatArea, formatPrice } from '@/lib/format';

const fallbackImage = '/images/121959b9-fb77-4feb-9d83-112bac56d3e2.webp';

type ListingCardProps = {
  listing: Listing;
  isSelected: boolean;
  onSelect: (listing: Listing) => void;
  onOpen: (listing: Listing) => void;
};

export function ListingCard({
  listing,
  isSelected,
  onSelect,
  onOpen,
}: ListingCardProps) {
  return (
    <article
      className={`listing-card ${isSelected ? 'listing-card-selected' : ''}`}
      onMouseEnter={() => onSelect(listing)}
    >
      <button
        className="listing-card-button"
        type="button"
        onClick={() => onOpen(listing)}
        onFocus={() => onSelect(listing)}
        aria-pressed={isSelected}
        aria-label={`Open ${listing.title}`}
      >
        <div className="listing-image-wrap">
          <Image
            src={listing.images[0] ?? fallbackImage}
            alt={listing.title}
            fill
            sizes="180px"
            className="listing-image"
          />
        </div>
        <div className="listing-card-content">
          <div>
            <h2>{listing.title}</h2>
            <p>{listing.city}</p>
          </div>
          <strong>{formatPrice(listing.price)}</strong>
          <div className="listing-facts">
            <span>{listing.bedrooms} bd</span>
            <span>{listing.bathrooms} ba</span>
            <span>{formatArea(listing.area)}</span>
          </div>
        </div>
      </button>
    </article>
  );
}
