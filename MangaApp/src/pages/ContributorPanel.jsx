import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ContributorPanel = () => {
  const [user, setUser] = useState(null);
  const [mangas, setMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingManga, setEditingManga] = useState(null);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      setUser(currentUser);

      if (currentUser && currentUser.token) {
        // Fetch mangas
        const mangaResponse = await axios.get('http://localhost:3001/api/manga', {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        setMangas(mangaResponse.data);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      setIsLoading(false);
    }
  };

  const handleEditManga = (manga) => {
    setEditingManga(manga);
    setIsMangaModalOpen(true);
  };

  const handleDeleteManga = async (mangaId) => {
    if (window.confirm('Are you sure you want to delete this manga?')) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        await axios.delete(`http://localhost:3001/api/manga/${mangaId}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        toast.success('Manga deleted successfully');
        fetchData();
      } catch (err) {
        console.error('Error deleting manga:', err);
        toast.error('Failed to delete manga');
      }
    }
  };

  const handleUpdateManga = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      await axios.patch(`http://localhost:3001/api/manga/${editingManga.id}`, editingManga, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      toast.success('Manga updated successfully');
      setIsMangaModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error updating manga:', err);
      toast.error('Failed to update manga');
    }
  };

  const handleMangaInputChange = (e) => {
    const { name, value } = e.target;
    setEditingManga(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user || user.role !== 'contributor') {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-800">
        <div className="text-white text-xl">Access Denied</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-800">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-neutral-800 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Contributor Panel</h1>
        <div className="flex gap-4">
          <Link
            to="/contributor/manga/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add New Manga
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-stone-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Manga Management</h2>
          <div className="space-y-4">
            {mangas.map((manga) => (
              <div key={manga.id} className="bg-neutral-800 p-3 rounded-md">
                <div className="flex gap-4">
                  <img 
                    src={manga.coverFileName} 
                    alt={`${manga.title} cover`}
                    className="w-24 h-32 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-white font-semibold">{manga.title}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        manga.status === 'ongoing' ? 'bg-yellow-600' : 'bg-green-600'
                      } text-white`}>
                        {manga.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mt-2">Author: {manga.author}</p>
                    <p className="text-gray-400">Description: {manga.description}</p>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={() => handleEditManga(manga)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteManga(manga.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manga Edit Modal */}
      {isMangaModalOpen && editingManga && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Manga</h2>
            <form onSubmit={handleUpdateManga}>
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editingManga.title}
                    onChange={handleMangaInputChange}
                    className="w-full p-2 rounded bg-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={editingManga.author}
                    onChange={handleMangaInputChange}
                    className="w-full p-2 rounded bg-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editingManga.description}
                    onChange={handleMangaInputChange}
                    className="w-full p-2 rounded bg-neutral-700 text-white"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Status</label>
                  <select
                    name="status"
                    value={editingManga.status}
                    onChange={handleMangaInputChange}
                    className="w-full p-2 rounded bg-neutral-700 text-white"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2">Cover Image URL</label>
                  <input
                    type="text"
                    name="coverFileName"
                    value={editingManga.coverFileName}
                    onChange={handleMangaInputChange}
                    className="w-full p-2 rounded bg-neutral-700 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsMangaModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 