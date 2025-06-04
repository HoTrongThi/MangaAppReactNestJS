const BASE_URL = 'https://api.mangadex.org';

export const getPopularManga = async (limit = 6) => {
  const response = await fetch(
    `${BASE_URL}/manga?limit=${limit}&order[rating]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art`
  );
  return response.json();
};

export const getLatestManga = async (limit = 6) => {
  const response = await fetch(
    `${BASE_URL}/manga?limit=${limit}&order[updatedAt]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art`
  );
  return response.json();
};

export const getMangaByTag = async (tagId, limit = 20) => {
  const response = await fetch(
    `${BASE_URL}/manga?limit=${limit}&includedTags[]=${tagId}&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art`
  );
  return response.json();
};

export const getAllTags = async () => {
  const response = await fetch(`${BASE_URL}/manga/tag`);
  return response.json();
};

export const getMangaCover = (mangaId, fileName) => {
  return `https://mangadex.org/covers/${mangaId}/${fileName}`;
}; 