import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ListingDetailMap } from '@/components/listings/ListingDetailMap';
import { ApiError, fetchListing } from '@/lib/api';
import { formatArea, formatDate, formatPrice } from '@/lib/format';

type ListingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const listingId = Number(id);

  if (!Number.isInteger(listingId) || listingId < 1) {
    notFound();
  }

  try {
    const listing = await fetchListing(listingId);
    const heroImage = listing.images[0] ?? '/images/121959b9-fb77-4feb-9d83-112bac56d3e2.webp';

    return (
      <main className="detail-page">
        <Link className="back-link" href="/">
          Back to listings
        </Link>

        <section className="detail-hero">
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
          <div className="detail-summary">
            <p>{listing.city}</p>
            <h1>{listing.title}</h1>
            <strong>{formatPrice(listing.price)}</strong>
            <div className="detail-facts">
              <span>{listing.bedrooms} bedrooms</span>
              <span>{listing.bathrooms} bathrooms</span>
              <span>{formatArea(listing.area)}</span>
            </div>
            <small>Listed {formatDate(listing.createdAt)}</small>
          </div>
        </section>

        <section className="detail-content">
          <article>
            <h2>Description</h2>
            <p>{listing.description}</p>
          </article>
          <ListingDetailMap
            latitude={listing.latitude}
            longitude={listing.longitude}
            title={listing.title}
          />
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
