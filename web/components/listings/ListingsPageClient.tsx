'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Listing, ListingFilters, ListingsMeta } from '@/lib/types';
import { fetchListings } from '@/lib/api';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ListingCard } from './ListingCard';
import { ListingFilters as ListingFiltersComponent } from './ListingFilters';
import { ListingsMap } from './ListingsMap';

const defaultMeta: ListingsMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export function ListingsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ListingFilters>(() => ({
    city: searchParams.get('city') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    bedrooms: searchParams.get('bedrooms') ?? '',
  }));
  const [listings, setListings] = useState<Listing[]>([]);
  const [meta, setMeta] = useState<ListingsMeta>(defaultMeta);
  const [page, setPage] = useState(1);
  const [bbox, setBbox] = useState<string | undefined>();
  const [selectedListingId, setSelectedListingId] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const bboxTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastBbox = useRef<string | undefined>(undefined);

  const normalizedFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(
          ([key, value]) =>
            value !== undefined &&
            value !== '' &&
            (key === 'city' || Number(value) >= 0),
        ),
      ) as ListingFilters,
    [filters],
  );

  useEffect(() => {
    return () => {
      clearTimeout(bboxTimer.current);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(normalizedFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    const nextUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.replace(nextUrl, { scroll: false });
  }, [normalizedFilters, router]);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setError(undefined);

    fetchListings({
      ...normalizedFilters,
      bbox,
      page,
      limit: 10,
    })
      .then((response) => {
        if (!isActive) {
          return;
        }
        setListings(response.data);
        setMeta(response.meta);
        setSelectedListingId((currentId) =>
          response.data.some((listing) => listing.id === currentId) ? currentId : undefined,
        );
      })
      .catch((requestError: unknown) => {
        if (!isActive) {
          return;
        }
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Something went wrong while loading listings.',
        );
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [bbox, normalizedFilters, page]);

  const handleFiltersChange = (nextFilters: ListingFilters) => {
    clearTimeout(bboxTimer.current);
    lastBbox.current = undefined;
    setBbox(undefined);
    setFilters(nextFilters);
    setPage(1);
  };

  const handleBoundsChange = useCallback((nextBbox: string) => {
    if (nextBbox === lastBbox.current) {
      return;
    }

    clearTimeout(bboxTimer.current);
    bboxTimer.current = setTimeout(() => {
      lastBbox.current = nextBbox;
      setBbox(nextBbox);
      setPage(1);
    }, 350);
  }, []);

  const handleOpenListing = (listing: Listing) => {
    router.push(`/listings/${listing.id}`);
  };

  const selectedListing = listings.find((listing) => listing.id === selectedListingId);

  return (
    <main className="page-shell">
      <section className="list-panel">
        <header className="page-header">
          <div>
            <p>Property Listings</p>
            <h1>Homes on the map</h1>
          </div>
          <span>{meta.total} results</span>
        </header>

        <ListingFiltersComponent
          filters={filters}
          onChange={handleFiltersChange}
          onClear={() =>
            handleFiltersChange({ city: '', minPrice: '', maxPrice: '', bedrooms: '' })
          }
        />

        <div className="list-status-row">
          <span>
            Page {meta.page} of {Math.max(meta.totalPages, 1)}
          </span>
          {selectedListing ? <strong>{selectedListing.title}</strong> : null}
        </div>

        {error ? <ErrorState message={error} /> : null}
        {isLoading ? <LoadingState /> : null}
        {!isLoading && !error && listings.length === 0 ? <EmptyState /> : null}

        <div className="listing-list">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isSelected={listing.id === selectedListingId}
              onSelect={(nextListing) => setSelectedListingId(nextListing.id)}
              onOpen={handleOpenListing}
            />
          ))}
        </div>

        <div className="pagination">
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <button
            type="button"
            disabled={page >= meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </section>

      <section className="map-panel" aria-label="Listings map">
        <ListingsMap
          listings={listings}
          selectedListingId={selectedListingId}
          onSelect={(listing) => setSelectedListingId(listing.id)}
          onBoundsChange={handleBoundsChange}
        />
      </section>
    </main>
  );
}
