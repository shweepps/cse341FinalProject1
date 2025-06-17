const request = require('supertest');
const app = require('../server'); 
const { initDb } = require('../db/connection');


beforeAll((done) => {
  initDb((err, db) => {
    if (err) {
      done(err);
    } else {
      done();
    }
  });
});

describe('Favorites API', () => {
  it('should fetch all favorites', async () => {
    const res = await request(app).get('/favorites');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a favorite by ID', async () => {
    const id = '64e6b893b3df4c1f8cf5030f';
    const res = await request(app).get(`/favorites/${id}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should return 400 for invalid favorite ID', async () => {
    const res = await request(app).get('/favorites/invalid-id');
    expect(res.statusCode).toBe(400);
  });

  it('should return 404 for non-existent favorite ID', async () => {
    const res = await request(app).get('/favorites/64e6a313a4f1e1c4a5b55558');
    expect(res.statusCode).toBe(404);
  });
});
