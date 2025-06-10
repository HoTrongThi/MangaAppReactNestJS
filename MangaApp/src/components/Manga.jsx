import React from "react";
import { useGetManga } from "../hooks/useGetManga";
import { AddLibrary } from "./AddLibrary";
import { Tag } from "./Tag";
import { Volume } from "./Volume";
import { Comments } from "./Comments";
import { Link } from "react-router-dom";

export const Manga = () => {
  const { isLoaded, coverImage, attributes, data, chapterList, mangaData, source } = useGetManga();

  // Phân biệt nguồn dữ liệu
  let title, description, author, cover, status;
  if (source === 'database' && data) {
    title = data.title;
    description = data.description;
    author = data.author;
    cover = data.coverFileName?.startsWith('http') ? data.coverFileName : `/uploads/${data.coverFileName}`;
    status = data.status;
  } else if (attributes) {
    title = attributes.title.en;
    description = attributes.description.en;
    author = attributes.author;
    cover = coverImage;
    status = attributes.status;
  }

  return (
    <div
      className={`flex ${
        !isLoaded && "justify-center"
      } items-center h-screen flex-col gap-2 lg:p-4 p-1 overflow-auto`}
    >
      {!isLoaded ? (
        <div className="loading w-4 h-4 border-8 p-4 rounded-full border-t-slate-900 animate-spin"></div>
      ) : (
        <>
          <div className="flex flex-wrap lg:flex-nowrap lg:h-2/5 lg:w-auto w-full justify-center items-center gap-6">
            <img
              className="lg:h-full lg:w-auto h-auto max-w-full rounded-md"
              src={cover}
              alt={title && `${title} cover`}
            />

            <div className="flex flex-col lg:h-full w-full p-2 gap-2 lg:p-0 justify-evenly">
              <h1 className="text-white font-bold text-4xl max-w-full">
                {title}
              </h1>
              <p className="text-white max-w-full break-words lg:h-1/4 overflow-auto">
                {description}
              </p>
              <span className="text-white capitalize flex gap-2 items-center">
                Status:
                {status === "ongoing" ? (
                  <div className="w-3 h-3 aspect-square bg-green-400 rounded-full"></div>
                ) : (
                  <div className="w-3 h-3 aspect-square bg-red-700 rounded-full"></div>
                )}
                {status}
              </span>
              <div className="flex gap-1 flex-wrap">
                {attributes &&
                  attributes.tags &&
                  attributes.tags.map((tag) => (
                    <Tag
                      key={tag.attributes.name.en}
                      tag={tag.attributes.name.en}
                    />
                  ))}
              </div>
              <AddLibrary
                cover={cover}
                title={title}
                id={data && data.id}
              />
            </div>
          </div>

          <hr className="w-full" />

          {/* Hiển thị danh sách chapter cho cả hai nguồn */}
          {source === 'database' && Array.isArray(chapterList) && chapterList.length > 0 && (
            <div>
              <h2 className="text-white text-2xl font-bold mb-2">Chapters</h2>
              {chapterList.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/manga/read/${chapter.id}`}
                  state={{ chapterId: chapter.id, source: 'database', mangaId: data.id }}
                  className="bg-neutral-800 p-2 rounded mb-2 block hover:bg-neutral-700 transition"
                >
                  <span className="text-white font-semibold">Chapter {chapter.chapterNumber}: {chapter.title}</span>
                </Link>
              ))}
            </div>
          )}
          {source !== 'database' && chapterList && Array.isArray(chapterList) && chapterList.length > 0 && (
            <>
              {chapterList.map((volume, idx) => (
                <Volume
                  key={volume.volume || idx}
                  title={title}
                  mangaId={data.id}
                  volumen={volume}
                />
              ))}
            </>
          )}

          {data && <Comments mangaId={data.id} />}
        </>
      )}
    </div>
  );
};
