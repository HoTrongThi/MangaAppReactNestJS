import React, { useEffect, useState, useRef } from "react";
import { useGetPages } from "../hooks/useGetPages";
import { MangaPage } from "./MangaPage";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ReadChapter = () => {
  const { baseUrl, data, hash } = useGetPages();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { mangaId, chapterId, chapterNumber, pageNumber: initialPageNumber } = state || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  // Ref để theo dõi xem lịch sử đã được lưu cho chapter hiện tại chưa
  const historySavedRef = useRef({});

  // Check if we have the required state
  useEffect(() => {
    if (!state?.chapterId || !state?.mangaId) {
      setError('Missing required chapter information');
      return;
    }
  }, [state]);

  // Effect to save history to backend
  useEffect(() => {
    // Tạo một khóa duy nhất cho chapter hiện tại
    const chapterKey = `${mangaId}-${chapterNumber}`;

    // Chỉ lưu nếu mangaId, chapterNumber hợp lệ và lịch sử cho chapter này chưa được đánh dấu đã lưu
    if (!mangaId || !chapterNumber || historySavedRef.current[chapterKey]) {
      console.log('Skipping history save:', { mangaId, chapterNumber, alreadySaved: historySavedRef.current[chapterKey] });
      return;
    }

    const saveHistory = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = userData?.token;

        if (!token) {
          console.warn('User not logged in, history will not be saved.');
          return;
        }

        console.log('Sending mangaId in history request:', mangaId);

        console.log('Sending history update:', {
          mangaId,
          chapterNumber,
          pageNumber: currentPage // Always send the current page when saving history
        });

        const response = await api.post(
          '/history',
          {
            mangaId: mangaId,
            chapterNumber: chapterNumber,
            pageNumber: currentPage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('Reading history saved successfully:', response.data);

        // Đánh dấu chapter này đã được lưu thành công
        historySavedRef.current[chapterKey] = true;

      } catch (error) {
        console.error('Failed to save reading history:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      }
    };

    // Trigger saveHistory when mangaId or chapterNumber changes
    saveHistory();

  }, [mangaId, chapterNumber]); // Dependency array chỉ phụ thuộc vào mangaId và chapterNumber

  // Effect to handle scroll and update currentPage
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !data) return;

    const handleScroll = () => {
      const pages = container.querySelectorAll('.mangaPage');
      let pageIndex = 0;
      for (let i = 0; i < pages.length; i++) {
        const pageRect = pages[i].getBoundingClientRect();
        // Consider page visible if its top edge is within the viewport
        if (pageRect.top < window.innerHeight && pageRect.bottom > 0) {
           // Calculate the visible percentage of the page
           const visibleHeight = Math.min(pageRect.bottom, window.innerHeight) - Math.max(pageRect.top, 0);
           const pageHeight = pageRect.bottom - pageRect.top;
           const visiblePercentage = visibleHeight / pageHeight;

           // If more than 50% of the page is visible, consider it the current page
           if (visiblePercentage > 0.5) {
               pageIndex = i;
           }
        }
      }
      const newPage = pageIndex + 1;
      if (newPage !== currentPage) {
        setCurrentPage(newPage);
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Also run handleScroll initially to set the current page when the component mounts
    handleScroll();
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [data, currentPage]); // Dependency includes currentPage to re-evaluate scroll when page changes

  // New effect to scroll to the initial page number if provided from state
  useEffect(() => {
    if (containerRef.current && data && initialPageNumber && initialPageNumber > 0) {
      const targetPageElement = containerRef.current.querySelector(`.mangaPage:nth-child(${initialPageNumber})`);
      if (targetPageElement) {
        // Use setTimeout to ensure rendering is complete before scrolling
        setTimeout(() => {
          targetPageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100); // Adjust delay if needed
      }
    }
  }, [data, initialPageNumber]); // Dependencies are data (pages loaded) and initialPageNumber

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-neutral-800">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-neutral-800">
        <div className="loading w-8 h-8 border-8 rounded-full border-t-slate-900 animate-spin"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full h-screen bg-neutral-800 overflow-auto">
      {data &&
        data.map((pagina, index) => (
          <MangaPage
            key={index}
            baseUrl={baseUrl}
            hash={hash}
            pagina={pagina}
          />
        ))}
    </div>
  );
};
