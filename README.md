# Property Listings

Minimal real-estate marketplace slice with a NestJS REST API, Prisma/SQLite database, and a Next.js App Router frontend with synchronized listing and map interactions.

## Prerequisites

- Node.js 22 or newer
- npm
- Docker Desktop or Docker Engine, only if using the Docker workflow

## Requirements Covered

- Run instructions for both apps locally, plus Docker Compose as a bonus.
- Architecture decisions and trade-offs.
- Map provider setup and API-key requirements.
- What I would build next with more time.
- AI tool usage notes.

## Tech Stack

- Backend: NestJS, Prisma, SQLite, class-validator
- Frontend: Next.js App Router, React, Leaflet/react-leaflet
- Language: TypeScript throughout
- Map tiles: OpenStreetMap via Leaflet, no API key required

## Map Provider Setup

The app uses Leaflet with OpenStreetMap public tiles:

- No API key is required.
- There is no paid account or free-tier setup.
- Tiles are loaded from `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`.
- This is suitable for a take-home/local review. For production traffic, I would use a dedicated tile provider or self-hosted tile service to respect OpenStreetMap usage guidelines.

## Run With Docker

Make sure Docker Desktop or Docker Engine is running first.

```bash
git clone <repository-url>
cd estapick-assignment
docker compose up --build
```

The frontend runs on `http://localhost:3000` and the API runs on `http://localhost:4000`.
On startup, the API container applies Prisma migrations and seeds the SQLite database.

The Docker setup intentionally keeps `NEXT_PUBLIC_API_URL=http://localhost:4000` for browser requests and uses `API_INTERNAL_URL=http://api:4000` for server-side Next.js requests inside the Docker network.

## Run Locally

Use two terminals: one for the API and one for the web app.

From a fresh clone:

```bash
git clone <repository-url>
cd estapick-assignment
```

### Backend

```bash
cd api
cp .env.example .env
npm ci
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

The API runs on `http://localhost:4000` by default.
If the frontend runs on another port, add its origin to `CORS_ORIGIN` in `api/.env`.

Run backend tests with:

```bash
cd api
npm test
```

If Prisma's local schema engine fails in a constrained environment, the checked-in migration SQL can also be applied directly:

```bash
sqlite3 prisma/dev.db < prisma/migrations/20260519184500_init/migration.sql
```

### Frontend

```bash
cd web
npm ci
npm run dev
```

The web app runs on `http://localhost:3000` by default. If the API is not on port `4000`, set:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For example:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000 npm run dev
```

For a production build check:

```bash
cd web
npm run build
```

## Seed Database

```bash
cd api
npm run prisma:seed
```

The seed creates 18 listings across Kosovo cities such as Prishtina, Prizren, and Peja with realistic latitude/longitude values.
Listing images are local static assets under `web/public/images` to avoid external image availability issues during review.

## API Endpoints

### `GET /listings`

Returns paginated listings.

Supported query params:

- `city`
- `minPrice`
- `maxPrice`
- `bedrooms`
- `bbox` formatted as `minLat,minLng,maxLat,maxLng`
- `page`
- `limit`

Response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 18,
    "totalPages": 2
  }
}
```

Examples:

```bash
curl "http://localhost:4000/listings?page=1&limit=5"
curl "http://localhost:4000/listings?city=Prishtina"
curl "http://localhost:4000/listings?minPrice=50000&maxPrice=200000"
curl "http://localhost:4000/listings?bedrooms=2"
curl "http://localhost:4000/listings?bbox=42.60,21.10,42.70,21.20"
curl "http://localhost:4000/listings?bbox=42.60,21.10,42.70,21.20&city=Prishtina"
```

### `GET /listings/:id`

Returns one listing or `404` when it does not exist.

```bash
curl "http://localhost:4000/listings/1"
```

### `POST /listings`

Creates a listing. Payload validation is handled with `class-validator`; invalid input returns `400`.

```bash
curl -X POST "http://localhost:4000/listings" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Central Test Apartment",
    "description": "A bright apartment with practical layout and excellent city access.",
    "price": 135000,
    "city": "Prishtina",
    "bedrooms": 2,
    "bathrooms": 1,
    "area": 68,
    "latitude": 42.6629,
    "longitude": 21.1655,
    "images": ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"]
  }'
```

## Architecture Decisions

- `/api` keeps controllers thin and moves filtering, pagination, bbox parsing, and response mapping into `ListingsService`.
- Prisma owns persistence and the query shape; DTOs own request validation and transformation.
- `/web/lib/api.ts` is the only frontend fetch layer so API integration is not scattered through components.
- Docker Compose runs the API and web app together; the web service uses an internal API URL for server-rendered requests and the public localhost URL for browser requests.
- The listings page uses client state for filters, pagination, selected listing, and current map bbox.
- Leaflet components are dynamically imported with SSR disabled to avoid `window`/`document` issues in Next.js.
- Server Components are used for the App Router shell and listing detail data fetch; Client Components are used where browser state or Leaflet is required.

## Assumptions

- Seeded listing images are local static placeholders under `web/public/images` so the reviewer does not depend on remote image availability.
- `POST /listings` accepts absolute image URLs. Local image upload/storage is intentionally out of scope.
- SQLite compatibility note: the assignment requires `images` to behave as an array of URLs. For maximum SQLite portability in this take-home setup, images are persisted as a JSON-encoded string and mapped to `string[]` at the API boundary. This keeps the public API contract clean while avoiding database-specific JSON behavior.
- Prices are stored as whole numbers.
- Bounding-box filtering uses simple latitude/longitude comparisons, not PostGIS.
- SQLite is used for easy local review.
- Docker is included as a reviewer convenience, but the local npm workflow remains the primary setup path.
- Pagination defaults to `page=1` and `limit=10`.
- Map movement replaces/updates the current list with listings visible in the map area.

## Trade-Offs

- The API uses SQLite and simple indexes instead of a geospatial database because the requested bbox filtering is straightforward.
- City filtering is substring-based for a forgiving reviewer experience.
- Frontend state stays in React hooks; Redux/Zustand would be unnecessary for this slice.
- Leaflet with OpenStreetMap tiles was chosen because it is free, requires no API key, and is sufficient for demonstrating bbox-based map/list synchronization.
- The frontend intentionally uses local React state instead of a global store because the listing, filter, pagination, and map state are contained to one page.
- Known frontend limitation: map tile availability depends on OpenStreetMap network access.

## What I Would Build Next

- Add end-to-end tests around filter and map/list interactions.
- Add create-listing UI and image URL validation previews.
- Add first-class local image uploads instead of accepting only external URLs for created listings.
- Add saved search URLs with the bbox included when useful.
- Add richer sorting and a small city/price analytics summary.
- Add integration tests against a temporary SQLite database.

## AI Tool Usage Notes

This implementation was produced with AI assistance from Codex. I used AI to scaffold and review implementation details, but the code was still checked against the assignment requirements: type safety, API validation, bbox filtering, map/list synchronization, clean frontend/backend boundaries, and avoiding unnecessary abstractions.
