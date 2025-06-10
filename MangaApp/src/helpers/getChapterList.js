export const getChapterList = async (id, source) => {
  if (source === 'database') {
    const res = await fetch(`http://localhost:3001/api/manga/${id}/chapters`);
    return await res.json();
  } else {
    const respuesta = await fetch(
      `https://api.mangadex.org/manga/${id}/aggregate?translatedLanguage%5B%5D=en`
    );
    const { volumes } = await respuesta.json();
    return volumes;
  }
};
