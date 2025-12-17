# Group Management App

Simple CRUD app for managing groups/communities. Built with Node.js and PostgreSQL.

## Stack

- Node.js, Express
- PostgreSQL
- jQuery for frontend

## Setup

Install dependencies:
```
npm install
```

Create PostgreSQL database called `groupmarketdb`

Create `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=groupmarketdb
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
```

Run db setup:
```
npm run setup-db
```

Start server:
```
npm start
```

Open http://localhost:3000

## API

- GET /items - get all groups
- GET /items/:id - get single group
- POST /items - create group
- PUT /items/:id - update group
- DELETE /items/:id - delete group

## DB Schema

groups table:
- id (serial pk)
- name (varchar)
- description (text)
- membersCount (int)
- createdAt, updatedAt (timestamps)

## Files

- server.js - express server and routes
- database.js - pg connection
- setup-database.js - creates tables
- public/ - frontend stuff
