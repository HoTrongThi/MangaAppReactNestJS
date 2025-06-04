import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const Comments = () => {
  const { mangaId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [mangaId]);

  const fetchComments = async () => {
    try {
      // TODO: Implement actual comments fetching logic
      // For now, just get from localStorage
      const mangaComments = JSON.parse(localStorage.getItem(`comments_${mangaId}`)) || [];
      setComments(mangaComments);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load comments');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setError('Please login to comment');
        return;
      }

      const comment = {
        id: Date.now(),
        text: newComment,
        user: user.email,
        timestamp: new Date().toISOString(),
      };

      const updatedComments = [...comments, comment];
      localStorage.setItem(`comments_${mangaId}`, JSON.stringify(updatedComments));
      setComments(updatedComments);
      setNewComment('');
      setError('');
    } catch (err) {
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
        <div className="flex gap-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 p-3 rounded-md bg-stone-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 self-end"
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
                <span className="text-blue-400 font-medium">{comment.user}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-white">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 