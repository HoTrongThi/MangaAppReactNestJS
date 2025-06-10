import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { PopularManga } from './components/PopularManga';
import { LatestManga } from './components/LatestManga';
import { MangaByTag } from './components/MangaByTag';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { ReadingHistory } from './components/ReadingHistory';
import { Comments } from './components/Comments';
import { Dashboard } from './components/Admin/Dashboard';
import AddChapterForm from './components/Contributor/AddChapterForm';

const App = () => {
  return (
    <div className="min-h-screen bg-stone-950">
      {/* NavBar được render trong main.jsx */}
      {/* Routes được định nghĩa trong main.jsx */}
      {/* Các component khác sẽ được render dựa trên Routes trong main.jsx */}
    </div>
  );
};

export default App;
