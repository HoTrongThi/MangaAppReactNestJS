import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddMangaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    status: 'ongoing',
    coverFileName: '',
    genres: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (e) => {
    const genres = e.target.value.split(',').map(genre => genre.trim());
    setFormData(prev => ({
      ...prev,
      genres
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Lấy thông tin user từ localStorage, bao gồm cả token
      const userStr = localStorage.getItem('user');
      console.log('User string from localStorage:', userStr);
      
      const user = JSON.parse(userStr);
      console.log('Parsed user object:', user);
      
      const token = user?.token;
      console.log('Token:', token);

      if (!token) {
        toast.error('Please log in to add manga.');
        navigate('/login');
        return;
      }

      console.log('Sending request with data:', formData);
      console.log('Request headers:', {
        Authorization: `Bearer ${token}`
      });

      const response = await axios.post('http://localhost:3001/api/manga', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Response:', response.data);
      toast.success('Manga added successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error adding manga:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      toast.error(error.response?.data?.message || 'Error adding manga');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Manga</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="hiatus">Hiatus</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cover Image URL</label>
          <input
            type="text"
            name="coverFileName"
            value={formData.coverFileName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Genres (comma-separated)</label>
          <input
            type="text"
            name="genres"
            value={formData.genres.join(', ')}
            onChange={handleGenreChange}
            required
            placeholder="Action, Adventure, Fantasy"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/manga')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Manga
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMangaForm; 