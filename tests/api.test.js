const request = require('supertest');
const pool = require('../database');
const app = require('../server');

jest.mock('../database', () => ({
  query: jest.fn(),
  getDbConnectionStatus: jest.fn().mockResolvedValue({ ok: true }),
}));

describe('Groups API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /items returns all groups', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 1, name: 'Gamers', description: 'Gaming', membersCount: 12 }],
    });

    const response = await request(app).get('/items');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test('GET /items returns 500 on db failure', async () => {
    pool.query.mockRejectedValue(new Error('db down'));

    const response = await request(app).get('/items');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });

  test('GET /items/:id returns a single group', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 5, name: 'Readers', description: 'Books', membersCount: 8 }],
    });

    const response = await request(app).get('/items/5');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(5);
  });

  test('GET /items/:id returns 404 for missing group', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).get('/items/999');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Group not found');
  });

  test('POST /items returns 400 when name is missing', async () => {
    const response = await request(app).post('/items').send({
      description: 'No name',
      membersCount: 3,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Name is required');
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('POST /items creates new group', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 10, name: 'Travelers', description: 'Trips', membersCount: 20 }],
    });

    const response = await request(app).post('/items').send({
      name: 'Travelers',
      description: 'Trips',
      membersCount: 20,
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Travelers');
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test('PUT /items/:id returns 400 when name is missing', async () => {
    const response = await request(app).put('/items/2').send({
      description: 'Update only',
      membersCount: 11,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Name is required');
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('PUT /items/:id updates group', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 2, name: 'Updated', description: 'Edited', membersCount: 15 }],
    });

    const response = await request(app).put('/items/2').send({
      name: 'Updated',
      description: 'Edited',
      membersCount: 15,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated');
  });

  test('PUT /items/:id returns 404 if group not found', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).put('/items/404').send({
      name: 'Updated',
      description: 'Edited',
      membersCount: 15,
    });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Group not found');
  });

  test('DELETE /items/:id deletes group', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: 7, name: 'Delete me', description: 'Temp', membersCount: 1 }],
    });

    const response = await request(app).delete('/items/7');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Group deleted successfully');
    expect(response.body.group.id).toBe(7);
  });

  test('DELETE /items/:id returns 404 when missing', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const response = await request(app).delete('/items/777');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Group not found');
  });

  test('DELETE /items/:id returns 500 on db failure', async () => {
    pool.query.mockRejectedValue(new Error('db down'));

    const response = await request(app).delete('/items/4');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');
  });
});
