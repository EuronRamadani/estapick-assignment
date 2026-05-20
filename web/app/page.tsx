import { Suspense } from 'react';
import { ListingsPageClient } from '@/components/listings/ListingsPageClient';
import { LoadingState } from '@/components/ui/LoadingState';

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ListingsPageClient />
    </Suspense>
  );
}
