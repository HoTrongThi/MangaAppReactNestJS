import { getCoverImage } from "./getCoverImage";

export const getSearch = async (manga) => {
  // Gọi API backend
  const backendUrl = `http://localhost:3001/api/manga/search?query=${encodeURIComponent(manga)}`;
  let backendData = [];
  try {
    const backendResponse = await fetch(backendUrl);
    if (backendResponse.ok) {
      const data = await backendResponse.json();
      backendData = Array.isArray(data) ? data : [];
    }
  } catch (e) {
    backendData = [];
  }

  // Chuẩn hóa dữ liệu backend
  const backendMangas = backendData.map((item) => {
    let cover = '';
    if (item.coverFileName) {
      if (item.coverFileName.startsWith('http')) {
        cover = item.coverFileName;
      } else {
        cover = `/uploads/${item.coverFileName}`;
      }
    }
    return {
      id: `db-${item.id}`,
      title: item.title,
      attributes: {
        title: { en: item.title },
        description: { en: item.description },
        author: item.author,
        status: item.status,
        genres: item.genres || [],
      },
      cover,
      source: 'database',
    };
  });

  // Gọi API MangaDex
  const apiUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(manga)}`;
  let apiData = [];
  try {
    const apiResponse = await fetch(apiUrl);
    const apiJson = await apiResponse.json();
    apiData = Array.isArray(apiJson.data) ? apiJson.data : [];
  } catch (e) {
    apiData = [];
  }

  // Chuẩn hóa dữ liệu MangaDex
  const apiMangas = [];
  for (let i = 0; i < apiData.length; i++) {
    const actualManga = apiData[i];
    let mangaId = actualManga.id;
    let mangaAttributes = actualManga.attributes;
    let mangaTitle = actualManga.attributes.title.en;
    let mangaCover = await getCoverImage(actualManga.id);

    apiMangas.push({
      id: `api-${mangaId}`,
      title: mangaTitle,
      attributes: mangaAttributes,
      cover: mangaCover,
      source: 'api',
    });
  }

  // Gộp hai nguồn, ưu tiên không trùng lặp theo title + author
  const allMangas = [...backendMangas];
  apiMangas.forEach((apiManga) => {
    const isDuplicate = backendMangas.some(
      (dbManga) =>
        (dbManga.title || '').toLowerCase() === (apiManga.title || '').toLowerCase() &&
        ((dbManga.attributes.author || '').toLowerCase() === (apiManga.attributes.author || '').toLowerCase())
    );
    if (!isDuplicate) {
      allMangas.push(apiManga);
    }
  });

  return allMangas;
};
