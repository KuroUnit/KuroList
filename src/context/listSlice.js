import { createSlice } from "@reduxjs/toolkit";

export const listSlice = createSlice({
  name: 'list',
  initialState: {lists: []},
  reducers: {
    set_list: (state, action) => {
      state.lists = [
        ...state.lists,
        action.payload
      ]
    },
    del_list: (state, action) => {
      state.lists = state.lists.filter(list => list.id !== action.payload)
    },
    set_manga_to_list: (state, action) => {
      const {listId, newManga} = action.payload
      let list = state.lists.find(list => list.id === listId)
      if (list && !list.mangas.find(manga => manga.id === newManga.id)){
        list.mangas = [...list.mangas, newManga];
      }
    },
    del_manga_from_list: (state, action) => {
      const {listId, mangaId} = action.payload
      let list = state.lists.find(list => list.id === listId)
      if (list && Array.isArray(list.mangas)) list.mangas = list.mangas.filter(manga => manga.id !== mangaId);
    }
  }
});
export const map_lists = (state) => state.list.lists;
export const listAction = listSlice.actions;
export default listSlice.reducer;