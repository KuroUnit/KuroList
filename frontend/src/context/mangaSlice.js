import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';

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
    total: 0
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


export const find_mangas = (pagination = { limit: 48, offset: 0 }, title = false) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;

    if (!token) {
      console.error("Tentativa de buscar mangás sem token.");
      return;
    }

    const apiUrl = `${API_BASE_URL}/mangas/search`;

    const params = {
      limit: pagination.limit,
      offset: pagination.offset,
    };
    if (title) {
      params.title = title;
    }

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': token
      },
      params: params
    });

    const api_response = response.data;

    // Definido dessa forma por causa do limite do offset + limit da api que deve ser menor que 10000
    dispatch(mangaActions.set_total(Math.min(api_response.total, 10000)));
    // Despachando os dados recebidos
    dispatch(mangaActions.set_mangas(api_response.mangas));

  } catch (error) {
    console.error("Erro ao buscar mangas na API:", error.response ? error.response.data : error.message)
  }
};