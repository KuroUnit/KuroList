import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {open: true, drawer: 'Mangas'},
  reducers: {
    set_open: (state, action)=>{
      state.open = action.payload
      return state;
    },
    set_drawer: (state, action)=>{
      state.drawer = action.payload
      console.log(state.drawer)
      return state;
    }
  }
});
export const map_drawer = (state) => state.ui.drawer
export const map_open = (state) => state.ui.open
export const uiActions = uiSlice.actions

export default uiSlice.reducer;