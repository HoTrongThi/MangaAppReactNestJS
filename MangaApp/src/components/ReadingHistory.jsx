import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMangaCover } from '../helpers/mangaApi';
import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = userData?.token;

        if (!token) {
          setError('You need to be logged in to view history.');
          setIsLoading(false);
          return;
        }

        const response = await api.get(
          '/history',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setHistory(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch reading history:', err);
        setError('Failed to load history. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Reading History</h1>
          <Link to="/" className="text-blue-500 hover:text-blue-400">
            Back to Home
          </Link>
        </div>
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading w-8 h-8 border-8 rounded-full border-t-slate-900 animate-spin"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Reading History</h1>
          <Link to="/" className="text-blue-500 hover:text-blue-400">
            Back to Home
          </Link>
        </div>
        <div className="text-center text-gray-400">
          <p>Your reading history is empty.</p>
          <p className="mt-2">
            Start reading some manga to see your history here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Reading History</h1>
        <Link to="/" className="text-blue-500 hover:text-blue-400">
          Back to Home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div
            key={item.manga.id}
            className="bg-stone-900 rounded-lg overflow-hidden hover:bg-stone-800 transition-colors"
          >
            <Link
              to={`/manga/${item.manga.title}`}
              state={{ mangaId: item.manga.id, chapterNumber: item.chapterNumber, pageNumber: item.pageNumber }}
              className="flex items-center p-4"
            >
              <img
                src={getMangaCover(item.manga.id, item.manga.coverFileName)}
                alt={item.manga.title}
                className="w-24 h-32 object-cover rounded"
              />
              <div className="ml-4">
                <h3 className="text-white font-semibold">{item.manga.title}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Last read: {new Date(item.updatedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-400 text-sm">
                  Chapter: {item.chapterNumber}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}; 