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

describe('Comments API', () => {
  it('should fetch all comments', async () => {
    const res = await request(app).get('/comments');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should fetch a comment by ID', async () => {
    const id = '64e6b893b3df4c1f8cf5030e';
    const res = await request(app).get(`/comments/${id}`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it('should return 400 for invalid comment ID', async () => {
    const res = await request(app).get('/comments/invalid-id');
    expect(res.statusCode).toBe(400);
  });

  it('should return 404 for non-existent comment ID', async () => {
    const res = await request(app).get('/comments/64e6a313a4f1e1c4a5b55557');
    expect(res.statusCode).toBe(404);
  });
});