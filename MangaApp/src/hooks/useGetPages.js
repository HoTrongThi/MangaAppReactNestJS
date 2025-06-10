import { useEffect, useState } from "react";
import { getChapterPages } from "../helpers/getChapterPages";
import { useLocation } from "react-router-dom";

export const useGetPages = () => {
  const { state } = useLocation();

  const [pages, setPages] = useState();

  const getPages = async () => {
    if (!state?.chapterId) {
      console.error('No chapter ID provided');
      return;
    }
    try {
      if (state?.source === 'database') {
        // Lấy chapter từ backend
        const res = await fetch(`http://localhost:3001/api/chapters/id/${state.chapterId}`);
        const chapter = await res.json();
        setPages({ databaseChapter: chapter });
      } else {
        const result = await getChapterPages(state.chapterId);
        setPages(result);
      }
    } catch (error) {
      console.error('Failed to fetch chapter pages:', error);
    }
  };

  const { baseUrl, chapter } = !!pages && pages;
  const { data, hash } = !!chapter && chapter;

  useEffect(() => {
    getPages();
  }, [state?.chapterId]);

  return {
    baseUrl,
    data,
    hash,
    databaseChapter: pages?.databaseChapter,
  };
};
