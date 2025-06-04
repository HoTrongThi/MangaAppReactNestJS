import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);
    
    // Mock data for mangas
    const mockMangas = [
      { id: 1, title: 'Manga 1', status: 'ongoing', chapters: 10 },
      { id: 2, title: 'Manga 2', status: 'completed', chapters: 20 },
    ];
    setMangas(mockMangas);
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-800">
        <div className="text-white text-xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-neutral-800 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Link
            to="/admin/manga/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add New Manga
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Manage Users
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-stone-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Manga Management</h2>
          <div className="space-y-4">
            {mangas.map((manga) => (
              <div key={manga.id} className="bg-neutral-800 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-semibold">{manga.title}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    manga.status === 'ongoing' ? 'bg-yellow-600' : 'bg-green-600'
                  } text-white`}>
                    {manga.status}
                  </span>
                </div>
                <p className="text-gray-400 mt-2">Chapters: {manga.chapters}</p>
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-800 p-3 rounded-md">
              <h3 className="text-gray-400">Total Manga</h3>
              <p className="text-2xl font-bold text-white">{mangas.length}</p>
            </div>
            <div className="bg-neutral-800 p-3 rounded-md">
              <h3 className="text-gray-400">Total Chapters</h3>
              <p className="text-2xl font-bold text-white">
                {mangas.reduce((acc, manga) => acc + manga.chapters, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 