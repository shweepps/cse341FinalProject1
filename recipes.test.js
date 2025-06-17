const request = require('supertest');
const app = require('./server'); 
const { initDb } = require('./db/connection');


beforeAll((done) => {
  initDb((err, db) => {
    if (err) {
      done(err);
    } else {
      done();
    }
  });
});


describe('Recipes API', () => {
  it('should fetch all recipes', async () => {
    const res = await request(app).get('/recipes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a recipe by ID', async () => {
    const id = '684f32d431875c50de2e4493'; 
    const res = await request(app).get(`/recipes/${id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title');
  });

  it('should return 400 for invalid recipe ID', async () => {
    const res = await request(app).get('/recipes/684f32d431e4493');
    expect(res.statusCode).toBe(400);
  });

  it('should return 404 for non-existent recipe ID', async () => {
    const res = await request(app).get('/recipes/684f32d431875c50de2e4473'); 
    expect(res.statusCode).toBe(404);
  });
});


