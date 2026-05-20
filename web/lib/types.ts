export type Listing = {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  latitude: number;
  longitude: number;
  images: string[];
  createdAt: string;
};

export type ListingsMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListingsResponse = {
  data: Listing[];
  meta: ListingsMeta;
};

export type ListingFilters = {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
};

export type ListingsQuery = ListingFilters & {
  bbox?: string;
  page?: number;
  limit?: number;
};
