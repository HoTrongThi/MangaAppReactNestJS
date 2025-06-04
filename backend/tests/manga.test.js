const request = require('supertest');
const app = require('../app');
const Manga = require('../models/Manga');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Manga API', () => {
  let token;
  let adminToken;
  let manga;

  beforeEach(async () => {
    await Manga.deleteMany({});
    await User.deleteMany({});

    // Create regular user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

    // Create test manga
    manga = await Manga.create({
      title: 'Test Manga',
      description: 'Test Description',
      author: 'Test Author',
      artist: 'Test Artist',
      status: 'ongoing',
      type: 'manga',
      coverFileName: 'test.jpg',
      genres: ['Action', 'Adventure']
    });
  });

  describe('GET /api/manga', () => {
    it('should get all manga', async () => {
      const response = await request(app)
        .get('/api/manga');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('title', manga.title);
    });

    it('should filter manga by status', async () => {
      const response = await request(app)
        .get('/api/manga?status=ongoing');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('status', 'ongoing');
    });

    it('should filter manga by type', async () => {
      const response = await request(app)
        .get('/api/manga?type=manga');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('type', 'manga');
    });
  });

  describe('GET /api/manga/:id', () => {
    it('should get manga by id', async () => {
      const response = await request(app)
        .get(`/api/manga/${manga._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', manga.title);
      expect(response.body).toHaveProperty('description', manga.description);
    });

    it('should return 404 for non-existent manga', async () => {
      const response = await request(app)
        .get('/api/manga/123456789012');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/manga', () => {
    it('should create new manga as admin', async () => {
      const mangaData = {
        title: 'New Manga',
        description: 'New Description',
        author: 'New Author',
        artist: 'New Artist',
        status: 'ongoing',
        type: 'manga',
        genres: ['Action']
      };

      const response = await request(app)
        .post('/api/manga')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mangaData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', mangaData.title);
    });

    it('should not create manga as regular user', async () => {
      const mangaData = {
        title: 'New Manga',
        description: 'New Description'
      };

      const response = await request(app)
        .post('/api/manga')
        .set('Authorization', `Bearer ${token}`)
        .send(mangaData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/manga')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/manga/:id', () => {
    it('should update manga as admin', async () => {
      const updateData = {
        title: 'Updated Manga',
        description: 'Updated Description'
      };

      const response = await request(app)
        .put(`/api/manga/${manga._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', updateData.title);
      expect(response.body).toHaveProperty('description', updateData.description);
    });

    it('should not update manga as regular user', async () => {
      const updateData = {
        title: 'Updated Manga'
      };

      const response = await request(app)
        .put(`/api/manga/${manga._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/manga/:id', () => {
    it('should delete manga as admin', async () => {
      const response = await request(app)
        .delete(`/api/manga/${manga._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      const deletedManga = await Manga.findById(manga._id);
      expect(deletedManga).toBeNull();
    });

    it('should not delete manga as regular user', async () => {
      const response = await request(app)
        .delete(`/api/manga/${manga._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 