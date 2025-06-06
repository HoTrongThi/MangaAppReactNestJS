import React from "react";
// import { useState } from "react"; // No longer needed as loading state is handled by parent
import { Link } from "react-router-dom";

export const LibraryItem = ({ manga }) => {
  // const [isLoaded, setIsLoaded] = useState(false); // Removed

  const { id, title, cover } = manga; // manga object contains id (MangaDex ID), title, cover (URL)

  // Use the MangaDex ID in the Link's 'state' prop as before
  // The 'to' prop can use the title, but be aware of potential issues with special characters
  // A more robust approach might be to route by ID, but that requires changes in Manga.jsx
  const mangaLinkTo = `/manga/${encodeURIComponent(title)}`; // Encode title for URL safety

  return (
    // Applied styling similar to MangaCard for consistency
    <Link
      key={id} // Key is actually applied in the map in LibraryPage
      to={mangaLinkTo}
      state={id} // Pass MangaDex ID via state
      className="flex flex-col bg-stone-900 rounded-lg overflow-hidden hover:bg-stone-800 transition-colors"
    >
      {/* Removed per-item loading spinner */}
      
      <img
        // Removed onLoad handler
        loading="lazy"
        // Adjusted image styling to match MangaCard
        className="w-full h-64 object-cover"
        src={cover}
        alt={title}
      />
      {/* Added padding and adjusted title styling to match MangaCard */}
      <div className="p-2">
        <h3 className="text-white font-semibold truncate">
          {title}
        </h3>
      </div>
    </Link>
  );
};
