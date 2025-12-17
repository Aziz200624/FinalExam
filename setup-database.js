const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'groupmarketdb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

async function setupDatabase() {
  try {
    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        "membersCount" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database table "groups" created successfully!');
    
    // Check if table is empty and insert sample data
    const result = await pool.query('SELECT COUNT(*) FROM groups');
    if (result.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO groups (name, description, "membersCount") VALUES
        ('Tech Enthusiasts', 'A community for technology lovers', 150),
        ('Photography Club', 'Share and learn photography techniques', 89),
        ('Book Readers', 'Discuss your favorite books and authors', 203)
      `);
      console.log('Sample data inserted!');
    }
    
    await pool.end();
    console.log('Database setup completed!');
  } catch (error) {
    console.error('Error setting up database:', error);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();

