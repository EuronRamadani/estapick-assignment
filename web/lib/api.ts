import type { Listing, ListingsQuery, ListingsResponse } from './types';

const API_URL =
  typeof window === 'undefined'
    ? (process.env.API_INTERNAL_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      'http://localhost:4000')
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000');

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function buildUrl(path: string, query?: ListingsQuery): string {
  const url = new URL(path, API_URL);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) {
        message = body.message.join(' ');
      } else if (body.message) {
        message = body.message;
      }
    } catch {
      // Keep the fallback message when the API does not send JSON.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export function fetchListings(query?: ListingsQuery): Promise<ListingsResponse> {
  return request<ListingsResponse>(buildUrl('/listings', query));
}

export function fetchListing(id: number): Promise<Listing> {
  return request<Listing>(buildUrl(`/listings/${id}`));
}
