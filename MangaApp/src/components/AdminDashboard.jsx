import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reportedComments, setReportedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Implement actual admin data fetching logic
      // For now, just get from localStorage
      const adminUsers = JSON.parse(localStorage.getItem('users')) || [];
      const adminReportedComments = JSON.parse(localStorage.getItem('reportedComments')) || [];
      setUsers(adminUsers);
      setReportedComments(adminReportedComments);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load admin data');
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    // TODO: Implement actual user deletion logic
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleDeleteComment = (commentId) => {
    // TODO: Implement actual comment deletion logic
    const updatedComments = reportedComments.filter(comment => comment.id !== commentId);
    setReportedComments(updatedComments);
    localStorage.setItem('reportedComments', JSON.stringify(updatedComments));
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <Link to="/" className="text-blue-500 hover:text-blue-400">
          Back to Home
        </Link>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Section */}
        <div className="bg-stone-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Users</h2>
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-gray-400">No users found</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center bg-stone-800 p-4 rounded-lg"
                >
                  <div>
                    <h3 className="text-white font-semibold">{user.email}</h3>
                    <p className="text-gray-400 text-sm">
                      Joined: {new Date(user.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reported Comments Section */}
        <div className="bg-stone-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Reported Comments</h2>
          <div className="space-y-4">
            {reportedComments.length === 0 ? (
              <p className="text-gray-400">No reported comments</p>
            ) : (
              reportedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-stone-800 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-blue-400 font-medium">{comment.user}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white mb-2">{comment.text}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 text-sm">
                      Reports: {comment.reportCount}
                    </span>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 