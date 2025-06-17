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



describe('Users API', () => {
  it('should fetch all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a user by ID', async () => {
    const id = '684f338231875c50de2e449c';
    const res = await request(app).get(`/users/${id}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should return 400 for invalid user ID', async () => {
    const res = await request(app).get('/users/invalid-id');
    expect(res.statusCode).toBe(400);
  });

  it('should return 404 for non-existent user ID', async () => {
    const res = await request(app).get('/users/64e6a313a4f1e1c4a5b55556');
    expect(res.statusCode).toBe(404);
  });
});
