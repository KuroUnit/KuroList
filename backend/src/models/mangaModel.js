import axios from 'axios';

const MANGADEX_API_URL = 'https://api.mangadex.org';

const excludedTagIDs = [
  "2bd2e8d0-f146-434a-9b51-fc9ff2c5fe6a", "2d1f5d56-a1e5-4d0d-a961-2193588b08ec",
  "5920b825-4181-4a17-beeb-9918b0ff7a30", "5bd0e105-4481-44ca-b6e7-7544da56b1a3",
  "65761a2a-415e-47f3-bef2-a9dababba7a6", "9467335a-1b83-4497-9231-765337a00b96",
  "97893a4c-12af-4dac-b6be-0dffb353568e", "9ab53f92-3eed-4e9b-903a-917c86035ee3",
  "a3c67850-4684-404e-9b7f-c69850ee5da6", "aafb99c1-7f60-43fa-b75f-fc9502ce29c7",
  "acc803a4-c95a-4c22-86fc-eb6b582d82a2", "b13b2a48-c720-44a9-9c77-39c9979373fb",
  "ddefd648-5140-4e5f-ba18-4eca4071d19b", "fad12b5e-68ba-460e-b933-9ae8318f5b65"
];

export const mangaModel = {

  search: async (searchParams) => {
    // Parametros fixos
    const params = {
      ...searchParams,
      'contentRating[]': 'safe',
      'includes[]': 'cover_art',
      'excludedTags[]': excludedTagIDs,
    };

    const response = await axios.get(`${MANGADEX_API_URL}/manga`, { params });
    const apiData = response.data;

    // Formatando a resposta para enviar somente o necessário para o frontend
    const formattedMangas = apiData.data.map((manga) => {
      const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
      const fileName = coverArt?.attributes?.fileName;

      return {
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
        description: manga.attributes.description.en || 'No description available.',
        status: manga.attributes.status,
        year: manga.attributes.year,
        coverFileName: fileName || null,
      };
    });

    return {
      total: apiData.total,
      mangas: formattedMangas,
    };
  },
};