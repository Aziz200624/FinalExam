# Group (Community) CRUD Web Application

A Node.js CRUD web application for managing Groups (Communities) in a social media app.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ RESTful API endpoints
- ✅ PostgreSQL database integration
- ✅ Modern, responsive UI with HTML/CSS
- ✅ jQuery for AJAX requests
- ✅ Dynamic table display
- ✅ Form validation

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database:**
   - Create a database named `groupmarketdb` (or update the connection string in `.env`)
   - Update database credentials in a `.env` file (create one based on the example below)

3. **Create `.env` file:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=groupmarketdb
   DB_USER=postgres
   DB_PASSWORD=your_password
   PORT=3000
   ```

4. **Set up database tables:**
   ```bash
   npm run setup-db
   ```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

- `GET /items` - Get all groups
- `GET /items/:id` - Get a single group by ID
- `POST /items` - Create a new group
- `PUT /items/:id` - Update a group
- `DELETE /items/:id` - Delete a group

## Group Entity Fields

- `id` - Auto-incrementing primary key
- `name` - Group name (required)
- `description` - Group description (optional)
- `membersCount` - Number of members (default: 0)

## Project Structure

```
groupmarketapp/
├── server.js              # Express server and API routes
├── database.js            # PostgreSQL connection pool
├── setup-database.js      # Database table creation script
├── package.json           # Node.js dependencies
├── public/
│   ├── index.html         # Frontend HTML
│   ├── style.css          # Styling
│   └── app.js             # Frontend JavaScript with jQuery
└── README.md              # This file
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. View all groups in the table
3. Create a new group using the form
4. Edit a group by clicking the "Edit" button
5. Delete a group by clicking the "Delete" button

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, jQuery
- **Other:** dotenv, cors, pg

