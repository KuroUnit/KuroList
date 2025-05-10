import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {drawer_open: true, drawer: 'Mangas'},
  reducers: {
    set_drawer_open: (state, action)=>{
      state.drawer_open = action.payload
      return state;
    },
    set_drawer: (state, action)=>{
      state.drawer = action.payload
      return state;
    }
  }
});
export const map_drawer = (state) => state.ui.drawer
export const map_drawer_open = (state) => state.ui.drawer_open
export const uiActions = uiSlice.actions

export default uiSlice.reducer;