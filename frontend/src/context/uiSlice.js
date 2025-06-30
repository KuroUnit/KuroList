import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    drawer_open: true, 
    drawer: 'Mangas', 
    open_list: false, 
    open_create_list: false,
    alert: false
  },
  reducers: {
    set_drawer_open: (state, action)=>{
      state.drawer_open = action.payload
      return state;
    },
    set_drawer: (state, action)=>{
      state.drawer = action.payload
      return state;
    },
    open_create_list: (state)=>{
      state.open_create_list = true
      return state;
    },
    close_create_list: (state)=>{
      state.open_create_list = false
      return state;
    },
    open_list: (state)=>{
      state.open_list = true
      return state;
    },
    close_list: (state)=>{
      state.open_list = false
      return state;
    },
    set_alert: (state, action) => {
      state.alert = action.payload
    }
  }
});
export const map_alert = (state) => state.ui.alert
export const map_open_create_list = (state) => state.ui.open_create_list
export const map_open_list = (state) => state.ui.open_list
export const map_drawer = (state) => state.ui.drawer
export const map_drawer_open = (state) => state.ui.drawer_open
export const uiActions = uiSlice.actions

export default uiSlice.reducer;