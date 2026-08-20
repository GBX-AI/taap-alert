# backend

Not built in this prototype.

The frontend talks to the forecast platform through `frontend/lib/data/provider.ts`,
and the HTTP implementation in `frontend/lib/data/http.ts` documents the contract
it expects:

```
GET  /v1/units/districts
GET  /v1/forecast/days
GET  /v1/forecast/{blockId}?day={n}
GET  /v1/shelters?block={blockId}
POST /v1/shelters/{id}/status        { open: boolean }
GET  /v1/advisories/queue?district={id}
POST /v1/advisories/approve          { blockIds: string[] }
POST /api/auth/otp/request           { phone }
POST /api/auth/otp/verify            { requestId, code }
```

Per FRD §10.1 the real service is FastAPI over PostgreSQL + PostGIS, with the
ingestion and downscaling pipeline on Airflow or Prefect.
