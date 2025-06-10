import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ContributorPanel = () => {
  const [user, setUser] = useState(null);
  const [mangas, setMangas] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingManga, setEditingManga] = useState(null);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [selectedManga, setSelectedManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isChaptersModalOpen, setIsChaptersModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      setUser(currentUser);

      if (currentUser && currentUser.token) {
        // Fetch contributor's mangas
        const mangaResponse = await axios.get('http://localhost:3001/api/contributor/manga', {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        setMangas(mangaResponse.data);

        // Fetch comments for contributor's mangas
        const commentsResponse = await axios.get('http://localhost:3001/api/contributor/comments', {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        setComments(commentsResponse.data);
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
        await axios.delete(`http://localhost:3001/api/contributor/manga/${mangaId}`, {
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
      await axios.put(`http://localhost:3001/api/contributor/manga/${editingManga.id}`, editingManga, {
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

  const handleViewChapters = async (manga) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:3001/api/contributor/manga/${manga.id}/chapters`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
      setChapters(response.data);
      setSelectedManga(manga);
      setIsChaptersModalOpen(true);
    } catch (err) {
      console.error('Error fetching chapters:', err);
      toast.error('Failed to load chapters');
    }
  };

  const handleDeleteChapter = async (mangaId, chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        await axios.delete(`http://localhost:3001/api/contributor/manga/${mangaId}/chapters/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        toast.success('Chapter deleted successfully');
        handleViewChapters(selectedManga); // Refresh chapters list
      } catch (err) {
        console.error('Error deleting chapter:', err);
        toast.error('Failed to delete chapter');
      }
    }
  };

  // Comment handlers
  const handleDeleteComment = async (mangaId, commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        await axios.delete(`http://localhost:3001/api/contributor/manga/${mangaId}/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
        toast.success('Comment deleted successfully');
        fetchData();
      } catch (err) {
        console.error('Error deleting comment:', err);
        toast.error('Failed to delete comment');
      }
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Manga Management section */}
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
                        onClick={() => handleViewChapters(manga)}
                        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Chapters
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

        {/* Comments Management section */}
        <div className="bg-stone-900 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Comments Management</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-neutral-800 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">{comment.user.username}</h3>
                    <p className="text-gray-400">{comment.content}</p>
                    <p className="text-gray-400 text-sm">Manga: {comment.manga.title}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    comment.isHidden ? 'bg-red-600' : 'bg-green-600'
                  } text-white`}>
                    {comment.isHidden ? 'Hidden' : 'Visible'}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handleDeleteComment(comment.manga.id, comment.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
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
                    rows="4"
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
              </div>
              <div className="flex justify-end gap-2 mt-4">
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

      {/* Chapters Modal */}
      {isChaptersModalOpen && selectedManga && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-stone-900 p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Chapters for {selectedManga.title}</h2>
              <div className="flex gap-2">
                <Link
                  to={`/contributor/manga/${selectedManga.id}/chapters/new`}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add New Chapter
                </Link>
                <button
                  onClick={() => setIsChaptersModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="bg-neutral-800 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-semibold">Chapter {chapter.chapterNumber}</h3>
                      <p className="text-gray-400">{chapter.title}</p>
                    </div>
                    <div className="flex gap-2">
                      {/* <Link
                        to={`/contributor/manga/${selectedManga.id}/chapters/${chapter.id}/edit`}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </Link> */}
                      <button
                        onClick={() => handleDeleteChapter(selectedManga.id, chapter.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 