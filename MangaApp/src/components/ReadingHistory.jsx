import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMangaCover } from '../helpers/mangaApi';

export const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement actual history fetching logic
    // For now, just get from localStorage
    const userHistory = JSON.parse(localStorage.getItem('readingHistory')) || [];
    setHistory(userHistory);
    setIsLoading(false);
  }, []);

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
            key={item.id}
            className="bg-stone-900 rounded-lg overflow-hidden hover:bg-stone-800 transition-colors"
          >
            <Link
              to={`/manga/${item.title}`}
              state={item.id}
              className="flex items-center p-4"
            >
              <img
                src={getMangaCover(item.id, item.coverFileName)}
                alt={item.title}
                className="w-24 h-32 object-cover rounded"
              />
              <div className="ml-4">
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Last read: {new Date(item.lastRead).toLocaleDateString()}
                </p>
                <p className="text-gray-400 text-sm">
                  Chapter: {item.chapter}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}; 