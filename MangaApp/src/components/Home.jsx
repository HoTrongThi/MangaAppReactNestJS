import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPopularManga, getLatestManga, getAllTags, getMangaCover } from "../helpers/mangaApi";

export const Home = () => {
  const [popularManga, setPopularManga] = useState([]);
  const [latestManga, setLatestManga] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularData, latestData, tagsData] = await Promise.all([
          getPopularManga(),
          getLatestManga(),
          getAllTags()
        ]);
        
        setPopularManga(popularData.data);
        setLatestManga(latestData.data);
        setTags(tagsData.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const MangaCard = ({ manga }) => {
    const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
    const coverUrl = coverArt ? getMangaCover(manga.id, coverArt.attributes.fileName) : '';

    return (
      <Link
        to={`/manga/${manga.attributes.title.en}`}
        state={{ id: `api-${manga.id}`, source: 'api', rawId: manga.id }}
        className="group relative flex flex-col bg-stone-900/70 rounded-lg overflow-hidden hover:bg-stone-800/70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative overflow-hidden">
          <img
            src={coverUrl}
            alt={manga.attributes.title.en}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold truncate group-hover:text-blue-400 transition-colors">
            {manga.attributes.title.en}
          </h3>
          <div className="mt-2 flex items-center text-sm text-gray-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {manga.attributes.rating?.average?.toFixed(1) || 'N/A'}
            </span>
            <span className="mx-2">•</span>
            <span>{manga.attributes.status}</span>
          </div>
        </div>
      </Link>
    );
  };

  const MangaSection = ({ title, mangas, viewAllLink }) => (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <span className="bg-blue-600 w-1 h-8 mr-3 rounded-full"></span>
          {title}
        </h2>
        <Link
          to={viewAllLink}
          className="text-blue-500 hover:text-blue-400 flex items-center group"
        >
          View All
          <svg 
            className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {mangas.map((manga) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>
    </div>
  );

  const TagCard = ({ tag }) => (
    <Link
      to={`/tag/${tag.id}`}
      state={{ tagName: tag.attributes.name.en }}
      onClick={() => setActiveTag(tag.id)}
      className={`p-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg text-white ${
        activeTag === tag.id
          ? 'bg-blue-600'
          : 'bg-stone-900 hover:bg-stone-800'
      }`}
    >
      <h3 className="font-semibold mb-2">{tag.attributes.name.en}</h3>
      <p className="text-sm text-white line-clamp-2">
        {tag.attributes.description.en}
      </p>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0037A5' }}>
      <div className="container mx-auto px-4 py-8">
        <MangaSection
          title="Popular Manga"
          mangas={popularManga}
          viewAllLink="/popular"
        />
        
        <MangaSection
          title="Latest Updates"
          mangas={latestManga}
          viewAllLink="/latest"
        />

        <div className="mb-12 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center">
              <span className="bg-blue-600 w-1 h-8 mr-3 rounded-full"></span>
              Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tags.map((tag) => (
              <TagCard key={tag.id} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
