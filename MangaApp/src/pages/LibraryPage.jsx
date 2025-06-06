import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { getMangaById } from '../helpers/getMangaById'; // Import the helper to fetch manga details
import { LibraryItem } from '../components/LibraryItem'; // Import the component to display each manga item

export const LibraryPage = () => {
  // console.log('LibraryPage component rendered');
  const [bookmarkedMangaDetails, setBookmarkedMangaDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log('LibraryPage useEffect triggered');
    const fetchBookmarkedManga = async () => {
      try {
        // console.log('Fetching bookmarked manga IDs...');
        setIsLoading(true);
        setError(null);

        const response = await api.get('/bookmarks');
        const bookmarkedMangaIds = response.data;

        // console.log('Bookmarked Manga IDs fetched:', bookmarkedMangaIds);

        if (bookmarkedMangaIds.length > 0) {
          const mangaDetailsPromises = bookmarkedMangaIds.map(async (mangaId) => {
            try {
              const mangaData = await getMangaById(mangaId);
              const data = mangaData?.data;
              const attributes = data?.attributes;
              const relationships = data?.relationships;

              const coverImage = data?.id && relationships
                ? `https://mangadex.org/covers/${data.id}/${relationships.find(rel => rel.type === 'cover_art')?.attributes?.fileName}`
                : null;

              return {
                id: data?.id,
                title: attributes?.title?.en || attributes?.title?.[Object.keys(attributes.title)[0]] || 'Unknown Title',
                cover: coverImage,
              };
            } catch (fetchError) {
              console.error(`Error fetching details for manga ID ${mangaId}:`, fetchError);
              return null;
            }
          });

          // console.log('Fetching manga details...');
          const mangaDetails = (await Promise.all(mangaDetailsPromises)).filter(manga => manga !== null && manga.id && manga.title && manga.cover);
          // console.log('Manga details fetched:', mangaDetails);
          setBookmarkedMangaDetails(mangaDetails);
        } else {
          // console.log('No bookmarked manga found.');
          setBookmarkedMangaDetails([]);
        }

        setIsLoading(false);
        // console.log('Finished fetching bookmarked manga.');

      } catch (err) {
        console.error('Error fetching bookmarked manga IDs or details:', err);
        setError('Failed to load library');
        setIsLoading(false);
        // console.log('Error during fetch.');
      }
    };

    fetchBookmarkedManga();
  }, []);

  if (isLoading) {
    return <div className="text-white text-center mt-8">Loading library...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    // Adjusted padding and min-height for better layout
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">Library</h2>
      {/* Adjusted grid columns to match MangaByTag for consistency */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        {bookmarkedMangaDetails.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">Your library is empty.</p>
        ) : (
          bookmarkedMangaDetails.map(manga => (
            <LibraryItem key={manga.id} manga={manga} />
          ))
        )}
      </div>
    </div>
  );
}; 