'use client';

import type { ListingFilters as ListingFiltersType } from '@/lib/types';

type ListingFiltersProps = {
  filters: ListingFiltersType;
  onChange: (filters: ListingFiltersType) => void;
  onClear: () => void;
};

const cities = ['', 'Prishtina', 'Prizren', 'Peja', 'Gjakova', 'Ferizaj', 'Gjilan'];

export function ListingFilters({ filters, onChange, onClear }: ListingFiltersProps) {
  const updateFilter = (key: keyof ListingFiltersType, value: string) => {
    const nextValue =
      key === 'minPrice' || key === 'maxPrice'
        ? sanitizePositiveNumber(value)
        : value;

    onChange({
      ...filters,
      [key]: nextValue,
    });
  };

  return (
    <form className="filters" onSubmit={(event) => event.preventDefault()}>
      <label>
        <span>City</span>
        <select
          value={filters.city ?? ''}
          onChange={(event) => updateFilter('city', event.target.value)}
        >
          {cities.map((city) => (
            <option key={city || 'all'} value={city}>
              {city || 'All cities'}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Min price</span>
        <input
          type="number"
          min="0"
          step="1000"
          inputMode="numeric"
          placeholder="80000"
          value={filters.minPrice ?? ''}
          onChange={(event) => updateFilter('minPrice', event.target.value)}
        />
      </label>
      <label>
        <span>Max price</span>
        <input
          type="number"
          min="0"
          step="1000"
          inputMode="numeric"
          placeholder="300000"
          value={filters.maxPrice ?? ''}
          onChange={(event) => updateFilter('maxPrice', event.target.value)}
        />
      </label>
      <label>
        <span>Bedrooms</span>
        <select
          value={filters.bedrooms ?? ''}
          onChange={(event) => updateFilter('bedrooms', event.target.value)}
        >
          <option value="">Any</option>
          <option value="0">Studio</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </label>
      <button className="filters-clear" type="button" onClick={onClear}>
        Clear
      </button>
    </form>
  );
}

function sanitizePositiveNumber(value: string): string {
  if (value === '') {
    return '';
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return '';
  }

  return String(Math.max(0, parsed));
}
