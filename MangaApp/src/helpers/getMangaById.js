export const getMangaById = async (rawId, source) => {
  if (source === 'database') {
    const response = await fetch(`http://localhost:3001/api/manga/${rawId}`);
    const data = await response.json();
    return { data };
  } else {
    const url = `https://api.mangadex.org/manga/${rawId}?includes[]=cover_art`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
};
