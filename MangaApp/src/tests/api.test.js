import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

describe('API Endpoints', () => {
  let authToken;
  let testUserId;

  // Test đăng ký và đăng nhập
  describe('Authentication', () => {
    const testUser = {
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123'
    };

    test('should register a new user', async () => {
      const response = await axios.post(`${API_URL}/auth/register`, testUser);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user).toHaveProperty('id');
      testUserId = response.data.user.id;
    });

    test('should login with registered user', async () => {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      authToken = response.data.token;
    });
  });

  // Test bookmarks
  describe('Bookmarks', () => {
    const testMangaId = 'test-manga-123';

    test('should add manga to bookmarks', async () => {
      const response = await axios.post(
        `${API_URL}/bookmarks`,
        { mangaId: testMangaId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('mangaId', testMangaId);
    });

    test('should get user bookmarks', async () => {
      const response = await axios.get(`${API_URL}/bookmarks`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.some(bookmark => bookmark.mangaId === testMangaId)).toBe(true);
    });

    test('should remove manga from bookmarks', async () => {
      const response = await axios.delete(`${API_URL}/bookmarks/${testMangaId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      expect(response.status).toBe(200);
    });
  });

  // Test user profile
  describe('User Profile', () => {
    test('should get user profile', async () => {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id', testUserId);
    });

    test('should update user profile', async () => {
      const updateData = {
        username: `updated${Date.now()}`,
        bio: 'Test bio'
      };
      const response = await axios.put(
        `${API_URL}/users/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('username', updateData.username);
      expect(response.data).toHaveProperty('bio', updateData.bio);
    });
  });

  // Cleanup sau khi test xong
  afterAll(async () => {
    if (testUserId) {
      try {
        await axios.delete(`${API_URL}/users/${testUserId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
      } catch (error) {
        console.error('Error cleaning up test user:', error);
      }
    }
  });
}); 