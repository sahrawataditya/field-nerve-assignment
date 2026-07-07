# Field Nerve API

RESTful API for managing vendors, works, and document uploads with Cloudinary integration. Built with Express 5 and Prisma.

## Prerequisites

- Node.js 18+
- PostgreSQL
- pnpm

## Setup

```bash
# 1. Clone and install dependencies (npm / yarn / pnpm)
pnpm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Configure your .env.local with database and Cloudinary credentials

# 4. Run database migrations
pnpm run db:migrate

# 5. Generate Prisma Client
pnpm run db:generate

# 6. Start development server
pnpm dev
```

Server starts on `http://localhost:3030`.

## API Documentation

Interactive Swagger UI: [`http://localhost:3030/api-docs`](http://localhost:3030/api-docs)

## Endpoints

### Vendors

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/vendor` | Get all vendors |
| `GET` | `/api/vendor/:id` | Get vendor by ID |
| `GET` | `/api/vendor/docs/:id` | Get vendor documents |
| `POST` | `/api/vendor/create` | Create a vendor |
| `PUT` | `/api/vendor/update/:id` | Update a vendor |
| `DELETE` | `/api/vendor/delete/:id` | Delete a vendor |
| `DELETE` | `/api/vendor/delete-all` | Delete all vendors |

### Works

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/work/all` | Get all works |
| `GET` | `/api/work/:id` | Get work by ID |
| `GET` | `/api/work/work-recommendation/:workId` | Get recommended vendors for a work |
| `POST` | `/api/work/create` | Create a work |
| `PUT` | `/api/work/update/:id` | Update a work |

### Documents

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/document/upload/:vendorId` | Upload documents for a vendor |

### Health

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/health` | Health check |

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **ORM:** Prisma 7
- **Database:** PostgreSQL
- **File Storage:** Cloudinary
- **Documentation:** Swagger (OpenAPI 3.0)
