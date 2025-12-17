const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET /items - Get all groups
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, description, "membersCount", "createdAt", "updatedAt" FROM groups ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /items/:id - Get a single group
app.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, description, "membersCount", "createdAt", "updatedAt" FROM groups WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /items - Create a new group
app.post('/items', async (req, res) => {
  try {
    const { name, description, membersCount } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const result = await pool.query(
      'INSERT INTO groups (name, description, "membersCount") VALUES ($1, $2, $3) RETURNING *',
      [name, description || null, membersCount || 0]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /items/:id - Update a group
app.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, membersCount } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const result = await pool.query(
      'UPDATE groups SET name = $1, description = $2, "membersCount" = $3, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, description || null, membersCount || 0, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /items/:id - Delete a group
app.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM groups WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    res.json({ message: 'Group deleted successfully', group: result.rows[0] });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

