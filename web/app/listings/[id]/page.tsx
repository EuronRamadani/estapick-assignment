import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ListingDetailMap } from '@/components/listings/ListingDetailMap';
import { ApiError, fetchListing } from '@/lib/api';
import { formatArea, formatDate, formatPrice } from '@/lib/format';
import type { Listing } from '@/lib/types';

type ListingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const FALLBACK_IMAGE = '/images/121959b9-fb77-4feb-9d83-112bac56d3e2.webp';

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function formatPricePerArea(price: number, area: number): string {
  return `${formatPrice(Math.round(price / area))}/m2`;
}

function getPropertyType(listing: Listing): string {
  if (listing.bedrooms === 0) {
    return 'Studio apartment';
  }

  if (listing.area >= 150 || listing.bedrooms >= 4) {
    return 'Family residence';
  }

  if (listing.area >= 110 || listing.bedrooms >= 3) {
    return 'Spacious apartment';
  }

  return 'City apartment';
}

function getHighlights(listing: Listing): string[] {
  const pricePerArea = formatPricePerArea(listing.price, listing.area);
  const bedroomLabel =
    listing.bedrooms === 0 ? 'Open-plan studio layout' : pluralize(listing.bedrooms, 'bedroom');

  return [
    `${pricePerArea} estimated price per square meter`,
    `${bedroomLabel} with ${pluralize(listing.bathrooms, 'bathroom')}`,
    `${formatArea(listing.area)} of interior living space`,
    `Positioned in ${listing.city} at ${listing.latitude.toFixed(4)}, ${listing.longitude.toFixed(4)}`,
  ];
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const listingId = Number(id);

  if (!Number.isInteger(listingId) || listingId < 1) {
    notFound();
  }

  try {
    const listing = await fetchListing(listingId);
    const images = listing.images.length > 0 ? listing.images : [FALLBACK_IMAGE];
    const heroImage = images[0];
    const propertyType = getPropertyType(listing);
    const highlights = getHighlights(listing);

    return (
      <main className="detail-page">
        <Link className="back-link" href="/">
          <span aria-hidden="true">←</span>
          Back to listings
        </Link>

        <section className="detail-hero">
          <div className="detail-media">
            <div className="detail-image-wrap">
              <Image
                src={heroImage}
                alt={listing.title}
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                className="detail-image"
                priority
              />
            </div>
            {images.length > 1 ? (
              <div className="detail-gallery" aria-label="Property images">
                {images.slice(0, 4).map((image, index) => (
                  <div className="detail-gallery-item" key={image}>
                    <Image
                      src={image}
                      alt={`${listing.title} image ${index + 1}`}
                      fill
                      sizes="(max-width: 900px) 25vw, 12vw"
                      className="detail-image"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="detail-summary">
            <div>
              <p>{listing.city}</p>
              <h1>{listing.title}</h1>
            </div>
            <div className="detail-price-row">
              <strong>{formatPrice(listing.price)}</strong>
              <span>{formatPricePerArea(listing.price, listing.area)}</span>
            </div>
            <div className="detail-facts">
              <span>{propertyType}</span>
              <span>{listing.bedrooms === 0 ? 'Studio' : pluralize(listing.bedrooms, 'bedroom')}</span>
              <span>{pluralize(listing.bathrooms, 'bathroom')}</span>
              <span>{formatArea(listing.area)}</span>
            </div>
            <p className="detail-lead">{listing.description}</p>
            <div className="detail-meta-grid">
              <span>
                <strong>{formatDate(listing.createdAt)}</strong>
                Listed
              </span>
              <span>
                <strong>#{listing.id.toString().padStart(4, '0')}</strong>
                Reference
              </span>
            </div>
          </div>
        </section>

        <section className="detail-content">
          <article>
            <p className="section-label">Overview</p>
            <h2>Property details</h2>
            <p>
              {listing.description} This {propertyType.toLowerCase()} balances practical
              room sizes with a clear location profile, making it easy to compare against
              similar homes in {listing.city}.
            </p>
            <div className="detail-stats-grid">
              <span>
                <strong>{formatArea(listing.area)}</strong>
                Total area
              </span>
              <span>
                <strong>{listing.bedrooms === 0 ? 'Studio' : listing.bedrooms}</strong>
                Bedrooms
              </span>
              <span>
                <strong>{listing.bathrooms}</strong>
                Bathrooms
              </span>
              <span>
                <strong>{formatPricePerArea(listing.price, listing.area)}</strong>
                Value guide
              </span>
            </div>
          </article>

          <aside className="detail-side-panel">
            <p className="section-label">Highlights</p>
            <h2>At a glance</h2>
            <ul className="detail-highlight-list">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="detail-location">
          <div className="detail-location-copy">
            <p className="section-label">Location</p>
            <h2>{listing.city}</h2>
            <p>
              Explore the exact map position for this listing and nearby streets. The pin
              is centered on the coordinates provided by the property record.
            </p>
            <dl>
              <div>
                <dt>Latitude</dt>
                <dd>{listing.latitude.toFixed(5)}</dd>
              </div>
              <div>
                <dt>Longitude</dt>
                <dd>{listing.longitude.toFixed(5)}</dd>
              </div>
            </dl>
          </div>
          <div className="detail-map-panel">
            <ListingDetailMap
              latitude={listing.latitude}
              longitude={listing.longitude}
              title={listing.title}
            />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
