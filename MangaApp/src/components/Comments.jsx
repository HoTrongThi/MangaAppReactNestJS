import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
import api from '../utils/axios'; // Import the configured axios instance

export const Comments = ({ mangaId }) => {
  // const { mangaId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [mangaId]);

  const fetchComments = async () => {
    try {
      if (mangaId) {
        // Sử dụng instance 'api' và cung cấp chỉ đường dẫn endpoint tương đối
        const response = await api.get(`/comments/${mangaId}`);
        setComments(response.data);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load comments:', err); // Thêm log chi tiết lỗi
      setError('Failed to load comments');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !mangaId) {
      setError('Comment content or Manga ID is missing.');
      return;
    }

    try {
      // Sử dụng instance 'api' và cung cấp chỉ đường dẫn endpoint tương đối
      await api.post(`/comments/${mangaId}`, {
        content: newComment,
      });

      setNewComment('');
      setError('');
      fetchComments(); // Fetch comments again to update the list

    } catch (err) {
      console.error('Failed to post comment:', err); // Thêm log chi tiết lỗi
      setError('Failed to post comment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading w-8 h-8 border-8 rounded-full border-t-slate-900 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-4 items-center w-full">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-3 rounded-md bg-stone-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-stone-900 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-blue-400 font-medium">{comment.user?.username}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-white">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 