import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getMangaByTag, getMangaCover } from '../helpers/mangaApi';

export const MangaByTag = () => {
  const { tagId } = useParams();
  const location = useLocation();
  const { tagName: initialTagName } = location.state || {};

  const [mangas, setMangas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [tagName, setTagName] = useState(initialTagName || 'Loading Tag...');

  useEffect(() => {
    console.log('Fetching manga for tagId:', tagId);
    fetchManga();
  }, [page, tagId]);

  const fetchManga = async () => {
    try {
      const response = await getMangaByTag(tagId, 20 * page);
      console.log('API Response for tagId', tagId, ':', response);

      if (response.result === 'ok' && response.data) {
        setMangas(response.data);
        setHasMore(response.data.length === 20 * page);

        if (!initialTagName && response.data.length > 0) {
           const tag = response.data[0].relationships.find(
             rel => rel.type === 'tag' && rel.id === tagId
           );
           if (tag && tag.attributes && tag.attributes.name && tag.attributes.name.en) {
             setTagName(tag.attributes.name.en);
           }
        }

      } else {
        console.error('API returned an error:', response.errors);
        setMangas([]);
        setHasMore(false);
        if (!initialTagName) setTagName('Error loading tag');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching manga by tag:', error);
      setMangas([]);
      setHasMore(false);
      if (!initialTagName) setTagName('Error loading tag');
      setIsLoading(false);
    }
  };

  const MangaCard = ({ manga }) => {
    const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
    const coverUrl = coverArt ? getMangaCover(manga.id, coverArt.attributes.fileName) : '';

    return (
      <Link
        to={`/manga/${manga.attributes.title.en}`}
        state={manga.id}
        className="flex flex-col w-48 bg-stone-900 rounded-lg overflow-hidden hover:bg-stone-800 transition-colors"
      >
        <img
          src={coverUrl}
          alt={manga.attributes.title.en}
          className="w-full h-64 object-cover"
        />
        <div className="p-2">
          <h3 className="text-white font-semibold truncate">
            {manga.attributes.title.en}
          </h3>
        </div>
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading w-8 h-8 border-8 rounded-full border-t-slate-900 animate-spin"></div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0037A5' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {tagName ? `${tagName} Manga` : 'Loading Tag...'}
          </h1>
          <Link to="/" className="text-blue-500 hover:text-blue-400">
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mangas.map((manga) => (
            <MangaCard key={manga.id} manga={manga} />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage(page + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 