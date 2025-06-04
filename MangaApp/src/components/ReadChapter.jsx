import React from "react";
import { useGetPages } from "../hooks/useGetPages";
import { MangaPage } from "./MangaPage";
import { useLocation } from "react-router-dom";

export const ReadChapter = () => {
  const { baseUrl, data, hash } = useGetPages();
  const { state } = useLocation();

  React.useEffect(() => {
    if (state && state.mangaTitle) {
      const readingHistory = JSON.parse(localStorage.getItem('readingHistory')) || [];
      const newHistoryItem = {
        mangaTitle: state.mangaTitle,
        chapterNumber: state.chapter,
        cover: state.cover,
        timestamp: new Date().toISOString()
      };

      // Remove old entry if exists
      const filteredHistory = readingHistory.filter(
        item => !(item.mangaTitle === state.mangaTitle && item.chapterNumber === state.chapter)
      );

      // Add new entry at the beginning
      filteredHistory.unshift(newHistoryItem);

      // Keep only last 50 entries
      const trimmedHistory = filteredHistory.slice(0, 50);

      localStorage.setItem('readingHistory', JSON.stringify(trimmedHistory));
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center w-full h-screen bg-neutral-800 overflow-auto">
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
