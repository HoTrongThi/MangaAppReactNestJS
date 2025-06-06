import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Search } from "./components/Search";
import { Manga } from "./components/Manga";
import { ReadChapter } from "./components/ReadChapter";
import { NavBar } from "./components/NavBar";
import { Home } from "./components/Home";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { ReadingHistory } from "./components/ReadingHistory";
import { Dashboard } from "./components/Admin/Dashboard";
import AddMangaForm from "./components/Admin/AddMangaForm";
import { PopularManga } from "./components/PopularManga";
import { LatestManga } from "./components/LatestManga";
import { MangaByTag } from "./components/MangaByTag";
import { ContributorPanel } from "./pages/ContributorPanel";
import { AuthProvider } from './contexts/AuthContext';
import "./index.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="flex flex-col w-full h-screen" style={{ backgroundColor: '#0037A5' }}>
      <BrowserRouter>
        <AuthProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/popular" element={<PopularManga />} />
            <Route path="/latest" element={<LatestManga />} />
            <Route path="/tag/:tagId" element={<MangaByTag />} />
            <Route path="/mangaSearch/*" element={<Search />} />
            <Route path="/manga/*" element={<Manga />} />
            <Route path="/manga/read/*" element={<ReadChapter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/history" element={<ReadingHistory />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/manga/new" element={<AddMangaForm />} />
            <Route path="/contributor" element={<ContributorPanel />} />
          </Routes>
          <ToastContainer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  </React.StrictMode>
);
