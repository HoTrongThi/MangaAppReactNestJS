export const getChapterPages = async (chapterId) => {
  if (!chapterId) {
    throw new Error('Chapter ID is required');
  }

  try {
    const url = `https://api.mangadex.org/at-home/server/${chapterId}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch chapter pages: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chapter pages:', error);
    throw error;
  }
};
