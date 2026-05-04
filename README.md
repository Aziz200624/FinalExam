# Group Management App

Simple CRUD app for managing groups/communities with REST API, web UI, and automated testing.

## Stack

- Node.js + Express
- PostgreSQL (current backend)
- HTML + jQuery frontend
- Jest + SuperTest (API tests with mocked DB)
- Cypress (E2E tests)
- Artillery (load testing)

## Setup

Install dependencies:
```
npm install
```

Create `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=groupmarketdb
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
```

Create DB + table:
```
npm run setup-db
```

Start server:
```
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## REST API

- `GET /items` - get all groups
- `GET /items/:id` - get one group
- `POST /items` - create group
- `PUT /items/:id` - update group
- `DELETE /items/:id` - delete group

## Automated Testing

Run API tests:
```
npm test
```

Run API tests with coverage:
```
npm run test:coverage
```

Run Cypress E2E tests (requires running server):
```
npm run test:e2e
```

Alternative one-command E2E run:
```
npm run test:e2e:with-server
```

## Load Testing (Artillery)

Run load scenario:
```
npm run load:test
```

Generate markdown summary from JSON output:
```
npm run load:report
```

Artifacts are stored in `reports/`:
- `artillery-report.json`
- `artillery-summary.md`

## MongoDB / PostgreSQL manual switch guide

Current code uses PostgreSQL in `database.js`.  
For your defense/demo, you can keep this project as PostgreSQL implementation and present MongoDB as an alternative adapter approach:

1. Keep API contract unchanged (`/items` CRUD).
2. Implement repository layer with methods:
   - `getAll`
   - `getById`
   - `create`
   - `update`
   - `remove`
3. Create two implementations:
   - Postgres repository (existing SQL)
   - Mongo repository (Mongoose or native driver)
4. Switch by env variable (for example `DB_CLIENT=postgres|mongo`).
5. In Jest tests, mock repository methods (never real DB connections).

## Project Structure

- `server.js` - Express app with CRUD routes
- `database.js` - PostgreSQL connection
- `setup-database.js` - DB/table initialization
- `tests/api.test.js` - Jest + SuperTest tests (DB mocked)
- `cypress/e2e/groups.cy.js` - E2E tests
- `artillery/groups-load.yml` - load scenario
- `scripts/artillery-summary.js` - load report summary generator
