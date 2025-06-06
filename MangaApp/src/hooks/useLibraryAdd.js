import { useState, useEffect } from 'react';
import api from '../utils/axios';

export const useLibraryAdd = (mangaId) => {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkLibrary = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Checking library - Current user:', user);

      // Kiểm tra token trong localStorage
      if (!user.token) {
        console.log('No token found in localStorage');
        setIsLoading(false);
        setIsAuthenticated(false);
        return;
      }

      // Nếu có token, coi như đã xác thực
      console.log('Token found, setting isAuthenticated to true');
      setIsAuthenticated(true);

      // Kiểm tra library
      console.log('Making request to /bookmarks');
      const response = await api.get('/bookmarks');
      console.log('Bookmarks response (MangaDex IDs):', response.data);
      const bookmarkedMangaDexIds = response.data; // This should be an array of strings

      // Correctly check if the current mangaId (string) is in the array of strings
      setIsInLibrary(bookmarkedMangaDexIds.includes(mangaId));

      setIsLoading(false);
    } catch (error) {
      console.error('Error checking library:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      // Nếu lỗi 401, chỉ đánh dấu là chưa xác thực
      if (error.response?.status === 401) {
        console.log('Unauthorized access, marking as unauthenticated');
        setIsAuthenticated(false);
        setError(null);
      } else {
        setError(error.response?.data?.message || 'Error checking library');
      }
      setIsLoading(false);
    }
  };

  const changeLibraryValue = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Adding to library - Current user:', user);

      if (!user.token) {
        console.log('No token found in localStorage');
        return;
      }

      if (isInLibrary) {
        console.log('Removing from library');
        await api.delete(`/bookmarks/${mangaId}`);
      } else {
        console.log('Adding to library');
        await api.post('/bookmarks', { mangaId });
      }
      // Sau khi thay đổi thành công, gọi lại checkLibrary để lấy trạng thái mới nhất từ backend
      await checkLibrary();
      // Optionally reset error after successful operation
      setError(null);
    } catch (error) {
      console.error('Error updating library:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      // Nếu lỗi 401, chỉ đánh dấu là chưa xác thực
      if (error.response?.status === 401) {
        console.log('Unauthorized access, marking as unauthenticated');
        setIsAuthenticated(false);
        setError('Authentication failed. Please log in again.');
      } else {
        setError(error.response?.data?.message || 'Error updating library');
      }
    }
  };

  useEffect(() => {
    console.log('useLibraryAdd effect triggered with mangaId:', mangaId);
    checkLibrary();
  }, [mangaId]);

  return { isInLibrary, isLoading, error, changeLibraryValue, isAuthenticated };
};
