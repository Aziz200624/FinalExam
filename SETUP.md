# Quick Setup Guide

## Step 1: Install Dependencies
✅ Done - Run `npm install` (already completed)

## Step 2: Set Up PostgreSQL Database

1. **Create a PostgreSQL database:**
   - Open PostgreSQL command line or pgAdmin
   - Create a database: `CREATE DATABASE groupmarketdb;`

2. **Create `.env` file** in the project root with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=groupmarketdb
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   PORT=3000
   ```

3. **Set up the database tables:**
   ```bash
   npm run setup-db
   ```

## Step 3: Start the Server

```bash
npm start
```

The application will be available at: http://localhost:3000

## Troubleshooting

- If you get connection errors, check your PostgreSQL service is running
- Verify your database credentials in the `.env` file
- Make sure the database `groupmarketdb` exists before running setup-db

