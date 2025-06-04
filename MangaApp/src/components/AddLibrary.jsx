import React from "react";
import { useLibraryAdd } from "../hooks/useLibraryAdd";
import { useNavigate } from "react-router-dom";

export const AddLibrary = ({ cover, title, id }) => {
  const { isInLibrary, isLoading, error, changeLibraryValue, isAuthenticated } = useLibraryAdd(id);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleAddToLibrary = async () => {
    if (!user) {
      console.log('No user found, redirecting to login');
      // Lưu thông tin manga hiện tại vào localStorage để sau khi đăng nhập có thể quay lại
      localStorage.setItem('pendingLibraryAdd', JSON.stringify({ cover, title, id }));
      navigate('/login');
      return;
    }

    try {
      console.log('Attempting to change library value');
      await changeLibraryValue();
      console.log('Library value changed successfully');
    } catch (error) {
      console.error('Error in handleAddToLibrary:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => navigate('/login')}
        className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
      >
        Login to Add to Library
      </button>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <button
      onClick={handleAddToLibrary}
      className={`px-4 py-2 rounded-md ${
        isInLibrary
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-blue-500 hover:bg-blue-600'
      } text-white transition-colors`}
    >
      {isInLibrary ? 'Remove from Library' : 'Add to Library'}
    </button>
  );
};
