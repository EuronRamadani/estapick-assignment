export type ListingResponse = {
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
  createdAt: Date;
};

export type PaginatedListingsResponse = {
  data: ListingResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
