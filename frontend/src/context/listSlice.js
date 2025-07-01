import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    lists: [],
    status: 'idle',
    selected_id: null,
  },
  reducers: {
    set_loading: (state) => {
      state.status = 'loading';
      state.error = null;
      return state;
    },
    set_success: (state, action) => {
      state.status = 'succeeded';
      state.lists = action.payload;
      return state;
    },
    add_success: (state, action) => {
      state.status = 'succeeded';
      state.lists.push(action.payload);
      return state;
    },
    set_error: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      return state;
    },
    clear_lists: (state) => {
      state.lists = [];
      state.status = 'idle';
      state.error = null;
      state.selected_id = null;
      return state;
    },

    set_selected_list_id: (state, action) => {
      state.selected_id = action.payload;
      return state;
    },
    clear_selected_list_id: (state) => {
      state.selected_id = null;
      return state;
    },
  }
});
export const map_all_lists = (state) => state.list.lists;
export const map_list_status = (state) => state.list.status;
export const map_list_error = (state) => state.list.error;
export const map_selected_list = (state) => {
  if(!state.list.selected_id) return null
  
  return state.list.lists.find(list => list.id === state.list.selected_id);
}
export const listActions = listSlice.actions;
export default listSlice.reducer;


export const get_lists = () => async (dispatch, getState) => {
  
  dispatch(listActions.set_loading());

  try {
    const token = getState().auth.token;

    const response = await axios.get(`${API_BASE_URL}/lists`, {
      headers: { 'Authorization': token },
    });

    dispatch(listActions.set_success(response.data));

  } catch (err) {
    const errorMessage = err.response?.data?.errors[0]?.msg || 'Falha ao buscar as listas.';
    dispatch(listActions.set_error(errorMessage));
  }
};

export const create_list = (listData) => async (dispatch, getState) => {
  dispatch(listActions.set_loading());
  
  try {
    const token = getState().auth.token;

    const response = await axios.post(`${API_BASE_URL}/lists`, listData, {
      headers: { 'Authorization': token },
    });
    
    dispatch(listActions.set_success(response.data));
  } catch (err) {

    const errorMessage = err.response?.data?.errors[0]?.msg || 'Falha ao criar a lista.';
    dispatch(listActions.set_error(errorMessage));
  }
};