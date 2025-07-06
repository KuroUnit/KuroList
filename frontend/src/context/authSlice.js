import { createSlice } from "@reduxjs/toolkit";
import apiClient from '../axiosConfig';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      window.location.href = '/login';
      state.token = null
      state.loading = false;
      state.error = null;
      return state;
    },
    set_loading: (state) => {
      state.loading = true;
      state.error = null;
    },
    set_success: (state, action) => {
      state.loading = false;
      state.token = `Bearer ${action.payload.token}`;
      state.error = null;
    },
    set_error: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clear_error: (state) => {
      state.error = null;
    }
  }
});
export const map_error = (state) => state.auth.error
export const map_loading = (state) => state.auth.loading
export const map_token = (state) => state.auth.token
export const authActions = authSlice.actions;
export default authSlice.reducer;


export const login_user = ({ login, password }) => async (dispatch) => {
  try {
    if (login)
    dispatch(authActions.set_loading());
    const response = await apiClient.post("/auth/login", { login, password });

    localStorage.setItem('token', `Bearer ${response.data.token}`);
    
    dispatch(authActions.set_success(response.data));

  } catch (err) {
    const errorMessage = err.response?.data?.errors[0]?.msg || "Erro de conexão.";
    dispatch(authActions.set_error(errorMessage));
  }
};