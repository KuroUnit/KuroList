import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

import { excludedTagIDs } from "../excluded_tags_ids"; 

export const mangaSlice = createSlice({
  name: 'manga',
  initialState: {
    mangas: [],
    pagination:
    {
      limit: 48,
      offset: 0
    },
    search: '',
    total: 10000
  },
  reducers: {
    set_mangas: (state, action) => {
      state.mangas = action.payload
      return state;
    },
    set_pagination: (state, action) => {
      state.pagination = {
        ...(state.pagination),
        ...(action.payload)
      }
      return state;
    },
    set_total: (state, action) => {
      state.total = action.payload
      return state;
    },
    set_search: (state, action) => {
      state.search = action.payload
      return state;
    }
  }
});
export const map_search = (state) => state.manga.search;
export const map_total = (state) => state.manga.total;
export const map_pagination = (state) => state.manga.pagination;
export const map_mangas = (state) => state.manga.mangas;
export const mangaActions = mangaSlice.actions;

export default mangaSlice.reducer;

const BACKEND_PROXY_BASE_URL = 'https://backend-proxy-mdex.onrender.com'

export const find_mangas = (pagination = { limit: 48, offset: 0 }, title = false) => async (dispatch) => {
  try {
    const proxyUrl = `${BACKEND_PROXY_BASE_URL}/api/manga-proxy`;

    const resp = await axios({
      method: 'GET',
      url: proxyUrl,
      params: {
        'limit': pagination.limit,
        'offset': pagination.offset,
        'excludedTags[]': excludedTagIDs,
        'contentRating[]': ['safe'],
        'includes[]': ['cover_art'],
        ...(title && { 'title': title })
      }
    });
    const api_response = resp.data;

    // Definido dessa forma por causa do limite do offset + limit da api que deve ser menor que 10000
    dispatch(mangaActions.set_total(Math.min(api_response.total, 10000)));

    const mangasData = api_response.data.map((manga) => {
      const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
      const fileName = coverRel?.attributes?.fileName;

      return {
        id: manga.id,
        title: manga.attributes.title.en,
        description: manga.attributes.description.en,
        status: manga.attributes.status,
        year: manga.attributes.year,
        genre: manga.attributes.tags
          .filter((tag) => tag.attributes.group === 'genre')
          .map(tag => tag.attributes.name.en),
        coverUrl: fileName
        ? `${BACKEND_PROXY_BASE_URL}/api/image-cover-proxy?mangaId=${manga.id}&fileName=${encodeURIComponent(fileName)}`
        : null
      };
    });
    dispatch(mangaActions.set_mangas(mangasData));

  } catch (error) {
    console.error("Erro ao buscar mangas via proxy:", error.response ? error.response.data : error.message)
  }
};