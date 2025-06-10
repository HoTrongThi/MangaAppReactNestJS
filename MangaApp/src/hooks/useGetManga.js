import { getChapterList } from "../helpers/getChapterList";
import { getMangaById } from "../helpers/getMangaById";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useGetManga = () => {
  const { state } = useLocation();
  const { id, source, rawId } = state || {};

  const [mangaData, setMangaData] = useState();
  const [chapterList, setChapterList] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const { data } = !!mangaData && mangaData;
  const { attributes, relationships } = !!data && data;

  const coverImage =
    !!relationships &&
    `https://mangadex.org/covers/${data.id}/${relationships[2].attributes.fileName}`;

  const getManga = async () => {
    if (source === 'database') {
      const response = await fetch(`http://localhost:3001/api/manga/${rawId}`);
      const data = await response.json();
      setMangaData({ data });
      setChapterList(data.chapters || []);
    } else {
      setMangaData(await getMangaById(rawId, source));
      setChapterList(Object.values(await getChapterList(rawId, source)).reverse());
    }
  };

  useEffect(() => {
    getManga();
  }, []);

  useEffect(() => {
    if ((source === 'database' && mangaData) || (attributes && chapterList)) {
      setIsLoaded(true);
    }
  }, [mangaData, attributes, chapterList, source]);

  return {
    isLoaded,
    coverImage,
    mangaData,
    attributes,
    relationships,
    data,
    chapterList,
    source,
  };
};
