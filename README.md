# FixIt Civic Platform — Backend (starter)

This is a minimal starter backend scaffold for the FixIt civic platform. It implements basic report storage and APIs, following the `Backend Guide.md` in the repository.

Quick steps

1. Copy `.env.example` to `.env` and edit `MONGO_URI` (or use local MongoDB).
2. Install dependencies:

```bash
npm install
```

3. Seed demo data (optional):

```bash
npm run seed
```

4. Run the server in development:

```bash
npm run dev
```

API endpoints

- POST /api/reports — create a report
- GET /api/reports — list reports (supports `?status=` and `?owner=`)
- PATCH /api/reports/:id/upvote — increment votes and recalc priority
- PATCH /api/reports/:id/status — update status

Notes

- `seed.js` inserts 50 dummy reports clustered near a demo location. It uses `faker` for addresses.
- The `utils` folder contains `calculatePriority` and `smartRouting` utilities mentioned in the guide.
