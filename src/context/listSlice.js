import { createSlice } from "@reduxjs/toolkit";

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    lists: [{id: Date.now(), name: 'My List', mangas: []}], 
    selected: null, 
    current: ''
  },
  reducers: {
    set_list: (state, action) => {
      state.lists = [
        ...state.lists,
        action.payload
      ]
      return state;
    },
    del_list: (state, action) => {
      state.lists = state.lists.filter(list => list.id !== action.payload)
      return state;
    },
    set_manga_to_list: (state, action) => {
      const {listId, newManga} = action.payload
      state.lists = state.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              mangas: list.mangas.some(m => m.id === newManga.id)
                ? list.mangas
                : [...list.mangas, newManga]
            }
          : list
      );
      return state;
    },
    del_manga_from_list: (state, action) => {
      const {listId, mangaId} = action.payload
      state.lists = state.lists.map(list =>
        list.id === listId
          ? {
              ...list,
              mangas: list.mangas.filter(manga => manga.id !== mangaId)
            }
          : list
      );
      return state;
    },
    set_selected_list: (state, action) => {
      state.selected = action.payload;
      return state;
    },
    clear_selected_list: (state) => {
      state.selected = null;
      return state;
    },
    set_current_list: (state, action) => {
      state.current = action.payload
      return state;
    },
    clear_current_list: (state) => {
      state.current = ''
      return state;
    }
  }
});
export const map_lists = (state) => state.list.lists;
export const map_selected_list = (state) => state.list.lists.find(list => list.id === state.list.selected) || null;
export const map_current_list = (state) => state.list.current
export const listActions = listSlice.actions;
export default listSlice.reducer;