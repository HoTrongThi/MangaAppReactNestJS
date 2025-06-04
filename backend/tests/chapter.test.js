const request = require('supertest');
const app = require('../app');
const Manga = require('../models/Manga');
const Chapter = require('../models/Chapter');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Chapter API', () => {
  let token;
  let adminToken;
  let manga;
  let chapter;

  beforeEach(async () => {
    await Chapter.deleteMany({});
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

    // Create test chapter
    chapter = await Chapter.create({
      mangaId: manga._id,
      chapterNumber: 1,
      title: 'Chapter 1',
      pages: ['page1.jpg', 'page2.jpg'],
      uploadDate: new Date()
    });
  });

  describe('GET /api/manga/:mangaId/chapters', () => {
    it('should get all chapters for a manga', async () => {
      const response = await request(app)
        .get(`/api/manga/${manga._id}/chapters`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('chapterNumber', 1);
    });

    it('should return 404 for non-existent manga', async () => {
      const response = await request(app)
        .get('/api/manga/123456789012/chapters');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/manga/:mangaId/chapters/:chapterNumber', () => {
    it('should get chapter by number', async () => {
      const response = await request(app)
        .get(`/api/manga/${manga._id}/chapters/1`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('chapterNumber', 1);
      expect(response.body).toHaveProperty('title', 'Chapter 1');
    });

    it('should return 404 for non-existent chapter', async () => {
      const response = await request(app)
        .get(`/api/manga/${manga._id}/chapters/999`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/manga/:mangaId/chapters', () => {
    it('should create new chapter as admin', async () => {
      const chapterData = {
        chapterNumber: 2,
        title: 'Chapter 2',
        pages: ['page1.jpg', 'page2.jpg']
      };

      const response = await request(app)
        .post(`/api/manga/${manga._id}/chapters`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(chapterData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('chapterNumber', 2);
      expect(response.body).toHaveProperty('title', 'Chapter 2');
    });

    it('should not create chapter as regular user', async () => {
      const chapterData = {
        chapterNumber: 2,
        title: 'Chapter 2'
      };

      const response = await request(app)
        .post(`/api/manga/${manga._id}/chapters`)
        .set('Authorization', `Bearer ${token}`)
        .send(chapterData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post(`/api/manga/${manga._id}/chapters`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/manga/:mangaId/chapters/:chapterNumber', () => {
    it('should update chapter as admin', async () => {
      const updateData = {
        title: 'Updated Chapter 1',
        pages: ['page1.jpg', 'page2.jpg', 'page3.jpg']
      };

      const response = await request(app)
        .put(`/api/manga/${manga._id}/chapters/1`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', updateData.title);
      expect(response.body.pages).toHaveLength(3);
    });

    it('should not update chapter as regular user', async () => {
      const updateData = {
        title: 'Updated Chapter 1'
      };

      const response = await request(app)
        .put(`/api/manga/${manga._id}/chapters/1`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/manga/:mangaId/chapters/:chapterNumber', () => {
    it('should delete chapter as admin', async () => {
      const response = await request(app)
        .delete(`/api/manga/${manga._id}/chapters/1`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      const deletedChapter = await Chapter.findOne({
        mangaId: manga._id,
        chapterNumber: 1
      });
      expect(deletedChapter).toBeNull();
    });

    it('should not delete chapter as regular user', async () => {
      const response = await request(app)
        .delete(`/api/manga/${manga._id}/chapters/1`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 