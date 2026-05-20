import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Listing not found</h1>
      <p>The listing may have been removed or the link may be incorrect.</p>
      <Link href="/">Back to listings</Link>
    </main>
  );
}
