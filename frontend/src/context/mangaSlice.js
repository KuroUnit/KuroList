import { createSlice } from "@reduxjs/toolkit";
import apiClient from '../axiosConfig';

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

    const params = {
      limit: pagination.limit,
      offset: pagination.offset,
    };
    if (title) {
      params.title = title;
    }

    const response = await apiClient.get("/mangas", {
      headers: {'Authorization': token},
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

export const find_manga_id = (mangaId) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;

      if (!token) {
        throw new Error("Tentativa de buscar mangá por ID sem token.");
      }

      const response = await apiClient.get(`/mangas/${mangaId}`, {
        headers: { 'Authorization': token }
      });

      return response.data.manga;
    } catch (error) {
      console.error("Erro ao buscar o mangá por ID:", error.response ? error.response.data : error.message);
      throw error;
    }
  };
};

export const get_cover_image = ({ mangaId, fileName }) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;

      if (!token) {
        throw new Error("Tentativa de buscar a capa do mangá sem token.");
      }
      
      const response = await apiClient.get(
        `/mangas/cover?mangaId=${mangaId}&fileName=${fileName}`,
        {
          headers: { 'Authorization': token },
          responseType: 'blob', // Definindo o tipo de conteúdo esperado
        }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Erro ao buscar a capa de um manga na API:", error.response ? error.response.data : error.message)
      throw error
    }
  }
}