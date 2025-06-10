import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddChapterForm = () => {
  const navigate = useNavigate();
  const { mangaId } = useParams();
  const [formData, setFormData] = useState({
    chapterNumber: '',
    title: '',
    isVisible: true
  });
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      setIsUploading(true);
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const token = user?.token;

      if (!token) {
        toast.error('Please log in to add chapter.');
        navigate('/login');
        return;
      }

      // First, create the chapter
      const chapterResponse = await axios.post(
        `http://localhost:3001/api/contributor/manga/${mangaId}/chapters`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const chapterId = chapterResponse.data.id;

      // Then, upload images
      const formDataImages = new FormData();
      images.forEach((image, index) => {
        formDataImages.append('images', image);
      });

      await axios.post(
        `http://localhost:3001/api/contributor/manga/${mangaId}/chapters/${chapterId}/images`,
        formDataImages,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Chapter added successfully!');
      navigate('/contributor');
    } catch (error) {
      console.error('Error adding chapter:', error);
      toast.error(error.response?.data?.message || 'Error adding chapter');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Add New Chapter</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Chapter Number</label>
          <input
            type="number"
            name="chapterNumber"
            value={formData.chapterNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-neutral-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md bg-neutral-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Chapter Images</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-neutral-700 rounded-md font-medium text-white hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload images</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB each</p>
            </div>
          </div>
        </div>

        {/* Preview uploaded images */}
        {images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-white mb-2">Uploaded Images ({images.length})</h3>
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isVisible"
            checked={formData.isVisible}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label className="ml-2 block text-sm text-white">
            Make this chapter visible to readers
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/contributor')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Chapter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddChapterForm; 