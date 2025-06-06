import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ContributorPanel = () => {
  const navigate = useNavigate();
  const [mangaList, setMangaList] = useState([]);
  const [selectedManga, setSelectedManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'contributor') {
      navigate('/login');
      return;
    }
    fetchMyManga();
  }, []);

  const fetchMyManga = async () => {
    try {
      const response = await axios.get('http://localhost:3000/contributor/manga', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setMangaList(response.data);
    } catch (error) {
      console.error('Error fetching manga:', error);
    }
  };

  const fetchMangaChapters = async (mangaId) => {
    try {
      const response = await axios.get(`http://localhost:3000/contributor/manga/${mangaId}/chapters`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setChapters(response.data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const fetchMangaComments = async (mangaId) => {
    try {
      const response = await axios.get(`http://localhost:3000/contributor/manga/${mangaId}/comments`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleMangaSelect = async (manga) => {
    setSelectedManga(manga);
    await fetchMangaChapters(manga.id);
    await fetchMangaComments(manga.id);
  };

  const handleDeleteManga = async (mangaId) => {
    if (window.confirm('Are you sure you want to delete this manga?')) {
      try {
        await axios.delete(`http://localhost:3000/contributor/manga/${mangaId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        fetchMyManga();
        setSelectedManga(null);
        setChapters([]);
        setComments([]);
      } catch (error) {
        console.error('Error deleting manga:', error);
      }
    }
  };

  const handleDeleteChapter = async (mangaId, chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      try {
        await axios.delete(`http://localhost:3000/contributor/manga/${mangaId}/chapters/${chapterId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        fetchMangaChapters(mangaId);
      } catch (error) {
        console.error('Error deleting chapter:', error);
      }
    }
  };

  const handleDeleteComment = async (mangaId, commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await axios.delete(`http://localhost:3000/contributor/manga/${mangaId}/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        fetchMangaComments(mangaId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contributor Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Manga List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My Manga</h2>
          <div className="space-y-4">
            {mangaList.map((manga) => (
              <div
                key={manga.id}
                className={`p-4 rounded cursor-pointer transition-colors ${
                  selectedManga?.id === manga.id
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => handleMangaSelect(manga)}
              >
                <h3 className="font-medium">{manga.title}</h3>
                <p className="text-sm text-gray-600">{manga.description}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteManga(manga.id);
                  }}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Chapters</h2>
          {selectedManga ? (
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="p-4 bg-gray-50 rounded">
                  <h3 className="font-medium">Chapter {chapter.chapterNumber}</h3>
                  <p className="text-sm text-gray-600">{chapter.title}</p>
                  <button
                    onClick={() => handleDeleteChapter(selectedManga.id, chapter.id)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Select a manga to view its chapters</p>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {selectedManga ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">{comment.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    By {comment.user.username} on{' '}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDeleteComment(selectedManga.id, comment.id)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Select a manga to view its comments</p>
          )}
        </div>
      </div>
    </div>
  );
}; 