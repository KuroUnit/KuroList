import { createSlice } from "@reduxjs/toolkit";
import apiClient from '../axiosConfig';

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    lists: [],
    status: 'idle',
    success_msg: null,
    selected_id: null,
  },
  reducers: {
    set_loading: (state) => {
      state.status = 'loading';
      state.error = null;
      return state;
    },
    set_success: (state) => {
      state.status = 'succeeded';
      state.error = null;
      return state;
    },

    set_error: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      return state;
    },
    set_message: (state, action) => {
      state.success_msg = action.payload;
      return state;
    },

    set_lists: (state, action) => {
      if(!Array.isArray(action.payload)) {
        state.lists = [action.payload]
      }
      else state.lists = action.payload
      return state;
    },
    add_list: (state, action) => {
      state.lists.push(action.payload);
      return state;
    },
    rm_list: (state, action) => {
      const newLists = state.lists.filter(list => list.id !== action.payload.id);
      state.lists = newLists;
      return state;
    },
    up_list: (state, action) => {
      const newLists = state.lists.map(list => 
        list.id === action.payload.id ? action.payload : list
      );
      state.lists = newLists;
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
export const map_list_msg = (state) => state.list.success_msg;
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

    const response = await apiClient.get(`/lists`, {
      headers: { 'Authorization': token },
    });

    dispatch(listActions.set_success());
    dispatch(listActions.set_lists(response.data.lists));
  } catch (err) {
    console.error(err)
    const errorMessage = err.response?.data?.errors[0]?.msg || 'Falha ao buscar as listas.';
    dispatch(listActions.set_error(errorMessage));
  }
};

export const create_list = (listData) => async (dispatch, getState) => {
  dispatch(listActions.set_loading());
  
  try {
    const token = getState().auth.token;

    const response = await apiClient.post(`/lists`, listData, {
      headers: { 'Authorization': token },
    });
    
    dispatch(listActions.set_success());
    dispatch(listActions.add_list(response.data.list));
    dispatch(listActions.set_message(response.data.msg));
  } catch (err) {
    const errorMessage = err.response?.data?.errors[0]?.msg || 'Falha ao criar a lista.';
    dispatch(listActions.set_error(errorMessage));
  }
};
export const delete_list = (listId) => async (dispatch, getState) => {
  dispatch(listActions.set_loading());
  
  try {
    const token = getState().auth.token;
    
    const response = await apiClient.delete(`/lists/${listId}`, {
      headers: { 'Authorization': token },
    });
    dispatch(listActions.set_success());
    dispatch(listActions.rm_list(response.data.list));
    dispatch(listActions.set_message(response.data.msg));
  } catch (err) {
    const errorMessage = err.response?.data?.errors[0]?.msg || 'Falha ao remover a lista.';
    dispatch(listActions.set_error(errorMessage));
  }
};

export const update_list = (listId, mangaId, operation) => async (dispatch, getState) => {
  dispatch(listActions.set_loading());
  
  try {
    const token = getState().auth.token;

    const responseManga = await apiClient.get(`/mangas/${mangaId}`, 
      { headers: { 'Authorization': token } }
    );
    const manga = responseManga.data
    
    const response = await apiClient.patch(`/lists/${listId}`, 
      { manga, operation },
      { headers: { 'Authorization': token } }
    );

    dispatch(listActions.set_success());
    dispatch(listActions.up_list(response.data.list));
    dispatch(listActions.set_message(response.data.msg));
  } catch (err) {
    const errorMessage = err.response?.data?.errors[0]?.msg || 'Falha ao atualizar a lista.';
    dispatch(listActions.set_error(errorMessage));
  }
};