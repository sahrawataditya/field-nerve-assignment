# Field Nerve API

RESTful API for managing vendors, works, and document uploads with Cloudinary integration. Built with Express 5 and Prisma.

### Live URLs

- **Server** — [https://field-nerve-assignment.onrender.com/health](https://field-nerve-assignment.onrender.com/health)
- **API Docs** — [https://field-nerve-assignment.onrender.com/api-docs](https://field-nerve-assignment.onrender.com/api-docs/)

### Loom Screen Recordings

- **Part 1** — [https://www.loom.com/share/ab479a1abe644e629a703a97fb9dd5ae](https://www.loom.com/share/ab479a1abe644e629a703a97fb9dd5ae)
- **Part 2** — [https://www.loom.com/share/61a490c5cc734a0b811dbd32bfdd9b95](https://www.loom.com/share/61a490c5cc734a0b811dbd32bfdd9b95)

## Project Architecture

```
Client → Express 5 → Routes → Controllers → Prisma ORM / Cloudinary SDK → PostgreSQL / Cloudinary
```

The application follows a layered architecture:

| Layer | Files | Responsibility |
|-------|-------|----------------|
| **Entry** | `index.js` | Server bootstrap, middleware setup (CORS, JSON, morgan), Swagger UI mount |
| **Routes** | `src/routes/*.router.js` | Map HTTP methods + paths to controller functions |
| **Controllers** | `src/controllers/*.controller.js` | Request validation, business logic, response formatting |
| **Lib** | `src/lib/prisma/index.js` | Prisma client instance with PostgreSQL adapter |
| **Lib** | `src/lib/cloudinary/index.js` | Cloudinary v2 config + `uploadToCloudinary()` helper |
| **Middleware** | `src/middleware/upload.js` | Multer memory storage for multipart file uploads |

## Database Design

Three PostgreSQL models with one relationship:

```
Vendor (1) ─────── (many) Document
  id                     id
  name                   name
  email                  doc_url
  vendor_type?           vendorId (FK → Vendor.id)
  category (enum)
  operating_location?
  status (enum)
  rating

Work (standalone)
  id
  title
  category (enum)
  location
  estimated_value?
  priority
  expecetedDate?
```

**Enums:**

| Enum | Values |
|------|--------|
| `Status` | `free`, `open`, `close` |
| `Categories` | `technology`, `healthcare`, `education`, `finance`, `retail`, `logistics` |

## API Design

- **Base URL:** `/api`
- **Resource grouping:** Vendors, Works, and Documents each have their own prefix
- **Success response:** `{ messsage, success: true, data? }`
- **Error response:** `{ error, success: false }`
- **Documentation:** OpenAPI 3.0 spec auto-generated from JSDoc annotations, viewable at `/api-docs`

### Endpoints

#### Vendors — `/api/vendor`

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/vendor` | Get all vendors |
| `GET` | `/api/vendor/:id` | Get vendor by ID |
| `GET` | `/api/vendor/docs/:id` | Get documents for a vendor |
| `POST` | `/api/vendor/create` | Create a vendor |
| `PUT` | `/api/vendor/update/:id` | Update a vendor |
| `DELETE` | `/api/vendor/delete/:id` | Delete a vendor |
| `DELETE` | `/api/vendor/delete-all` | Delete all vendors |

#### Works — `/api/work`

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/work/all` | Get all works |
| `GET` | `/api/work/:id` | Get work by ID |
| `GET` | `/api/work/work-recommendation/:workId` | Get recommended vendors for a work |
| `POST` | `/api/work/create` | Create a work |
| `PUT` | `/api/work/update/:id` | Update a work |

#### Documents — `/api/document`

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/document/upload/:vendorId` | Upload documents for a vendor (multipart) |

#### Health

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | Health check |

## Recommendation Logic

The `/api/work/work-recommendation/:workId` endpoint scores every vendor against the given work and returns them sorted by relevance.

### Scoring formula

| Criterion | Weight | Logic |
|-----------|--------|-------|
| Category match | +30 | `vendor.category === work.category` |
| Location match | +25 | Fuzzy word overlap between `work.location` and `vendor.operating_location` (case-insensitive) |
| Rating | up to +40 | `vendor.rating * 4` |
| Has documents | +15 | `vendor.documents.length > 0` |
| Vendor type set | +10 | `vendor.vendor_type` is not null |
| Status: free | +20 | Available immediately |
| Status: open | +10 | Open to work |
| Status: close | -20 | Unavailable (included at bottom with penalty) |

**Max possible score: ~140 points**

Each result includes a `matched_on` array explaining which criteria contributed to the score, so callers can understand why a vendor was recommended.

### Example

A `technology` work in `"New York"` would rank a `technology` vendor with `rating: 8`, `status: free`, and documents in `"New York, NY"` at the top (score: `30 + 25 + 32 + 15 + 10 + 20 = 132`).

## AI Usage

AI assistants (Claude/Copilot) were used during development to:

- Generate the Cloudinary upload module (`src/lib/cloudinary/index.js`)
- Design and implement the work recommendation scoring algorithm
- Write Swagger/OpenAPI JSDoc annotations for all endpoints
- Generate this README documentation

All AI-generated code was reviewed, tested, and validated against project requirements before integration.

## Assumptions

1. **Category alignment** — Vendor and Work share the same `Categories` enum, enabling direct equality matching. If categories diverge in the future, a mapping layer would be needed.
2. **Location matching** — Uses word-level overlap instead of geocoding or distance calculations. A vendor in `"New York, NY"` matches work in `"New York"`, but `"Brooklyn"` would not match `"New York"`.
3. **Rating scale** — Vendor rating is 0–10. The multiplier (`* 4`) assumes a linear correlation between rating and suitability.
4. **Document availability** — Having any document is treated as a positive signal. The system does not evaluate document content or relevance.
5. **File upload limit** — Set to 10 MB per file. Larger files are rejected by the multer middleware.
6. **Close-status vendors** — Included in results with a penalty rather than excluded, so clients can still discover them.

## Trade-offs

1. **In-memory scoring vs database query** — All vendors are fetched and scored in JavaScript. This keeps the logic simple and auditable but won't scale beyond a few hundred vendors. At larger scales, scoring should be moved to SQL or a dedicated search index.
2. **Word-level location vs geocoding** — No external API dependency means faster responses and no cost, but it misses semantically equivalent locations (e.g., `"NYC"` vs `"New York City"`).
3. **Memory storage for uploads** — `multer.memoryStorage()` buffers files in RAM before uploading to Cloudinary. This avoids writing temp files to disk but consumes memory proportional to file size.
4. **Single Categories enum** — Sharing one enum between Vendors and Works simplifies the match but means adding a new category affects both resources simultaneously.
5. **No pagination on recommendations** — The endpoint returns all scored vendors at once. For large vendor datasets, pagination or a minimum-score threshold would be necessary.

## Prerequisites

- Node.js 18+
- PostgreSQL

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/sahrawataditya/field-nerve-assignment.git
cd field-nerve-assignment

# 2. Install dependencies (use any package manager)
npm install
# or
yarn install
# or
pnpm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Configure your .env.local with database and Cloudinary credentials

# 5. Run database migrations
npx prisma migrate dev
# or
yarn prisma migrate dev
# or
pnpm run db:migrate

# 6. Generate Prisma Client
npx prisma generate
# or
pnpm run db:generate

# 7. Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Server starts on `http://localhost:3030`.

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **ORM:** Prisma 7
- **Database:** PostgreSQL
- **File Storage:** Cloudinary
- **Documentation:** Swagger (OpenAPI 3.0)
